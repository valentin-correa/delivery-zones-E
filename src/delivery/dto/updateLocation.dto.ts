import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LocationDto } from '../../common/dto/location.dto';

export class UpdateLocationDto {
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}