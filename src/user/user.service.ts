import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SCHEMA_NAME, User } from './user';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { PaginationQueryDto } from './dtos/pagination-query.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(SCHEMA_NAME) private readonly userModel: Model<User>) {
  }

  public async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<User[]> {
    const { limit, offset } = paginationQuery;
    return await this.userModel
      .find()
      .skip(offset)
      .limit(limit)
      .exec();
  }

  async create(createCatDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createCatDto);
    return createdUser.save();
  }

  public async findOne(userId: string): Promise<User> {
    const user = await this.userModel
      .findById({ _id: userId })
      .exec();
    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }
    return user;
  }

  public async update(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const existingUser = await this.userModel.findByIdAndUpdate(
      { _id: userId },
      updateUserDto,
    );

    if (!existingUser) {
      throw new NotFoundException(`User #${userId} not found`);
    }

    return existingUser;
  }

  public async remove(userId: string): Promise<any> {
    return this.userModel.findByIdAndRemove(
      userId,
    );
  }
}
