import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { UpdateSleepHabitDto } from './dto/update-sleep-habit.dto';

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
}
