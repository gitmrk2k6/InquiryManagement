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

export interface FindAllOptions {
  status?: InquiryStatus;
  sort?: 'newest' | 'oldest' | 'elapsed';
  page?: number;
}

const PAGE_SIZE = 20;

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

  async findAll(options: FindAllOptions = {}): Promise<{ data: Inquiry[]; total: number; page: number; totalPages: number }> {
    const { status, sort = 'newest', page = 1 } = options;

    const qb = this.inquiryRepository.createQueryBuilder('inquiry');

    if (status) {
      qb.where('inquiry.status = :status', { status });
    }

    if (sort === 'newest') {
      qb.orderBy('inquiry.receivedAt', 'DESC');
    } else if (sort === 'oldest') {
      qb.orderBy('inquiry.receivedAt', 'ASC');
    } else {
      qb.orderBy('inquiry.receivedAt', 'ASC');
    }

    const total = await qb.getCount();
    const data = await qb
      .skip((page - 1) * PAGE_SIZE)
      .take(PAGE_SIZE)
      .getMany();

    return { data, total, page, totalPages: Math.ceil(total / PAGE_SIZE) };
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
