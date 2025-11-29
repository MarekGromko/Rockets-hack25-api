import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, SleepHabit } from '../users/schemas/user.shema';
import { UpdateSleepHabitDto } from './dto/update-sleep-habit.dto';

@Injectable()
export class HabitsService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async setSleepHabit(dto: UpdateSleepHabitDto) {
    const { username, bedTime, wakeTime } = dto;

    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new NotFoundException(`User with username "${username}" not found`);
    }

    if (!user.habits) {
      user.habits = {
        sleep: null,
        study: [],
        physical: [],
        read: [],
        custom: [],
      };
    }

    const habit: SleepHabit = {
      bedTime,
      wakeTime,
    };

    user.habits.sleep = habit;

    await user.save();
    return habit;
  }

  async getSleepHabit(username: string) {
    const user = await this.userModel
      .findOne({ username }, { 'habits.sleep': 1, username: 1, _id: 0 })
      .exec();

    if (!user) {
      throw new NotFoundException(`User with username "${username}" not found`);
    }

    return {
      username: user.username,
      sleep: user.habits?.sleep || null,
    };
  }
}
