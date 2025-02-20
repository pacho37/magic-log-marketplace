import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { ProductModule } from 'src/products/product.module';

@Module({
  imports: [ProductModule],
  controllers: [AdminController],
})
export class AdminModule {}
