import {
  IsDateString,
  IsInt,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export class CreateProductDto {
  @IsInt()
  @Min(0)
  @Max(10000000)
  public amountAvailable: number;

  @IsInt()
  @Min(0)
  @Max(10000000)
  public cost: number;

  @IsString()
  @MinLength(2)
  @MaxLength(300)
  public productName: string;

  @IsString()
  public productImage: string;

  @IsDateString()
  public expireDate: Date;
}
