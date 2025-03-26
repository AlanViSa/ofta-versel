import '@testing-library/jest-dom';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageManager from '../ImageManager';
import * as imageService from '../../services/imageService';

// Mock del servicio de imágenes
jest.mock('../../services/imageService', () => ({
  getAllImages: jest.fn(),
  uploadImage: jest.fn(),
  deleteImage: jest.fn(),
  transformImage: jest.fn(),
  getTransformConfigs: jest.fn()
}));

describe('ImageManager Component', () => {
  const mockImages = [
    { id: '1', name: 'test1.jpg', url: 'http://test.com/test1.jpg', size: 1024 },
    { id: '2', name: 'test2.jpg', url: 'http://test.com/test2.jpg', size: 2048 }
  ];

  const mockTransformConfigs = [
    { id: '1', name: 'config1', width: 100, height: 100 },
    { id: '2', name: 'config2', width: 200, height: 200 }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    imageService.getAllImages.mockResolvedValue(mockImages);
    imageService.getTransformConfigs.mockResolvedValue(mockTransformConfigs);
  });

  it('renders without crashing', async () => {
    await act(async () => {
      render(<ImageManager />);
    });
    expect(screen.getByText('Gestión de Imágenes')).toBeInTheDocument();
  });

  it('displays images from service', async () => {
    await act(async () => {
      render(<ImageManager />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('test1.jpg')).toBeInTheDocument();
      expect(screen.getByText('test2.jpg')).toBeInTheDocument();
      expect(screen.getByText('1.00 KB')).toBeInTheDocument();
      expect(screen.getByText('2.00 KB')).toBeInTheDocument();
    });
  });

  it('shows error message for invalid file type', async () => {
    const file = new File([''], 'test.txt', { type: 'text/plain' });
    
    await act(async () => {
      render(<ImageManager />);
    });

    const input = screen.getByTestId('file-input');
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    await waitFor(() => {
      expect(screen.getByText('Solo se permiten imágenes JPG, PNG, GIF y WEBP')).toBeInTheDocument();
    });
  });

  it('shows error message for file size limit', async () => {
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
    
    await act(async () => {
      render(<ImageManager />);
    });

    const input = screen.getByTestId('file-input');
    await act(async () => {
      fireEvent.change(input, { target: { files: [largeFile] } });
    });

    await waitFor(() => {
      expect(screen.getByText('El archivo excede el tamaño máximo permitido')).toBeInTheDocument();
    });
  });

  it('handles image deletion', async () => {
    imageService.deleteImage.mockResolvedValue({ success: true });
    
    await act(async () => {
      render(<ImageManager />);
    });

    const deleteButton = await screen.findByTestId('delete-button-1');
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    expect(imageService.deleteImage).toHaveBeenCalledWith('1');
    expect(imageService.getAllImages).toHaveBeenCalledTimes(2);
  });

  it('handles image transformation', async () => {
    imageService.transformImage.mockResolvedValue({ success: true });
    
    await act(async () => {
      render(<ImageManager />);
    });

    const transformButton = await screen.findByTestId('transform-button-1');
    await act(async () => {
      fireEvent.click(transformButton);
    });

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();

    const widthInput = screen.getByLabelText('Ancho');
    const heightInput = screen.getByLabelText('Alto');

    await act(async () => {
      fireEvent.change(widthInput, { target: { value: '300' } });
      fireEvent.change(heightInput, { target: { value: '200' } });
    });

    const transformButton2 = screen.getByText('Transformar');
    await act(async () => {
      fireEvent.click(transformButton2);
    });

    expect(imageService.transformImage).toHaveBeenCalledWith('1', { width: '300', height: '200' });
    expect(imageService.getAllImages).toHaveBeenCalledTimes(2);
  });

  it('handles refresh button click', async () => {
    await act(async () => {
      render(<ImageManager />);
    });

    const refreshButton = screen.getByTestId('refresh-button');
    await act(async () => {
      fireEvent.click(refreshButton);
    });

    expect(imageService.getAllImages).toHaveBeenCalledTimes(2);
  });
}); 