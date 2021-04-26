import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {SCHEMA_NAME, User} from './entities/user';
import {CreateUserDto} from './dtos/create-user.dto';
import {UpdateUserDto} from './dtos/update-user.dto';
import {PaginationQueryDto} from './dtos/pagination-query.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(@InjectModel(SCHEMA_NAME) private readonly userModel?: Model<User>) {
    }

    public async findAll(
        paginationQuery: PaginationQueryDto,
    ): Promise<User[]> {
        const {limit, offset} = paginationQuery;
        return await this.userModel
            .find()
            .skip(offset)
            .limit(limit)
            .exec();
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const hash = await bcrypt.hash(createUserDto.password, 10);
        const createdUser = new this.userModel({...createUserDto, password: hash});
        const savedUser = await createdUser.save();
        savedUser['password'] = undefined;
        savedUser['__v'] = undefined;
        return savedUser;
    }

    public async findOne(userId?: string, email?: string): Promise<User> {
        if (!userId && !email) {
            throw new NotFoundException(`You should provide userId or email`);
        }
        let user;
        if (userId) {
            user = await this.userModel
                .findById({_id: userId})
                .exec();
        } else {
            user = await this.userModel.findOne({
                email: email
            });
        }
        if (!user) {
            throw new NotFoundException(`User #${email || userId} not found`);
        }

        return user;
    }

    public async update(
        userId: string,
        updateUserDto: UpdateUserDto,
    ): Promise<User> {
        const existingUser = await this.userModel.findByIdAndUpdate(
            {_id: userId},
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
        ).select({name: 1, email: 1});
    }
}
