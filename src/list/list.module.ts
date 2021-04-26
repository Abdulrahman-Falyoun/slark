import {Module} from '@nestjs/common';
import {ListService} from './list.service';
import {ListController} from './list.controller';
import {MongooseModule} from "@nestjs/mongoose";
import { ListSchema} from "./entities/list.entity";
import {SLARK_LIST} from "../utils/schema-names";
import {SpaceModule} from "../space/space.module";

@Module({
    imports: [
        MongooseModule.forFeature([{name: SLARK_LIST, schema: ListSchema}]),
        SpaceModule
    ],
    controllers: [ListController],
    providers: [ListService],
    exports: [ListService]
})
export class ListModule {
}
