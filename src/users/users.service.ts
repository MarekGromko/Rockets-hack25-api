import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.shema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(username: string) {
    const user = new this.userModel({ username });
    return user.save();
  }

  async findByUsername(username: string) {
    return this.userModel.findOne({ username }).exec();
  }
}
