import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schemas';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as process from 'node:process';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async register(email: string, password: string): Promise<any> {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new this.userModel({ email, password: hashedPassword });
    await user.save();
    return { message: 'User created successfully' };
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token: string = this.generateJwt(user._id.toString());

    return token;
  }

  private generateJwt(userId: string): string {
    const secretKey = process.env.SECRET_KEY;

    if (!secretKey) {
      throw new Error('SECRET_KEY is not defined in the environment variables');
    }

    const payload = { userId };
    console.log(payload);
    return jwt.sign(payload, secretKey);
  }
}
