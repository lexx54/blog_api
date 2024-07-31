import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactEntity } from './contact.entity';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  @ApiOperation({ summary: 'Get all contact' })
  @ApiResponse({ status: 200, description: 'Return all contact.' })
  async getAll(): Promise<ContactEntity[]> {
    return await this.contactService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contact by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'contact ID' })
  @ApiResponse({ status: 200, description: 'Return a contact by ID.' })
  async getById(@Param('id') id: number): Promise<ContactEntity> {
    return await this.contactService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new contact' })
  @ApiBody({
    type: ContactEntity,
    description: 'New contact object',
    examples: {
      example1: {
        value: {
          name: 'Sample Title',
          email: 'Sample Content',
          subject: 'a',
          message: 'message',
        },
        summary: 'Sample contact Object',
      },
      // Agrega más ejemplos según sea necesario
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The contact has been successfully created.',
  })
  async create(
    @Body(new ValidationPipe()) newsletter: ContactEntity,
  ): Promise<ContactEntity | ValidationError[]> {
    return await this.contactService.create(newsletter);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a contact by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'contact ID' })
  @ApiBody({ type: ContactEntity, description: 'Updated contact object' })
  @ApiResponse({
    status: 200,
    description: 'The contact has been successfully updated.',
  })
  async update(
    @Param('id') id: number,
    @Body(new ValidationPipe()) updatedNewsletter: ContactEntity,
  ): Promise<ContactEntity> {
    return await this.contactService.update(id, updatedNewsletter);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a contact by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'contact ID' })
  @ApiResponse({
    status: 200,
    description: 'The contact has been successfully deleted.',
  })
  async delete(@Param('id') id: number): Promise<ContactEntity> {
    return await this.contactService.delete(id);
  }
}
