import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  User,
  UserDocument,
  SleepHabit,
  StudyHabit,
} from '../users/schemas/user.schema';
import { UpdateSleepHabitDto } from './dto/update-sleep-habit.dto';
import { UpdateStudyHabitDto } from './dto/update-study-habit.dto';

@Injectable()
export class HabitsService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async setSleepHabit(dto: UpdateSleepHabitDto) {
    const { username, bedTime, wakeTime } = dto;

    const user = await this.userModel.findOne({ username }).exec();
    if (!user) throw new NotFoundException(`User "${username}" not found`);

    if (!user.habits) {
      user.habits = {
        sleep: null,
        study: null,
        physical: [],
        read: [],
        custom: [],
      };
    }

    const habit: SleepHabit = { bedTime, wakeTime };
    user.habits.sleep = habit;

    await user.save();
    return habit;
  }

  getSleepHabit(username: string) {
    return this.userModel
      .findOne({ username }, { 'habits.sleep': 1, username: 1, _id: 0 })
      .exec();
  }

  async setStudyHabit(dto: UpdateStudyHabitDto) {
    const { username, pomodoroCount, totalMinutes } = dto;

    const user = await this.userModel.findOne({ username }).exec();
    if (!user) throw new NotFoundException(`User "${username}" not found`);

    if (!user.habits) {
      user.habits = {
        sleep: null,
        study: null,
        physical: [],
        read: [],
        custom: [],
      };
    }

    const study: StudyHabit = {
      pomodoroCount,
      totalMinutes,
    };

    user.habits.study = [study];

    await user.save();
    return study;
  }

  async getStudyHabit(username: string) {
    const user = await this.userModel
      .findOne({ username }, { 'habits.study': 1, username: 1, _id: 0 })
      .exec();

    if (!user) {
      throw new NotFoundException(`User "${username}" not found`);
    }

    return {
      username: user.username,
      study: user.habits?.study || null,
    };
  }
}
