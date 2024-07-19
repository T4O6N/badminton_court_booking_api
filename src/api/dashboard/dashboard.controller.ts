import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Dashboard API')
@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get('court-used-report')
    async getCourtUsedReport() {
        return this.dashboardService.CourtUsedReport();
    }

    @Get('income-report')
    async getIncomeReport() {
        return await this.dashboardService.weeklyIncomeReport();
    }
}
