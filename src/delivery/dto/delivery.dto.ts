import { IsNumber, IsString, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { LocationDto } from '../../common/dto/common.dto';
import { PaginationDto } from 'src/common/dto/common.dto';

export class UpdateLocationDto {
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}

export class FindByProximityDto extends PaginationDto {
    @IsNumber()
    @Type(() => Number)
    lat: number;
    
    @IsNumber()
    @Type(() => Number)
    lng: number;

    @IsNumber()
    @Type(() => Number)
    radius: number
}
export class UpdateDeliveryStatusDto {
  @IsString()
  status: string;
}

export class AssignZoneDto {
    @IsArray()
    @Type(() => Number)
    @IsNumber({}, { each: true })
    zoneIds: number[];
}

export class CreateDeliveryDto {
  @IsNumber()
  personId: number;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsNumber()
  radius: number;
}

export class FindByZoneDTO extends PaginationDto{
    @IsNumber()
    @Type(() => Number)
    zoneId: number;
}