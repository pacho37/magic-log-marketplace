import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) { }

  async createProduct(createProductDto: CreateProductDto, userId: number) {
    return await this.prisma.product.create({
      data: {
        name: createProductDto.name,
        sku: createProductDto.sku,
        quantity: parseInt(createProductDto.quantity as any, 10),
        price: parseFloat(createProductDto.price as any),
        sellerId: userId,
      },
    });
  }

  async getProductsByUser(userId: number) {
    return await this.prisma.product.findMany({
      where: { sellerId: userId },
    });
  }

  async getAllProducts(userId: number) {
    return await this.prisma.product.findMany({
      where: { sellerId: userId },
    });
  }

  async searchProducts(filters: { name?: string; sku?: string; minPrice?: number; maxPrice?: number }) {
    const conditions: any = {};

    if (filters.name) {
      conditions.name = { contains: filters.name.trim()  };
    }
    if (filters.sku) {
      conditions.sku = { contains: filters.sku.trim() };
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      conditions.price = {};
      if (filters.minPrice !== undefined) {
        conditions.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        conditions.price.lte = filters.maxPrice;
      }
    }

    return await this.prisma.product.findMany({
      where: conditions,
      include: { seller: true },
    });
  }


  async updateProduct(id: number, createProductDto: CreateProductDto, userId: number) {
    return await this.prisma.product.update({
      where: {
        id: id,
      },
      data: {
        ...createProductDto,
        sellerId: userId,
      },
    });
  }

  async deleteProduct(id: number, userId: number) {
    // Verificamos si el producto existe y si pertenece al usuario
    const product = await this.prisma.product.findUnique({
      where: { id: id },
    });

    if (!product || product.sellerId !== userId) {
      throw new Error('Producto no encontrado o no pertenece al usuario');
    }

    return await this.prisma.product.delete({
      where: { id: id },
    });
  }

}
