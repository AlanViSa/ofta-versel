import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

export const connect = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
};

export const closeDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    return;
  }
  
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

export const clearDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    return;
  }
  
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};

export const getMongoServer = () => mongoServer; 