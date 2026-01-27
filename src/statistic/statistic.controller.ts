import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthJwt } from 'src/auth/decorators/auth.jwt.decorator';
import { StatisticsResponseDto } from './dto/statistic.dto';
import { StatisticService } from './statistic.service';
import { Admin } from 'src/auth/decorators/admin.decorator';

@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('statistics')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Admin()
  @AuthJwt()
  @Get('main/store/:store_id')
  @ApiParam({ name: 'store_id', type: String, description: 'Store ID' })
  @ApiOkResponse({ type: StatisticsResponseDto })
  async getMainStatistics(@Param('store_id') store_id: string) {
    return this.statisticService.getMainStatistics(+store_id);
  }

  @Admin()
  @AuthJwt()
  @Get('middle/store/:store_id')
  async getMiddleStatistics(@Param('store_id') store_id: string) {
    return this.statisticService.getMiddleStatistics(+store_id);
  }
}
