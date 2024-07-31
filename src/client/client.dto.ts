import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export type PaymentStatus = 'PENDING' | 'PAID' | 'NONE';
export type TramiteType = 'TYPE1' | 'TYPE2' | 'TYPE3' | 'TYPE4';

export class PdfDto {
  @IsString()
  @ApiProperty()
  // @IsNotEmpty({ message: 'El typePdf es obligatorio' })
  typePdf: string;

  @IsString()
  // @IsNotEmpty({ message: 'El path es obligatorio' })
  @ApiProperty()
  path: string;
}

export class DuesDto {
  @IsString()
  @ApiProperty()
  dues: string;
}

export class CollaboratorsDto {
  @IsString()
  @ApiProperty()
  collaborators: string;
}
