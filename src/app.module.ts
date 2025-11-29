import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { HabitsModule } from './habits/habits.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/rockets-hack25',
    ),
    UsersModule,
    HabitsModule,
  ],
})
export class AppModule {}
