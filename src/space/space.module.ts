import {Module} from '@nestjs/common';
import {SpaceService} from './space.service';
import {SpaceController} from './space.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {SpaceSchema} from "./space.model";
import {SLARK_SPACE} from "../utils/schema-names";

@Module({
    imports: [
        MongooseModule.forFeature([{name: SLARK_SPACE, schema: SpaceSchema}]),
    ],
    controllers: [SpaceController],
    providers: [SpaceService],
    exports: [
        SpaceService
    ]
})
export class SpaceModule {
}
