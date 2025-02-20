// src/admin/admin.controller.ts
import { Controller, Get, Query, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProductService } from 'src/products/product.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Get('products')
  async getAllProducts(@Req() req, @Query('sellerId') sellerId?: string) {
    const user = req.user;
    if (user.role !== 'admin') {
      throw new ForbiddenException('Acceso denegado: se requiere rol de administrador.');
    }
    const sellerIdNumber = sellerId ? parseInt(sellerId, 10) : undefined;
    return await this.productService.getAllProducts(sellerIdNumber);
  }
}
