import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { ROLE } from "src/users/constants";
import { Roles } from "src/users/roles.decorator";
import { RoleGuard } from "src/users/roles.guard";

import { LoggedInGuard } from "../auth/logged-in.guard";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductsService } from "./products.service";

type RequestWithUser = Request & { user: User };

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(LoggedInGuard, RoleGuard)
  @Roles(ROLE.SELLER)
  create(
    @Body() createProductDto: CreateProductDto,
    @Req() request: RequestWithUser
  ) {
    return this.productsService.create(createProductDto, request.user);
  }

  @Put(":id")
  @UseGuards(LoggedInGuard, RoleGuard)
  @Roles(ROLE.SELLER)
  update(
    @Body() updateProductDto: UpdateProductDto,
    @Req() request: RequestWithUser
  ) {
    return this.productsService.update(updateProductDto, request.user);
  }

  @Get()
  @UseGuards(LoggedInGuard)
  findAll() {
    return this.productsService.findAll();
  }

  @Get(":id")
  @UseGuards(LoggedInGuard)
  findOne(@Param("id") id: string) {
    return this.productsService.findOne(id);
  }

  @Delete(":id")
  @UseGuards(LoggedInGuard)
  remove(@Param("id") id: string, @Req() request: RequestWithUser) {
    return this.productsService.remove(id, request.user);
  }
}
