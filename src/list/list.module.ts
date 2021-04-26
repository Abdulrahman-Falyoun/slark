import {Module} from '@nestjs/common';
import {ListService} from './list.service';
import {ListController} from './list.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {ListSchema} from "./entities/list.entity";
import {SLARK_LIST} from "../utils/schema-names";

@Module({
    imports: [
        MongooseModule.forFeature([{name: SLARK_LIST, schema: ListSchema}]),
    ],
    controllers: [ListController],
    providers: [ListService],
})
export class ListModule {
}
