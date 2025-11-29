/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, GeminiReport } from '../users/schemas/user.schema';
import { CreateGeminiReportDto } from './dto/create-gemini-reports.dto';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AnalysisService {
  private geminiModel: any;

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY est manquante dans le .env');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    this.geminiModel = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
    });
  }

  async generateGeminiReport(dto: CreateGeminiReportDto) {
    const { username, type } = dto;

    const user = await this.userModel.findOne({ username }).exec();

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

    const parts: string[] = [];

    if (habits.sleep) {
      parts.push(
        `Sommeil: se couche vers ${habits.sleep.bedTime} et se réveille vers ${habits.sleep.wakeTime}.`,
      );
    }

    if (habits.study) {
      parts.push(
        `Études: ${habits.study.pomodoroCount} pomodoros, pour environ ${habits.study.totalMinutes ?? '??'} minutes.`,
      );
    }

    if (habits.physical && habits.physical.length > 0) {
      const list = habits.physical
        .map((p) => `${p.activity} (${p.durationMinutes} min)`)
        .join(', ');
      parts.push(`Activité physique: ${list}.`);
    }

    if (habits.read && habits.read.length > 0) {
      const list = habits.read
        .map((r) => `${r.bookTitle} (${r.minutes} min)`)
        .join(', ');
      parts.push(`Lecture: ${list}.`);
    }

    if (habits.custom && habits.custom.length > 0) {
      const list = habits.custom
        .map((c) =>
          c.unit ? `${c.name}: ${c.value} ${c.unit}` : `${c.name}: ${c.value}`,
        )
        .join(', ');
      parts.push(`Habitudes personnalisées: ${list}.`);
    }

    const habitsText =
      parts.length > 0
        ? parts.join(' ')
        : "Aucune habitude renseignée pour l'instant.";

    const prompt = `
Tu es un coach pour étudiants. Analyse les habitudes suivantes et produis un court rapport ${type} en français, clair et motivant. Seulement le rapport, n'hallucine pas et sans markdown.

Habitudes de l'utilisateur:
${habitsText}

Structure de ta réponse:
- Résumé rapide de la routine
- Points positifs
- Axes d'amélioration
- Une suggestion concrète pour le prochain jour/semaine
`;

    const result = await this.geminiModel.generateContent(prompt);
    const text: string = result.response.text();

    const report: GeminiReport = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date(),
      type,
      summary: text.slice(0, 200) + '...',
      rawContent: text,
    };

    if (!user.geminiReports) {
      user.geminiReports = [];
    }

    user.geminiReports.push(report);
    await user.save();

    return report;
  }

  async getGeminiReports(username: string) {
    const user = await this.userModel
      .findOne({ username }, { geminiReports: 1, username: 1, _id: 0 })
      .exec();

    if (!user) {
      throw new NotFoundException(`User "${username}" not found`);
    }

    return {
      username: user.username,
      geminiReports: user.geminiReports || [],
    };
  }

  async getLastGeminiReport(username: string) {
    const user = await this.userModel
      .findOne({ username }, { geminiReports: 1, username: 1, _id: 0 })
      .exec();

    if (!user) throw new NotFoundException(`User "${username}" not found`);

    const last =
      user.geminiReports && user.geminiReports.length > 0
        ? user.geminiReports[user.geminiReports.length - 1]
        : null;

    return {
      username: user.username,
      lastReport: last,
    };
  }
}
