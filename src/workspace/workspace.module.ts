import { Global, Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkspaceSchema } from './workspace.model';
import { SLARK_WORKSPACE } from '../utils/schema-names';

const workspaceFeature = { name: SLARK_WORKSPACE, schema: WorkspaceSchema };

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      workspaceFeature,
    ]),
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
  exports: [WorkspaceService],

})
export class WorkspaceModule {
}
