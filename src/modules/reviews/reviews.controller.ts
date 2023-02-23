import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { Review } from "src/schemas/review.schema";

@Controller("reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }
  // ---------------------------------
  @Get()
  findAll(@Query() query: { user_slug: string }) {
    return this.reviewsService.findAll(query);
  }
  // ---------------------------------
  @Get("/findAllForAdmin")
  findAllForAdmin(query) {
    return this.reviewsService.findAllForAdmin(query);
  }
  // ---------------------------------
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.reviewsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(+id, updateReviewDto);
  }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.reviewsService.remove(+id);
  // }

  @Delete(":slug")
  delete(@Param("slug") slug: string) {
    return this.reviewsService.delete(slug);
  }
}
