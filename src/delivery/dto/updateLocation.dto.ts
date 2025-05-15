import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LocationDto } from '../../common/dto/location.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class UpdateLocationDto {
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}

export class FindByProximityDto extends PaginationDto {
    @IsNumber()
    lat: number;
    
    @IsNumber()
    lng: number;

    @IsNumber()
    radius: number
}
export class UpdateDeliveryStatusDto {
  @IsString()
  status: string;
}
