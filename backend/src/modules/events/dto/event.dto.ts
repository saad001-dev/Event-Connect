import { IsString, IsOptional, IsDateString, IsBoolean, IsNumber } from 'class-validator';

export class CreateEventDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  address?: any;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  banner?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsNumber()
  maxAttendees?: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class UpdateEventDto extends Partial<CreateEventDto> {}