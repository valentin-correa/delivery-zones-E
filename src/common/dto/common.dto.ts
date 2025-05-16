import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  page: number = 1; // Defino página por defecto 1.

  @IsOptional()
  @Min(0)
  @Type(() =>  Number)
  quantity: number = 10; // Defino valor por defecto 10.
}

export class LocationDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}