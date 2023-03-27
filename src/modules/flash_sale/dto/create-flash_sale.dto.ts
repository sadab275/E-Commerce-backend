import { IsOptional, IsString } from "class-validator";

export class CreateFlashSaleDto {
  @IsOptional()
  @IsString()
  product_slug?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  sale_slug?: string;

  @IsOptional()
  @IsString()
  sale_status?: string;

  @IsOptional()
  @IsString()
  imageHome?: string;

  @IsOptional()
  @IsString()
  imageFlash?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  offer?: string;

  // @IsString()
  // sale_status?: string;
}
