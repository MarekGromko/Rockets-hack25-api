import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { CreateGeminiReportDto } from './dto/create-gemini-reports.dto';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post('gemini')
  generateReport(@Body() dto: CreateGeminiReportDto) {
    return this.analysisService.generateGeminiReport(dto);
  }

  @Get('gemini')
  getReports(@Query('username') username: string) {
    return this.analysisService.getGeminiReports(username);
  }

  @Get('gemini/latest')
  getLast(@Query('username') username: string) {
    return this.analysisService.getLastGeminiReport(username);
  }
}
