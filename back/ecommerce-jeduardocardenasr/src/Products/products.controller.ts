import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from 'src/Auth/auth-guard.guard';
import { validateProduct } from 'src/utils/products.validate';
import { Products } from 'src/entities/products.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getProductsController(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): { products: Products[]; totalPages: number; totalProducts: number } {
    const pageNumber = page ? Number(page) : 1;
    const limitNumber = limit ? Number(limit) : 5;

    return this.productsService.getProductsService(pageNumber, limitNumber);
  }

  @Get(':id')
  getProductByIdController(@Param('id') id: string): Products {
    return this.productsService.getProductByIdService(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  createProductController(@Body() newProduct: Products): Products | string {
    if (validateProduct(newProduct)) {
      return this.productsService.createProductService(newProduct);
    }
    return 'Producto no válido';
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  updateProductController(
    @Param('id') id: string,
    @Body() updatedProduct: Partial<Products>,
  ): Products | string {
    if (validateProduct(updatedProduct)) {
      return this.productsService.updateProductService(id, updatedProduct);
    }
    return 'Producto no válido';
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteProductController(@Param('id') id: string): Products {
    return this.productsService.deleteProductService(id);
  }
}
