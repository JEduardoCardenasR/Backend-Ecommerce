import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { AuthGuard } from '../Auth/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductResponseDto } from '../dtos/productsDtos/product-response.dto';

const maxSizeInBytes = 200000;

@ApiTags('Files')
@ApiResponse({
  status: 500,
  description: 'Internal server error. Please try again later.',
})
@Controller('files')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  // UPLOAD IMAGE
  @Post('/uploadImage/:id')
  @ApiOperation({
    summary: 'Upload an image for a product (Authenticated users only)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User ID (UUID format)',
    example: '087513fe-0e35-4ab3-a5da-e367ec122074',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary', // Esto indica que se trata de un archivo
        },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid file format or size exceeded',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  uploadImageController(
    @Param('id') productId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 200000, //bytes
            message: `File size exceeds the limit of ${Math.floor(maxSizeInBytes / 1000)}KB. Please upload a smaller file.`,
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|gif|png|webp|svg)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<ProductResponseDto> {
    return this.fileUploadService.uploadImageService(file, productId);
  }
}
