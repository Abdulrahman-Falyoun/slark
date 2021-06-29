import { FilterQuery, UpdateQuery, QueryOptions, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user';
import { Injectable } from '@nestjs/common';
import { SLARK_USER } from '../utils/schema-names';
import { MongoError } from 'mongodb';

@Injectable()
export class UserUtilsService {
  constructor(
    @InjectModel(SLARK_USER) private readonly userModel?: Model<User>,
  ) {}

  async getUserById(id) {
    try {
      return await this.userModel.findById(id).populate('_roles');
    } catch (e) {
      console.log(`getUserById(${id}) e: `, e);
      return null;
    }
  }

  async getUserByEmail(email) {
    return await this.userModel
      .findOne({ email })
      .select({ __v: 0, createdAt: 0, updatedAt: 0 })
      .populate('_roles', { _id: 0, __v: 0 })
      .populate('_projects', { name: 1 })
      .populate('_tasks', { name: 1 })
      .then((u) => {
        if (!u) {
          throw new MongoError({
            message: `User not found`,
          });
        }
        return u;
      });
  }

  updateOne<T>(
    filterQuery: FilterQuery<T>,
    updateQuery: UpdateQuery<T>,
    queryOptions?: QueryOptions,
  ) {
    return this.userModel.updateOne(filterQuery, updateQuery, queryOptions);
  }

  updateMany(
    filterQuery: FilterQuery<User>,
    updateQuery: UpdateQuery<User>,
    queryOptions?: QueryOptions,
  ) {
    return this.userModel.updateMany(filterQuery, updateQuery, queryOptions);
  }
}
