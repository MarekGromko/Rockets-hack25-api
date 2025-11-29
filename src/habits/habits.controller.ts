import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { UpdateSleepHabitDto } from './dto/update-sleep-habit.dto';
import { UpdateStudyHabitDto } from './dto/update-study-habit.dto';
import { CreatePhysicalEntryDto } from './dto/create-physical-entry.dto';
import { CreateReadEntryDto } from './dto/create-read-entry.dto';
import { CreateCustomEntryDto } from './dto/create-custom-entry.dto';
import { CompleteDayDto } from './dto/complete-day.dto';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post('sleep')
  setSleep(@Body() dto: UpdateSleepHabitDto) {
    return this.habitsService.setSleepHabit(dto);
  }

  @Get('sleep')
  getSleep(@Query('username') username: string) {
    return this.habitsService.getSleepHabit(username);
  }

  @Post('study')
  setStudy(@Body() dto: UpdateStudyHabitDto) {
    return this.habitsService.setStudyHabit(dto);
  }

  @Get('study')
  getStudy(@Query('username') username: string) {
    return this.habitsService.getStudyHabit(username);
  }

  @Post('physical')
  addPhysical(@Body() dto: CreatePhysicalEntryDto) {
    return this.habitsService.addPhysicalEntry(dto);
  }

  @Get('physical')
  getPhysical(@Query('username') username: string) {
    return this.habitsService.getPhysicalEntries(username);
  }

  @Post('read')
  addRead(@Body() dto: CreateReadEntryDto) {
    return this.habitsService.addReadEntry(dto);
  }

  @Get('read')
  getRead(@Query('username') username: string) {
    return this.habitsService.getReadEntries(username);
  }

  @Post('custom')
  addCustom(@Body() dto: CreateCustomEntryDto) {
    return this.habitsService.addCustomEntry(dto);
  }

  @Get('custom')
  getCustom(@Query('username') username: string) {
    return this.habitsService.getCustomEntries(username);
  }

  @Get('all')
  getAll(@Query('username') username: string) {
    return this.habitsService.getAllHabits(username);
  }

  @Post('complete-day')
  completeDay(@Body() dto: CompleteDayDto) {
    return this.habitsService.completeDay(dto);
  }

  @Get('streak')
  getStreak(@Query('username') username: string) {
    return this.habitsService.getStreakInfo(username);
  }
}
