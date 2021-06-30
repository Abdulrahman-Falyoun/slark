import { Injectable } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { InjectModel } from '@nestjs/mongoose';
import { List } from './list.model';
import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';
import { SLARK_LIST } from '../utils/schema-names';
// import { SpaceService } from '../space/space.service';
import { withTransaction } from '../utils/transaction-initializer';
import { MongoError } from 'mongodb';

@Injectable()
export class ListService {
  constructor(
    @InjectModel(SLARK_LIST) private readonly listModel: Model<List>, // private spaceService: SpaceService,
  ) {}

  async addList(list: CreateListDto) {
    const c = new this.listModel(list);
    return await withTransaction(this.listModel, async (session) => {
      await c.save({ session });
      // await this.spaceService.updateSpace(
      //   { _id: c._space },
      //   {
      //     $push: { _lists: c },
      //   },
      //   { session },
      // );

    });
  }

  async mongooseUpdate(
    filterQuery: FilterQuery<List>,
    updateQuery: UpdateQuery<List>,
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
    filterQuery: FilterQuery<List>,
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

  async deleteList(listId) {
    const list: List = await this.findList(listId);
    await list.deleteOne();
  }

  async findList(filterQuery: FilterQuery<List>): Promise<List> {
    return await this.listModel.findOne(filterQuery).then((p) => {
      if (!p) {
        throw new MongoError({
          message: `List not found`,
        });
      }
      return p;
    });
  }
}
