import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthJwt } from 'src/auth/decorators/auth.jwt.decorator';
import { statisticsResponse } from './response/statistics.response';
import { StatisticService } from './statistic.service';

@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@AuthJwt()
@Controller('statistics')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Get('main/store/:store_id')
  @ApiParam({ name: 'store_id', type: String, description: 'Store ID' })
  @ApiOkResponse(statisticsResponse)
  async getMainStatistics(@Param('store_id') store_id: string) {
    return this.statisticService.getMainStatistics(+store_id);
  }
}
