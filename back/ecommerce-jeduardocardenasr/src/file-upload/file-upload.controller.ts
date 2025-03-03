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
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

const maxSizeInBytes = 200000;
@ApiTags('Files')
@Controller('files')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('/uploadImage/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Upload an image for a product (Authenticated users only)',
  })
  @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid file format or size exceeded',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImageController(
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
  ) {
    return await this.fileUploadService.uploadImageService(file, productId);
  }
}
