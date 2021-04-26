import {Injectable} from '@nestjs/common';
import {CreateListDto} from './dto/create-list.dto';
import {UpdateListDto} from './dto/update-list.dto';
import {InjectModel} from "@nestjs/mongoose";
import {List, LIST_SCHEMA_NAME} from "./entities/list.entity";
import {Model} from "mongoose";

@Injectable()
export class ListService {
    constructor(@InjectModel(LIST_SCHEMA_NAME) private readonly listModel: Model<List>) {
    }

    create(createListDto: CreateListDto) {
        return 'This action adds a new list';
    }

    findAll() {
        return `This action returns all list`;
    }

    findOne(id: number) {
        return `This action returns a #${id} list`;
    }

    update(id: number, updateListDto: UpdateListDto) {
        return `This action updates a #${id} list`;
    }

    remove(id: number) {
        return `This action removes a #${id} list`;
    }
}
