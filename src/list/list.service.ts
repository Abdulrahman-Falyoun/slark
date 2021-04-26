import {Injectable} from '@nestjs/common';
import {CreateListDto} from './dto/create-list.dto';
import {UpdateListDto} from './dto/update-list.dto';
import {InjectModel} from "@nestjs/mongoose";
import {List} from "./entities/list.entity";
import {Model, QueryOptions, UpdateQuery} from "mongoose";
import {SLARK_LIST} from "../utils/schema-names";
import {operationsCodes} from "../utils/operation-codes";
import {wrapFunctionWithinTransaction} from "../utils/transaction-initializer";
import {SpaceService} from "../space/space.service";

@Injectable()
export class ListService {
    constructor(
        @InjectModel(SLARK_LIST) private readonly listModel: Model<List>,
        private spaceService: SpaceService
    ) {
    }

    async addList(list: CreateListDto) {
        if (!list._space || !list.name) {
            return {
                message: "Not enough data to create list, required fields (name, _space)",
                _space: list._space,
                code: operationsCodes.MISSING_DATA,
            };
        }
        const c = new this.listModel({...list});

        return await wrapFunctionWithinTransaction(
            this.listModel,
            async (session) => {
                await c.save({session});
                await this.spaceService.updateSpace(
                    c._space,
                    {
                        $push: {_lists: c},
                    },
                    {session}
                );
            },
            {
                list: c,
                message: "List added",
            },
            {
                message: "Could not add list",
            }
        );
    }

    async updateList(id, updateQuery: UpdateQuery<this>, opts?: QueryOptions) {
        const p = await this.findListById(id, opts);
        return await p
            .updateOne(updateQuery, opts)
            .then((p) => p)
            .catch((e) => {
                console.log("Error in updating list [list.service]: ", e);
                return null;
            });
    }

    async deleteList(listId) {
        if (!listId) {
            return {
                code: operationsCodes.MISSING_DATA,
                message: `You should provide valid list id: received: ${listId}`,
            };
        }
        try {
            const list: List = await this.findListById(listId);
            if (!list) {
                return {
                    code: operationsCodes.UNAVAILABLE_RESOURCE,
                    message: "Could not find a list with id: " + listId,
                };
            }

            await list.deleteOne();
            return {
                code: operationsCodes.SUCCESS,
                message: 'list removed successfully'
            }
        } catch (e) {
            return {
                code: operationsCodes.DATABASE_ERROR,
                message: "Could not remove a list with id: " + listId,
                e,
            };
        }
    }

    async findListById(id, opts?: QueryOptions): Promise<List> {
        return await this.listModel
            .findById({_id: id}, null, opts)
            .then((p) => p)
            .catch((e) => {
                console.log("error while getting list [list.service.ts]: ", e);
                return null;
            });
    }
}
