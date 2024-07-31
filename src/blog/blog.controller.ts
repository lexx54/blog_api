import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ValidationError,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  HttpException,
  HttpStatus,
  Res,
  StreamableFile,
  Header,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { BlogService } from './blog.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BlogEntity } from './blog.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { createReadStream } from 'fs';

type TPartialBLog = Partial<BlogEntity>

@ApiTags('blog')
@Controller('blog')
export class BlogController {
  constructor(
    private readonly blogService: BlogService,
    private readonly authService: AuthService,
  ) { }

  @Get()
  @ApiOperation({ summary: 'OPERATIVO' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'showApproved', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Return all clients.' })
  async getAllClients(@Query() queryParams): Promise<BlogEntity[]> {
    const { page = 1, limit = 10, category = 'ALL', showApproved, } = queryParams;
    return await this.blogService.findAll(page, limit, showApproved, category);
  }

  @Get('/total')
  @ApiOperation({ summary: 'OPERATIVO' })
  @ApiParam({ name: 'type', required: false, type: 'string', description: 'It indicates if it should count every blog or only those that arent approved yet' })
  @ApiResponse({ status: 200, description: 'Return the total blogs saved' })
  async getTotal(@Param('type') type: string): Promise<number> {
    return await this.blogService.findNumber(type);
  }
  @Get(':id')
  @ApiOperation({ summary: 'OPERATIVO' })
  @ApiParam({ name: 'id', type: 'number', description: 'Newsletter ID' })
  @ApiResponse({ status: 200, description: 'Return a newsletter by ID.' })
  async getById(@Param('id') id: number): Promise<BlogEntity> {
    return await this.blogService.findById(id);
  }


  @Get('/picture/:id/:name')
  // @Header('Content-Type', 'application/json')
  async getPicture(@Param('id') id: string, @Param('name') name: string) {
    const file = createReadStream(join(process.cwd(), 'public', 'blog', id, name))
    return new StreamableFile(file)
  }


  @Post()
  @ApiOperation({ summary: 'OPERATIVO' })
  @ApiBody({
    type: BlogEntity,
    description: 'New newsletter object',
    examples: {
      example1: {
        value: { title: 'Sample Title', content: 'Sample Content', auth: 0 },
        summary: 'Sample Newsletter Object',
      },
      // Agrega más ejemplos según sea necesario
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The newsletter has been successfully created.',
  })
  async create(
    @Body() newsletter: BlogEntity,
  ): Promise<BlogEntity | ValidationError[]> {
    const authIdExists = await this.authService.validateAuthEntity(
      newsletter.auth as any,
    );
    if (!authIdExists) {
      throw new BadRequestException(
        'El ID de AuthEntity proporcionado no existe',
      );
    }
    return await this.blogService.create(newsletter);
  }

  @Post('guest')
  @ApiOperation({ summary: 'OPERATIVO' })
  @ApiBody({
    type: BlogEntity,
    description: 'New blog object',
    examples: {
      example1: {
        value: { title: 'Sample Title', content: 'Sample Content', auth: 0 },
        summary: 'Sample Newsletter Object',
      },
      // Agrega más ejemplos según sea necesario
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The blog has been successfully created.',
  })
  async createFromGuest(
    @Body() newsletter: BlogEntity,
  ): Promise<BlogEntity | ValidationError[]> {
    return await this.blogService.create(newsletter);
  }

  @Put(':id')
  @ApiOperation({ summary: 'OPERATIVO' })
  @ApiParam({ name: 'id', type: 'number', description: 'Blog ID' })
  @ApiBody({ type: BlogEntity, description: 'Updated Blog object' })
  @ApiResponse({
    status: 200,
    description: 'The Blog has been successfully updated.',
  })
  async update(
    @Param('id') id: number,
    @Body() updatedNewsletter: Partial<BlogEntity>,
  ): Promise<Partial<BlogEntity>> {
    return await this.blogService.update(id, updatedNewsletter);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'OPERATIVO' })
  @ApiParam({ name: 'id', type: 'number', description: 'Newsletter ID' })
  @ApiResponse({
    status: 200,
    description: 'The newsletter has been successfully deleted.',
  })
  async delete(@Param('id') id: number): Promise<BlogEntity> {
    return await this.blogService.delete(id);
  }

  // ARCHIVOS
  @Post('upload-image/:blogId')
  @ApiOperation({ summary: 'OPERATIVO' })
  @UseInterceptors(FileInterceptor('file'))
  // @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload image file',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Update a client PDF.' })
  async uploadPDF(
    @Param('blogId') blogId: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new FileTypeValidator({ fileType: 'image/jpeg' || 'image/png'  }), 
          // new FileTypeValidator({ fileType: 'image/png' })
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log('GETTING FILEEEEE ', file)
    try {
      const { filePath, fileName } = await this.blogService.handleFileUpload(
        file,
        blogId,
      );

      return { success: true, filePath, fileName };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
