import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto) {
    const { username } = dto;

    const existing = await this.userModel.findOne({ username }).exec();

    if (existing) {
      return existing;
    }

    const user = new this.userModel({
      username,
      totalPoints: 0,
      level: 1,
      badges: [],
      habits: {},
      geminiReports: [],
      completedDays: [],
      currentStreak: 0,
      lastCompletedDate: null,
    });

    return user.save();
  }

  async findByUsername(username: string) {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new NotFoundException(`User "${username}" not found`);
    }
    return user;
  }
}
