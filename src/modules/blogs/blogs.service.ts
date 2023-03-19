import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Blog, BlogDocument } from "src/schemas/blog.schema";
import { UtilSlug } from "src/utils/UtilSlug";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogModel: Model<BlogDocument>
  ) {}

  async create(createBlogDto: CreateBlogDto): Promise<Object> {
    createBlogDto["slug"] = UtilSlug.getUniqueId(createBlogDto.title);
    const result = await new this.blogModel(createBlogDto).save();
    return result;
  }

  // findAll() {
  //   return `This action returns all blogs`;
  // }

  async findAll(): Promise<object> {
    const allBlogs = await this.blogModel.find({}).exec();
    // var todayDate = new Date();
    // todayDate.setHours(0, 0, 0, 0);
    // todayDate.toISOString();
    var week = new Date();
    week.setHours(168, 10080, 604800, 604800000);
    const latestBlogs = await this.blogModel.aggregate([
      {
        $match: {
          createdAt: {
            $lte: week,
          },
        },
      },
    ]);
    return { allBlogs, latestBlogs };
  }

  async findOne(slug: string) {
    return await this.blogModel.findOne({ slug });
  }
  async findFilteredBlogs(query: { category: string }) {
    return await this.blogModel.find({ category: query.category });
  }

  // async findAllCompleted(slug: string, order_status: string) {
  //   const result = await this.orderModel.find({
  //     user_slug: slug,
  //     order_status: new RegExp(order_status, "i"),
  //   });

  //   return {
  //     data: result,
  //     message: "fetched Successfully",
  //   };
  // }

  update(id: number, updateBlogDto: UpdateBlogDto) {
    return `This action updates a #${id} blog`;
  }

  //-----------
  async delete(slug: string): Promise<Blog> {
    return await this.blogModel.findOneAndDelete({ slug });
  }
}
