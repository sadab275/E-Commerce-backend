import { Injectable } from "@nestjs/common";
import { CreateBrandDto } from "./dto/create-brand.dto";
import { UpdateBrandDto } from "./dto/update-brand.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Brand, BrandDocument } from "src/schemas/brand.schema";
import { Model } from "mongoose";
import { NewBrand } from "./entities/brand.entity";
import { ServiceHandler } from "src/utils/ServiceHandler";
import { SearchSortDto } from "src/utils/all-queries.dto";
import { ISearchSortQuery } from "src/interfaces/SearchSortQuery";

@Injectable()
export class BrandsService {
  constructor(
    @InjectModel(Brand.name) private brandModel: Model<BrandDocument>
  ) {}

  async create(createBrandDto: CreateBrandDto) {
    const createdBrand = await this.brandModel.create(createBrandDto);
    // console.log(createdBrand)
    return createdBrand;
  }

  async findAll(query: SearchSortDto): Promise<NewBrand[]> {
    // const allBrands = await this.brandModel
    //   .find({ name: new RegExp(query.search, "i") })
    //   .sort({ [query.sortBy]: query.sortType });

    let newQuery: ISearchSortQuery = {
      search: query.search,
      sort: {
        // key: query.sortType,
        [`${query.sortBy}`]: query.sortType,
      },
    };

    const allBrands = await ServiceHandler.queryHandler(
      this.brandModel,
      newQuery,
      {}
    );

    const trimmedBrands = allBrands.map((brand) => {
      const newBrand = {
        sn: 1,
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo,
        status: brand.status,
      };
      return newBrand;
    });
    return trimmedBrands;
  }

  async findOne(slug: string): Promise<Brand> {
    const singleBrand = await this.brandModel.findOne({ slug: slug });
    return singleBrand;
  }

  async update(
    slug: string,
    updateBrandDto: UpdateBrandDto
  ): Promise<BrandDocument> {
    // console.log({ slug, updateBrandDto })
    const updatedBrand = await this.brandModel.findOneAndUpdate(
      { slug: slug },
      updateBrandDto,
      { new: true }
    );

    return updatedBrand;

    // if (updatedBrand) {
    //   return { message: "updated successfully" };
    // } else {
    //   return { message: "could not updated" };
    // }
  }

  async remove(slug: string): Promise<BrandDocument> {
    const deletedBrand = await this.brandModel.findOneAndDelete({ slug: slug });
    return deletedBrand;
  }
}
