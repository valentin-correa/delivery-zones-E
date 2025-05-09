// src/zone/dto/zone.dto.ts
import { LocationDto } from '../../common/dto/location.dto';
import { IsString, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ZoneDto {
  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsNumber()
  radius: number;
}