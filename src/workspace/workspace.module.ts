import {Global, Module} from '@nestjs/common';
import {WorkspaceService} from './workspace.service';
import {WorkspaceController} from './workspace.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {WorkspaceSchema} from "./entities/workspace.entity";
import {SLARK_WORKSPACE} from "../utils/schema-names";

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([{name: SLARK_WORKSPACE, schema: WorkspaceSchema}]),
    ],
    controllers: [WorkspaceController],
    providers: [WorkspaceService],
    exports: [WorkspaceService]

})
export class WorkspaceModule {
}
