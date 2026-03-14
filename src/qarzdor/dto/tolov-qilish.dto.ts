import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TolovQilishDto {
  @ApiProperty({
    example: 200000,
    description: 'To\'lov miqdori (so\'mda)',
  })
  @IsNumber()
  @Min(1, { message: 'To\'lov miqdori 0 dan katta bo\'lishi kerak' })
  miqdor!: number;

  @ApiPropertyOptional({
    example: 'Naqd pul berdi',
    description: 'Ixtiyoriy izoh',
  })
  @IsOptional()
  @IsString()
  izoh?: string;
}