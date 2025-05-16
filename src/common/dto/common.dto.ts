import { Transform, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Transform(( {value}) => {
    value === undefined || value === null || value === '' ? null : Number(value)
  })
  page: number | null = null; 

  @IsOptional()
  @Min(0)
 @Transform(( {value}) => {
    value === undefined || value === null || value === '' ? null : Number(value)
  })
  quantity: number | null = null;
}

export class LocationDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}