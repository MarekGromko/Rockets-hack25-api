import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class SleepHabit {
  @Prop({ required: true })
  bedTime: string;

  @Prop({ required: true })
  wakeTime: string;
}
export const SleepHabitSchema = SchemaFactory.createForClass(SleepHabit);

@Schema({ _id: false })
export class StudyHabit {
  @Prop({ required: true })
  pomodoroCount: number;

  @Prop()
  totalMinutes?: number;
}
export const StudyHabitSchema = SchemaFactory.createForClass(StudyHabit);

@Schema({ _id: false })
export class PhysicalEntry {
  @Prop({ required: true })
  activity: string;

  @Prop({ required: true })
  durationMinutes: number;
}
export const PhysicalEntrySchema = SchemaFactory.createForClass(PhysicalEntry);

@Schema({ _id: false })
export class ReadEntry {
  @Prop({ required: true })
  bookTitle: string;

  @Prop({ required: true })
  minutes: number;
}
export const ReadEntrySchema = SchemaFactory.createForClass(ReadEntry);

@Schema({ _id: false })
export class CustomHabit {
  @Prop({ required: true })
  id: string; // généré côté front (slug, uuid, etc.)

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  value: number;

  @Prop()
  unit?: string;
}
export const CustomHabitSchema = SchemaFactory.createForClass(CustomHabit);

@Schema({ _id: false })
export class GeminiReport {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  type: 'daily' | 'weekly' | 'monthly';

  @Prop()
  summary?: string;

  @Prop()
  rawContent?: string;
}
export const GeminiReportSchema = SchemaFactory.createForClass(GeminiReport);

@Schema({ _id: false })
export class Habits {
  @Prop({ type: SleepHabitSchema, default: null })
  sleep: SleepHabit | null;

  @Prop({ type: StudyHabitSchema, default: null })
  study: StudyHabit | null;

  @Prop({ type: [PhysicalEntrySchema], default: [] })
  physical: PhysicalEntry[];

  @Prop({ type: [ReadEntrySchema], default: [] })
  read: ReadEntry[];

  @Prop({ type: [CustomHabitSchema], default: [] })
  custom: CustomHabit[];
}
export const HabitsSchema = SchemaFactory.createForClass(Habits);

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ default: 0 })
  totalPoints: number;

  @Prop({ default: 1 })
  level: number;

  @Prop({ type: [String], default: [] })
  badges: string[];

  @Prop({ type: HabitsSchema, default: {} })
  habits: Habits;

  @Prop({ type: [GeminiReportSchema], default: [] })
  geminiReports: GeminiReport[];
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ username: 1 }, { unique: true });
