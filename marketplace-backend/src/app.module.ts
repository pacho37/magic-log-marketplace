import { Module } from '@nestjs/common';
import { ProductModule } from './products/product.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { AdminController } from './admin/admin.controller';

@Module({
  imports: [AuthModule , ProductModule],
  controllers: [AppController, AdminController],
  providers: [AppService , PrismaService],
})
export class AppModule {}
