import {Module} from '@nestjs/common';
import {SpaceService} from './space.service';
import {SpaceController} from './space.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {SPACE_SCHEMA_NAME, SpaceSchema} from "./entities/space.entity";

@Module({
    imports: [
        MongooseModule.forFeature([{name: SPACE_SCHEMA_NAME, schema: SpaceSchema}]),
    ],
    controllers: [SpaceController],
    providers: [SpaceService],
    exports: [
        MongooseModule.forFeature([{name: SPACE_SCHEMA_NAME, schema: SpaceSchema}]),
    ]
})
export class SpaceModule {
}
