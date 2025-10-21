import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../Models/User.js';

interface AuthResponse {
  user: any;
  token: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export const authService = {
  async register(userData: RegisterData): Promise<AuthResponse> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await User.create({
      ...userData,
      password: hashedPassword
    });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret');
    return { user, token };
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret');
    return { user, token };
  },

  async verifyToken(token: string): Promise<any> {
    return jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
  }
};