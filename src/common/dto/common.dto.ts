import { Transform, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Transform(( {value}) => {
    return value === undefined || value === null || value === '' ? null : Number(value)
  })
  page: number | null = null; 

  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === null || value === '' ? null : Number(value)
  )
  @IsNumber()
  @Min(1)
  quantity: number = 10;
}

export class LocationDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}