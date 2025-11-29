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
import { CompleteDayDto } from './dto/complete-day.dto';

@Injectable()
export class HabitsService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  private toDateString(d: Date): string {
    return d.toISOString().slice(0, 10);
  }

  private diffDays(a: string, b: string): number {
    const da = new Date(a + 'T00:00:00Z');
    const db = new Date(b + 'T00:00:00Z');
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.round((db.getTime() - da.getTime()) / msPerDay);
  }

  private ensureHabits(user: UserDocument) {
    if (!user.habits) {
      user.habits = {
        sleep: null,
        study: null,
        physical: [],
        read: [],
        custom: [],
      };
    }
    if (!user.habits.physical) user.habits.physical = [];
    if (!user.habits.read) user.habits.read = [];
    if (!user.habits.custom) user.habits.custom = [];
  }

  async setSleepHabit(dto: UpdateSleepHabitDto) {
    const { username, bedTime, wakeTime } = dto;

    const user = await this.userModel.findOne({ username }).exec();
    if (!user) throw new NotFoundException(`User "${username}" not found`);

    this.ensureHabits(user);

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

    this.ensureHabits(user);

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

    this.ensureHabits(user);

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

    this.ensureHabits(user);

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

    this.ensureHabits(user);

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

  async getAllHabits(username: string) {
    const user = await this.userModel
      .findOne({ username }, { habits: 1, username: 1, _id: 0 })
      .exec();

    if (!user) {
      throw new NotFoundException(`User "${username}" not found`);
    }

    const habits = user.habits || {
      sleep: null,
      study: null,
      physical: [],
      read: [],
      custom: [],
    };

    return {
      username: user.username,
      habits,
    };
  }

  async completeDay(dto: CompleteDayDto) {
    const { username } = dto;
    let { date } = dto;

    const user = await this.userModel.findOne({ username }).exec();
    if (!user) throw new NotFoundException(`User "${username}" not found`);

    if (!date) {
      date = this.toDateString(new Date());
    }

    if (user.lastCompletedDate === date) {
      return {
        username: user.username,
        currentStreak: user.currentStreak,
        level: user.level,
        lastCompletedDate: user.lastCompletedDate,
        totalPoints: user.totalPoints,
      };
    }

    let newStreak = 1;

    if (user.lastCompletedDate) {
      const diff = this.diffDays(user.lastCompletedDate, date);

      if (diff === 1) {
        newStreak = user.currentStreak + 1;
      } else {
        newStreak = 1;
      }
    }

    user.currentStreak = newStreak;
    user.lastCompletedDate = date;

    if (!user.completedDays) {
      user.completedDays = [];
    }
    user.completedDays.push({ date });

    if (newStreak > 0 && newStreak % 2 === 0) {
      user.level += 1;
    }

    user.totalPoints = (user.totalPoints || 0) + 10;

    await user.save();

    return {
      username: user.username,
      currentStreak: user.currentStreak,
      level: user.level,
      lastCompletedDate: user.lastCompletedDate,
      totalPoints: user.totalPoints,
    };
  }

  async getStreakInfo(username: string) {
    const user = await this.userModel
      .findOne(
        { username },
        {
          username: 1,
          currentStreak: 1,
          level: 1,
          lastCompletedDate: 1,
          totalPoints: 1,
          _id: 0,
        },
      )
      .exec();

    if (!user) {
      throw new NotFoundException(`User "${username}" not found`);
    }

    return {
      username: user.username,
      currentStreak: user.currentStreak || 0,
      level: user.level || 1,
      lastCompletedDate: user.lastCompletedDate || null,
      totalPoints: user.totalPoints || 0,
    };
  }
}
