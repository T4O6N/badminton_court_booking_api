import { Controller, Get, Param, Delete } from '@nestjs/common';
import { CourtSessionService } from './court-session.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Court-Session API')
@Controller('court-session')
export class CourtSessionController {
    constructor(private readonly courtSessionService: CourtSessionService) {}

    @Get('FindMany')
    @ApiOperation({
        summary: 'Find all courts sessions',
    })
    async getCourtSessions() {
        return this.courtSessionService.getCourtSessions();
    }

    @Get('byId/:courtSessionId')
    @ApiOperation({
        summary: 'Find one court session by id',
    })
    async getOneCourtSession(@Param('id') courtSessionId: string) {
        return this.courtSessionService.getOneCourtSession(courtSessionId);
    }

    @Delete('delete/:courtSessionId')
    @ApiOperation({
        summary: 'Delete one court session by id',
    })
    async deleteCourtSession(@Param('id') courtSessionId: string) {
        return this.courtSessionService.deleteCourtSession(courtSessionId);
    }
}
