import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inquiry, InquiryStatus } from './inquiry.entity';

@Injectable()
export class InquiryService {
  constructor(
    @InjectRepository(Inquiry)
    private readonly inquiryRepository: Repository<Inquiry>,
  ) {}

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
