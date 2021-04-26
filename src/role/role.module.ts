import {Global, Module} from '@nestjs/common';
import {RoleService} from './role.service';
import {MongooseModule} from "@nestjs/mongoose";
import {SLARK_ROLE} from "../utils/schema-names";
import {RoleSchema} from "./entities/role.entity";

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([{name: SLARK_ROLE, schema: RoleSchema}])
    ],
    providers: [RoleService],
    exports: [RoleService]
})
export class RoleModule {
}
