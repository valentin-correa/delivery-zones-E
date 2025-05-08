// src/zone/dto/create-zone.dto.ts
import { LocationDto } from '../../common/dto/location.dto';
import { IsString, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateZoneDto {
  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsNumber()
  radius: number;
}