import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  Redirect,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { SearchSortDto } from "src/utils/all-queries.dto";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  // --------------------
  @Post()
  create(
    @Body()
    createOrderDto: CreateOrderDto
  ) {
    return this.ordersService.create(createOrderDto);
  }

  @Post("/payment/success/:transaction_id")
  @Redirect("http://localhost:3000/payment_success")
  paymentSuccess(@Param("transaction_id") transaction_id: string) {
    console.log(transaction_id);
    return this.ordersService.SSLCommerz_payment_success(transaction_id);
  }

  @Post("/payment/fail/:transaction_id")
  @Redirect("http://localhost:3000/checkout")
  paymentFail(
    @Res() res: Response,
    @Param("transaction_id") transaction_id: string
  ) {
    return this.ordersService.SSLCommerz_payment_fail(transaction_id);
  }

  @Post("/payment/cancel/:transaction_id")
  @Redirect("http://localhost:3000/checkout")
  paymentCancel(@Param("transaction_id") transaction_id: string) {
    return this.ordersService.SSLCommerz_payment_cancel(transaction_id);
  }

  // -----------------------------------------------------
  @Get()
  findAllCompleted(
    @Query() query: { user_slug: string; order_status: string }
  ) {
    // console.log(query);
    return this.ordersService.findAllCompleted(
      query.user_slug,
      query.order_status
    );
  }

  @Get("/admin")
  async findAllAdminProduct(
    @Query() query: SearchSortDto
    // @Request() req: Request
  ) {
    return await this.ordersService.findAllOrdersAdmin(query);
  }

  @Get(":slug")
  findOne(@Param("slug") slug: string) {
    return this.ordersService.findOne(slug);
  }
  //--------------- get pending orders for admin -------------------
  // @Get("/pendingForAdmin")
  // findAll(@Query() query: { delivery_status: string }) {
  //   return this.ordersService.findAll(query.delivery_status);
  // }
  // @Get()
  // findAll(@Query() query: { user_slug: string }) {
  //   return this.wishlistService.findAll(query.user_slug);
  // }
  //----------------------------------------------------------------
  // @Patch(":id")
  // update(@Param("id") id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.ordersService.update(+id, updateOrderDto);
  // }

  @Patch(":slug")
  update(@Param("slug") slug: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(slug, updateOrderDto);
  }

  @Delete(":slug")
  remove(@Param("slug") slug: string) {
    return this.ordersService.remove(slug);
  }
}
