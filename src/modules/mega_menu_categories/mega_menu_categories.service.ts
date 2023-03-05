import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  MegaCategories,
  MegaCategoriesDocument,
} from "src/schemas/mega_menu_categories.schema";
import { UtilSlug } from "src/utils/UtilSlug";
import { CreateMegaMenuCategoryDto } from "./dto/create-mega_menu_category.dto";
import { UpdateMegaMenuCategoryDto } from "./dto/update-mega_menu_category.dto";

@Injectable()
export class MegaMenuCategoriesService {
  constructor(
    @InjectModel(MegaCategories.name)
    private readonly megaCategoriesModel: Model<MegaCategoriesDocument>
  ) {}

  async create(createMegaMenuCategoryDto: CreateMegaMenuCategoryDto): Promise<MegaCategories> {
    const slug = `mega_${UtilSlug.getUniqueId(
      createMegaMenuCategoryDto.cat_name
    )}`;
    createMegaMenuCategoryDto.slug = slug;
    return await this.megaCategoriesModel.create(createMegaMenuCategoryDto);
  }

  async findAll(query: any): Promise<MegaCategories[]> {
    return await this.megaCategoriesModel
      .find({
        cat_name: new RegExp(query.search, "i"),
      })
      .sort({ [query.sortBy]: query.sortType });
  }

  async findOne(slug: string): Promise<MegaCategories> {
    return await this.megaCategoriesModel.findOne({ slug });
  }

  async update(slug: string, updateMegaMenuCategoryDto: UpdateMegaMenuCategoryDto): Promise<MegaCategories> {
    return  await this.megaCategoriesModel.findOneAndUpdate(
      { slug },
      updateMegaMenuCategoryDto,
      {
        new: true,
      }
    );
  }

  async remove(slug: string): Promise<MegaCategories> {
    return await this.megaCategoriesModel.findOneAndDelete({ slug }).exec();
  }
}
