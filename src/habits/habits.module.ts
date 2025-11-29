import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HabitsService } from './habits.service';
import { HabitsController } from './habits.controller';
import { User, UserSchema } from '../users/schemas/user.shema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [HabitsController],
  providers: [HabitsService],
})
export class HabitsModule {}
