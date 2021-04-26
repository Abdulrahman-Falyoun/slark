import {Module} from '@nestjs/common';
import {WorkspaceService} from './workspace.service';
import {WorkspaceController} from './workspace.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {WORKSPACE_SCHEMA_NAME, WorkspaceSchema} from "./entities/workspace.entity";

@Module({
    imports: [
        MongooseModule.forFeature([{name: WORKSPACE_SCHEMA_NAME, schema: WorkspaceSchema}]),
    ],
    controllers: [WorkspaceController],
    providers: [WorkspaceService],
    exports: [
        MongooseModule.forFeature([{name: WORKSPACE_SCHEMA_NAME, schema: WorkspaceSchema}]),
    ],
})
export class WorkspaceModule {
}
