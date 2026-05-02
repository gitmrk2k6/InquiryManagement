import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { IsEnum, IsOptional } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InquiryStatus } from './inquiry.entity';
import { CreateInquiryDto, InquiryService } from './inquiry.service';

class UpdateStatusDto {
  @IsEnum(InquiryStatus)
  status: InquiryStatus;
}

class FindAllQueryDto {
  @IsOptional()
  @IsEnum(InquiryStatus)
  status?: InquiryStatus;

  @IsOptional()
  @IsEnum(['newest', 'oldest', 'elapsed'])
  sort?: 'newest' | 'oldest' | 'elapsed';

  @IsOptional()
  page?: number;
}

@Controller('inquiries')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ 'inquiry-create': { limit: 5, ttl: 60_000 } })
  @UseGuards(ThrottlerGuard)
  create(@Body() dto: CreateInquiryDto) {
    return this.inquiryService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: FindAllQueryDto) {
    return this.inquiryService.findAll({
      status: query.status,
      sort: query.sort,
      page: query.page ? Number(query.page) : 1,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inquiryService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.inquiryService.updateStatus(id, dto.status);
  }
}
