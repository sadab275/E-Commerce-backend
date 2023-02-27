import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MegaCategories, MegaCategoriesDocument } from 'src/schemas/mega_menu_categories.schema';
import { UtilSlug } from 'src/utils/UtilSlug';
import { CreateMegaMenuCategoryDto } from './dto/create-mega_menu_category.dto';
import { UpdateMegaMenuCategoryDto } from './dto/update-mega_menu_category.dto';

@Injectable()
export class MegaMenuCategoriesService {
  constructor(
    @InjectModel(MegaCategories.name)
    private readonly megaCategoriesModel: Model<MegaCategoriesDocument>
  ) {}

  async create(createMegaMenuCategoryDto: CreateMegaMenuCategoryDto) {
    const slug = UtilSlug.getUniqueId(`Mega_${createMegaMenuCategoryDto.cat_name}`);
    createMegaMenuCategoryDto.slug = slug;
    return await this.megaCategoriesModel.create(createMegaMenuCategoryDto);
  }

  async findAll() {
    return await this.megaCategoriesModel.find({});
  }

  findOne(id: number) {
    return `This action returns a #${id} megaMenuCategory`;
  }

  update(id: number, updateMegaMenuCategoryDto: UpdateMegaMenuCategoryDto) {
    return `This action updates a #${id} megaMenuCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} megaMenuCategory`;
  }
}
