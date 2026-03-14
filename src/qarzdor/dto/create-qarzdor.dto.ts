import { IsString, IsNumber, IsOptional, Min, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateQarzdorDto {
  @ApiProperty({
    example: 'Olimov Botir 1990',
    description: 'Qarzdorning ismi, familyasi va tug\'ilgan yili',
  })
  @IsString()
  @IsNotEmpty({ message: 'Kim maydoni bo\'sh bo\'lishi mumkin emas' })
  kim!: string;

  @ApiProperty({
    example: 500000,
    description: 'Qarz miqdori (so\'mda)',
  })
  @IsNumber()
  @Min(1, { message: 'Qarz miqdori 0 dan katta bo\'lishi kerak' })
  umumiyQarz!: number;

  @ApiPropertyOptional({
    example: 'Do\'kondan qarz oldi',
    description: 'Ixtiyoriy izoh',
  })
  @IsOptional()
  @IsString()
  izoh?: string;
}