import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AdminUser } from '../admin-user/admin-user.entity';
import { Inquiry } from '../inquiry/inquiry.entity';

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '3306', 10),
  username: process.env.DB_USERNAME ?? 'app',
  password: process.env.DB_PASSWORD ?? 'password',
  database: process.env.DB_DATABASE ?? 'inquiry_management',
  entities: [AdminUser, Inquiry],
  synchronize: false,
});

async function seed() {
  const email = process.env.ADMIN_EMAIL ?? 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD ?? 'password123';

  if (password.length < 8) {
    throw new Error('ADMIN_PASSWORD must be at least 8 characters');
  }

  await dataSource.initialize();

  const adminRepo = dataSource.getRepository(AdminUser);

  const exists = await adminRepo.findOneBy({ email });
  if (!exists) {
    const passwordHash = await bcrypt.hash(password, 10);
    await adminRepo.save({ email, passwordHash });
    console.log(`Seeded: ${email}`);
  } else {
    console.log(`Skipped: ${email} already exists`);
  }

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
