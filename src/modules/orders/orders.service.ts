import { UtilSlug } from "./../../utils/UtilSlug";
import { OrderDocument } from "./../../schemas/order.schema";
import { Injectable } from "@nestjs/common";
import { Order } from "src/schemas/order.schema";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Inventory, InventoryDocument } from "src/schemas/inventory.schema";
import { Product, ProductDocument } from "src/schemas/product.schema";

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Inventory.name)
    private readonly inventoryModel: Model<InventoryDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>
  ) {}
  // ------------------post order--------------------- //
  async create(createOrderDto: CreateOrderDto): Promise<Object> {
    const slug = `order_${createOrderDto.user_slug}`;
    createOrderDto["slug"] = UtilSlug.getUniqueId(slug);

    const updateProductStock = async (data) => {
      await this.productModel.findOneAndUpdate(
        { slug: data.slug },
        {
          $inc: {
            stock: -data.quantity,
          },
        }
      );
    };

    let stockProducts = [];

    for (let product of createOrderDto.product_list) {
      let p = {
        slug: UtilSlug.getUniqueId("stock"),
        //@ts-ignore
        product_slug: product.slug,
        //@ts-ignore
        quantity: product.quantity,
        type: "stockOut",
      };

      stockProducts.push(p);

      await updateProductStock(product);
    }

    // const stockProducts = createOrderDto.product_list.map(
    //   (data: { slug: string; quantity: number; type: "stockOut" }) => {
    //     let p = {
    //       slug: UtilSlug.getUniqueId('stock'),
    //       product_slug: data.slug,
    //       quantity: data.quantity,
    //       type: "stockOut",
    //     };

    //     console.log(p)

    //     this.productModel.findOneAndUpdate(
    //       { slug: data.slug },
    //       {
    //         $inc: {
    //           stock: -data.quantity,
    //         },
    //       }
    //     );
    //     return p;
    //   }
    // );

    await this.inventoryModel.create(stockProducts);

    const result = await new this.orderModel(createOrderDto).save();

    if (result) {
      return {
        data: result,
        message: "Order successful ",
      };
    } else {
      return {
        message: "Order  failed !",
      };
    }
  }

  // findAll(slug: string) {
  //   return this.orderModel.find({ user_slug: slug });
  // }

  async findAllCompleted(slug: string, order_status: string) {
    const result = await this.orderModel.find({
      user_slug: slug,
      order_status: new RegExp(order_status, "i"),
    });

    return {
      data: result,
      message: "fetched Successfully",
    };
  }

  // ----------------------------------------------
  // async findAll(delivery_status: string): Promise<Order[]> {
  //   return await this.orderModel.find({ delivery_status });
  // }

  // ------------------------------------------------------------------

  async findAllOrdersAdmin(query: any) {
    let match_value = new RegExp(query.search, "i");

    const allOrdersData = await this.orderModel.aggregate([
      {
        $match: {
          slug: {
            $regex: match_value,
          },
        },
      },
      {
        $sort: {
          [query.sortBy]: query.sortType === "asc" ? 1 : -1,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_slug",
          foreignField: "slug",
          as: "userData",
        },
      },
      {
        $unwind: "$userData",
      },
    ]);

    const filteredOrdersData = await this.orderModel.aggregate([
      {
        $match: {
          slug: {
            $regex: match_value,
          },
          order_status: query.order_status,
        },
      },
      {
        $sort: {
          [query.sortBy]: query.sortType === "asc" ? 1 : -1,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_slug",
          foreignField: "slug",
          as: "userData",
        },
      },
      {
        $unwind: "$userData",
      },
    ]);

    return { allOrdersData, filteredOrdersData };
  }

  async findOne(slug: string) {
    return await this.orderModel.findOne({ slug });
  }

  async update(slug: string, updateOrderDto: UpdateOrderDto) {
    const result = await this.orderModel.findOneAndUpdate(
      { slug },
      updateOrderDto,
      { new: true }
    );
    return result;
  }

  async remove(slug: string) {
    return await this.orderModel.deleteOne({ slug });
  }
}
