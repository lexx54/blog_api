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
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JournalService } from './journal.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JournalEntity } from './journal.entity';

@ApiTags('journal')
@Controller('journal')
export class JournalController {
  constructor(
    private readonly journalService: JournalService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'OPERATIVO' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Return all clients.' })
  async getAllClients(@Query() queryParams): Promise<JournalEntity[]> {
    const { page = 1, limit = 10 } = queryParams;
    return await this.journalService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'OPERATIVO' })
  @ApiParam({ name: 'id', type: 'number', description: 'Newsletter ID' })
  @ApiResponse({ status: 200, description: 'Return a newsletter by ID.' })
  async getById(@Param('id') id: number): Promise<JournalEntity> {
    return await this.journalService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'OPERATIVO' })
  @ApiBody({
    type: JournalEntity,
    description: 'New newsletter object',
    examples: {
      example1: {
        value: { title: 'Sample Title', description: 'Sample Content', auth: 0 },
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
    @Body() newsletter: JournalEntity,
  ): Promise<JournalEntity | ValidationError[]> {
    const authIdExists = await this.authService.validateAuthEntity(
      newsletter.auth as any,
    );
    if (!authIdExists) {
      throw new BadRequestException(
        'El ID de AuthEntity proporcionado no existe',
      );
    }
    return await this.journalService.create(newsletter);
  }

  @Put(':id')
  @ApiOperation({ summary: 'OPERATIVO' })
  @ApiParam({ name: 'id', type: 'number', description: 'Newsletter ID' })
  @ApiBody({ type: JournalEntity, description: 'Updated newsletter object' })
  @ApiResponse({
    status: 200,
    description: 'The newsletter has been successfully updated.',
  })
  async update(
    @Param('id') id: number,
    @Body() updatedNewsletter: JournalEntity,
  ): Promise<JournalEntity> {
    return await this.journalService.update(id, updatedNewsletter);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'OPERATIVO' })
  @ApiParam({ name: 'id', type: 'number', description: 'Newsletter ID' })
  @ApiResponse({
    status: 200,
    description: 'The newsletter has been successfully deleted.',
  })
  async delete(@Param('id') id: number): Promise<JournalEntity> {
    return await this.journalService.delete(id);
  }

}
