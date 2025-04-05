import jwt from 'jsonwebtoken';
import User from '../../models/User';
import { protect, admin, isOwnerOrAdmin } from '../authMiddleware';
import { connect, closeDatabase, clearDatabase } from '../../config/testDb';

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('../../models/User');

beforeAll(async () => {
  await connect();
});

afterAll(async () => {
  await closeDatabase();
});

beforeEach(async () => {
  jest.clearAllMocks();
  await clearDatabase();
});

describe('Auth Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      headers: {},
      user: null,
      params: {}
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    mockNext = jest.fn();
  });

  describe('protect middleware', () => {
    const mockToken = 'test_token';
    const mockUser = {
      _id: 'test_user_id',
      name: 'Test User',
      email: 'test@example.com',
      isAdmin: false
    };

    it('should set user in request if token is valid', async () => {
      mockReq.headers.authorization = `Bearer ${mockToken}`;
      jwt.verify.mockReturnValue({ id: mockUser._id });
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      await protect(mockReq, mockRes, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
      expect(User.findById).toHaveBeenCalledWith(mockUser._id);
      expect(mockReq.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 401 if no token is provided', async () => {
      await protect(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'No autorizado, no hay token'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', async () => {
      mockReq.headers.authorization = `Bearer invalid_token`;
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await protect(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'No autorizado, token inválido'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('admin middleware', () => {
    it('should call next if user is admin', () => {
      mockReq.user = {
        isAdmin: true
      };

      admin(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 403 if user is not admin', () => {
      mockReq.user = {
        isAdmin: false
      };

      admin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'No autorizado, solo administradores'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('isOwnerOrAdmin middleware', () => {
    const userId = 'test_user_id';

    it('should call next if user is owner', () => {
      mockReq.user = {
        _id: userId,
        isAdmin: false
      };
      mockReq.params.userId = userId;

      isOwnerOrAdmin(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should call next if user is admin', () => {
      mockReq.user = {
        _id: 'different_id',
        isAdmin: true
      };
      mockReq.params.userId = userId;

      isOwnerOrAdmin(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 403 if user is not owner or admin', () => {
      mockReq.user = {
        _id: 'different_id',
        isAdmin: false
      };
      mockReq.params.userId = userId;

      isOwnerOrAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'No autorizado'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});