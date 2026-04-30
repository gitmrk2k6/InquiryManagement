import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { Repository } from 'typeorm';
import { Inquiry, InquiryStatus } from './inquiry.entity';

export class CreateInquiryDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  subject: string;

  @IsString()
  @MinLength(1)
  body: string;
}

@Injectable()
export class InquiryService {
  constructor(
    @InjectRepository(Inquiry)
    private readonly inquiryRepository: Repository<Inquiry>,
  ) {}

  create(dto: CreateInquiryDto): Promise<Inquiry> {
    const inquiry = this.inquiryRepository.create(dto);
    return this.inquiryRepository.save(inquiry);
  }

  findAll(): Promise<Inquiry[]> {
    return this.inquiryRepository.find({ order: { receivedAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Inquiry> {
    const inquiry = await this.inquiryRepository.findOneBy({ id });
    if (!inquiry) {
      throw new NotFoundException(`Inquiry #${id} not found`);
    }
    return inquiry;
  }

  async updateStatus(id: number, status: InquiryStatus): Promise<Inquiry> {
    const inquiry = await this.findOne(id);
    inquiry.status = status;
    return this.inquiryRepository.save(inquiry);
  }
}
