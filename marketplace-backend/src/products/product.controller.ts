import { Controller, Post, Get, Query,Put, Delete, Body, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createProductDto: CreateProductDto, @Request() req: ExpressRequest) {
    // Accede al usuario autenticado a través de req.user
    const userId = req.user.userId;  // El id del usuario ahora está en req.user.userId después de la validación del JWT
    return this.productService.createProduct(createProductDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllProducts(@Request() req) {
    const userId = req.user.userId;
    return this.productService.getAllProducts(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('search')
  async searchProducts(@Request() req, @Query() query) {
    const user = req.user;
    // Verifica que el usuario tenga rol "buyer"
    if (user.role !== 'buyer') {
      throw new ForbiddenException('Acceso denegado: solo compradores pueden buscar productos');
    }
    const { name, sku, minPrice, maxPrice } = query;
    return await this.productService.searchProducts({
      name,
      sku,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateProduct(@Param('id') id: number, @Body() createProductDto: CreateProductDto, @Request() req) {
    const userId = req.user.userId;
    return this.productService.updateProduct(id, createProductDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteProduct(@Param('id') id: number, @Request() req) {
    const userId = req.user.userId;
    return await this.productService.deleteProduct(id, userId)
  }

}
