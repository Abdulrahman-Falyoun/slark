import {FilterQuery, UpdateQuery, QueryOptions, Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {User, USER_SCHEMA_NAME} from "./entities/user";
import {Injectable} from "@nestjs/common";

@Injectable()
export class UserUtilsService {
    constructor(@InjectModel(USER_SCHEMA_NAME) private readonly userModel?: Model<User>) {
    }

    async getUserById(id) {
        try {
            return await this.userModel.findById(id).populate("_roles");
        } catch (e) {
            console.log(`getUserById(${id}) e: `, e);
            return null;
        }
    }

    async getUserByEmail(email, populate = true) {
        try {
            if (populate) {
                return await this.userModel
                    .findOne({email})
                    .select({__v: 0, createdAt: 0, updatedAt: 0})
                    .populate("_roles", {_id: 0, __v: 0})
                    .populate("_projects", {name: 1})
                    .populate("_tasks", {name: 1});
            }
            return await this.userModel
                .findOne({email})
                .select({__v: 0, createdAt: 0, updatedAt: 0});
        } catch (e) {
            console.log("getUserByEmail [user.utils.service.ts] -> e: ", e);
            return null;
        }
    }

    updateOne<T>(
        filterQuery: FilterQuery<T>,
        updateQuery: UpdateQuery<T>,
        queryOptions?: QueryOptions
    ) {
        return this.userModel.updateOne(filterQuery, updateQuery, queryOptions);
    }

    updateMany<T>(
        filterQuery: FilterQuery<T>,
        updateQuery: UpdateQuery<T>,
        queryOptions?: QueryOptions
    ) {
        return this.userModel.updateMany(filterQuery, updateQuery, queryOptions);
    }
}
