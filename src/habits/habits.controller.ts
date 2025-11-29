import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { UpdateSleepHabitDto } from './dto/update-sleep-habit.dto';
import { UpdateStudyHabitDto } from './dto/update-study-habit.dto';

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
}
