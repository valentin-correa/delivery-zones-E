import { IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LocationDto } from '../../common/dto/location.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class UpdateLocationDto {
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}

export class FindByProximityDto extends LocationDto {
    @IsNumber()
    radius: number
}
