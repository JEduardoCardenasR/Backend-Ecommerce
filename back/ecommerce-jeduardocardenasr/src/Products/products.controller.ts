import {
  BadRequestException,
  Body,
  Controller,
  // Delete,
  Get,
  Param,
  ParseUUIDPipe,
  // Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from 'src/Auth/guards/auth.guard';
import { validateProduct } from 'src/utils/products.validate';
import { Products } from 'src/entities/products.entity';
import { Rol } from 'src/enums/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/Auth/guards/roles.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProductsController(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<{
    products: Products[];
    totalPages: number;
    totalProducts: number;
  }> {
    const pageNumber = page ? Number(page) : 1;
    const limitNumber = limit ? Number(limit) : 5;

    return await this.productsService.getProductsService(
      pageNumber,
      limitNumber,
    );
  }

  @Get('seeder')
  addProductsController() {
    return this.productsService.addProductsService();
  }

  @Get(':id')
  async getProductByIdController(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Products> {
    return await this.productsService.getProductByIdService(id);
  }

  @Put(':id')
  @Roles(Rol.Administrator)
  @UseGuards(AuthGuard, RolesGuard)
  async updateProductController(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatedProduct: Partial<Products>,
  ): Promise<Products> {
    if (!validateProduct(updatedProduct)) {
      throw new BadRequestException('Producto no válido');
    }
    return await this.productsService.updateProductService(id, updatedProduct);
  }

  // @Post()
  // @UseGuards(AuthGuard)
  // createProductController(@Body() newProduct: Products): Products | string {
  //   if (validateProduct(newProduct)) {
  //     return this.productsService.createProductService(newProduct);
  //   }
  //   return 'Producto no válido';
  // }

  // @Delete(':id')
  // @UseGuards(AuthGuard)
  // deleteProductController(@Param('id', ParseUUIDPipe) id: string): Products {
  //   return this.productsService.deleteProductService(id);
  // }
}
