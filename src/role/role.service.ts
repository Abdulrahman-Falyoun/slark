import {Injectable} from '@nestjs/common';
import {User} from "../user/entities/user";
import {Model, SaveOptions} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {SLARK_ROLE} from "../utils/schema-names";
import {Role} from "./entities/role.entity";

@Injectable()
export class RoleService {
    constructor(@InjectModel(SLARK_ROLE) private readonly roleModel: Model<Role>) {
    }

    public hasRoleOverTarget(user: User, targetId: string, roleType: { name: string, number: number }): boolean {
        const roles = user._roles;
        return roles.some(role => role.targetId === targetId && role.name === roleType.name && +role.number === +roleType.number);
    }

    public async createNewRole(roleData, opts?: SaveOptions) {
        const role = new this.roleModel({
            ...roleData,
        });
        return await role
            .save(opts)
            .then((r) => r)
            .catch((err) => {
                console.log("creating role error: [role.service.js]: ", err);
                return null;
            });
    }
}
