import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsOptional()
  isWorkInProgress: boolean;

  @IsString({ each: true })
  stack: string[];

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  imageUrl: string;
}
