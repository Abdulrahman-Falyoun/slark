import {Injectable} from '@nestjs/common';
import {CreateListDto} from './dto/create-list.dto';
import {UpdateListDto} from './dto/update-list.dto';
import {InjectModel} from "@nestjs/mongoose";
import {List} from "./entities/list.entity";
import {Model} from "mongoose";
import {SLARK_LIST} from "../utils/schema-names";

@Injectable()
export class ListService {
    constructor(@InjectModel(SLARK_LIST) private readonly listModel: Model<List>) {
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
