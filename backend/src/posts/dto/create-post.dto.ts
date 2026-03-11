import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreatePostDto {
  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  videoDurationSeconds?: number;
}
