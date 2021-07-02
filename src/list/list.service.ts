import { Injectable } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ListModel } from './list.model';
import { FilterQuery, Model, QueryOptions, Types, UpdateQuery } from 'mongoose';
import { SLARK_LIST } from '../utils/schema-names';
import { MongoError } from 'mongodb';
import { SpaceService } from '../space/space.service';
import { GetListsDto } from './dto/get-lists.dto';

@Injectable()
export class ListService {
  constructor(
    @InjectModel(SLARK_LIST) private readonly listModel: Model<ListModel>, // private spaceService: SpaceService,
    private readonly spaceService: SpaceService,
  ) {}

  async addList(list: CreateListDto) {
    const s = await this.spaceService.findOne({
      _id: list._space,
    });
    const c = new this.listModel({ ...list, _space: s._id });
    return await c.save();
  }

  async mongooseUpdate(
    filterQuery: FilterQuery<ListModel>,
    updateQuery: UpdateQuery<ListModel>,
    opts?: QueryOptions,
  ) {
    const p = await this.findList(filterQuery);
    const res = await p.updateOne(updateQuery, opts);
    if (res.nModified < 1) {
      throw new MongoError({
        message: `Could not update task`,
      });
    }
    return this.findList(filterQuery);
  }

  async updateList(
    filterQuery: FilterQuery<ListModel>,
    updateDto: UpdateListDto,
    opts?: QueryOptions,
  ) {
    const p = await this.findList(filterQuery);
    const res = await p.updateOne(
      {
        $set: updateDto as any,
      },
      opts,
    );
    if (res.nModified < 1) {
      throw new MongoError({
        message: `Could not update task`,
      });
    }
    return this.findList(filterQuery);
  }

  async deleteList(filterQuery: FilterQuery<ListModel>) {
    const list = await this.findList(filterQuery);
    await list.deleteOne();
    return list;
  }

  async findAllLists(getListsDto: GetListsDto) {
    let filterQuery: FilterQuery<ListModel> = {};

    if (getListsDto._space) {
      filterQuery._space = {
        $eq: Types.ObjectId(getListsDto._space) as any,
      };
    }

    return this.listModel
      .find(filterQuery)
      .limit(getListsDto.limit)
      .skip(getListsDto.skip)
      .sort(getListsDto.sort || '_id');
  }
  async findList(filterQuery: FilterQuery<ListModel>) {
    return await this.listModel
      .findOne(filterQuery)
      .populate('_space')
      .then((p) => {
        if (!p) {
          throw new MongoError({
            message: `List not found`,
            error: `List not found`
          });
        }
        return p;
      });
  }
}
