import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AdminUser } from '../admin-user/admin-user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AdminUser)
    private readonly adminUserRepository: Repository<AdminUser>,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<string> {
    const user = await this.adminUserRepository.findOneBy({ email });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('メールアドレスまたはパスワードが正しくありません');
    }

    return this.jwtService.sign({ sub: user.id });
  }
}
