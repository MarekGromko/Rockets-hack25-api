// src/users/users.controller.ts
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() body: { username: string }) {
    return this.usersService.createUser(body.username);
  }

  @Get()
  find(@Query('username') username: string) {
    return this.usersService.findByUsername(username);
  }
}
