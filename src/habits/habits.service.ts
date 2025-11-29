import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  User,
  UserDocument,
  SleepHabit,
  StudyHabit,
  PhysicalEntry,
  ReadEntry,
  CustomHabit,
} from '../users/schemas/user.schema';
import { UpdateSleepHabitDto } from './dto/update-sleep-habit.dto';
import { UpdateStudyHabitDto } from './dto/update-study-habit.dto';
import { CreatePhysicalEntryDto } from './dto/create-physical-entry.dto';
import { CreateReadEntryDto } from './dto/create-read-entry.dto';
import { CreateCustomEntryDto } from './dto/create-custom-entry.dto';

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

  async getSleepHabit(username: string) {
    const user = await this.userModel
      .findOne({ username }, { 'habits.sleep': 1, username: 1, _id: 0 })
      .exec();

    if (!user) throw new NotFoundException(`User "${username}" not found`);

    return {
      username: user.username,
      sleep: user.habits?.sleep || null,
    };
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

    user.habits.study = study;

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

  async addPhysicalEntry(dto: CreatePhysicalEntryDto) {
    const { username, activity, durationMinutes } = dto;

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

    if (!user.habits.physical) {
      user.habits.physical = [];
    }

    const entry: PhysicalEntry = {
      activity,
      durationMinutes,
    };

    user.habits.physical.push(entry);

    await user.save();
    return entry;
  }

  async getPhysicalEntries(username: string) {
    const user = await this.userModel
      .findOne({ username }, { 'habits.physical': 1, username: 1, _id: 0 })
      .exec();

    if (!user) {
      throw new NotFoundException(`User "${username}" not found`);
    }

    return {
      username: user.username,
      physical: user.habits?.physical || [],
    };
  }

  async addReadEntry(dto: CreateReadEntryDto) {
    const { username, bookTitle, minutes } = dto;

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

    if (!user.habits.read) {
      user.habits.read = [];
    }

    const entry: ReadEntry = {
      bookTitle,
      minutes,
    };

    user.habits.read.push(entry);

    await user.save();
    return entry;
  }

  async getReadEntries(username: string) {
    const user = await this.userModel
      .findOne({ username }, { 'habits.read': 1, username: 1, _id: 0 })
      .exec();

    if (!user) {
      throw new NotFoundException(`User "${username}" not found`);
    }

    return {
      username: user.username,
      read: user.habits?.read || [],
    };
  }

  async addCustomEntry(dto: CreateCustomEntryDto) {
    const { username, id, name, value, unit } = dto;

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

    if (!user.habits.custom) {
      user.habits.custom = [];
    }

    const entry: CustomHabit = {
      id,
      name,
      value,
      unit,
    };

    user.habits.custom.push(entry);

    await user.save();
    return entry;
  }

  async getCustomEntries(username: string) {
    const user = await this.userModel
      .findOne({ username }, { 'habits.custom': 1, username: 1, _id: 0 })
      .exec();

    if (!user) {
      throw new NotFoundException(`User "${username}" not found`);
    }

    return {
      username: user.username,
      custom: user.habits?.custom || [],
    };
  }
}
