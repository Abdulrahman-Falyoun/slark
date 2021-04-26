import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model, QueryOptions} from 'mongoose';
import {User} from './entities/user';
import {CreateUserDto} from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import {operationsCodes} from "../utils/operation-codes";
import {RoleService} from "../role/role.service";
import {NORMAL_USER} from "../utils/system-roles";
import {AuthenticationService} from "../authentication/authentication.service";
import {mailService} from "../services/mail.service";
import {SLARK_USER} from "../utils/schema-names";
import {WorkspaceService} from "../workspace/workspace.service";
import {UserUtilsService} from "./user-utils.service";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(SLARK_USER) private readonly userModel: Model<User>,
        private roleService: RoleService,
        private authenticationService: AuthenticationService,
        private workspaceService: WorkspaceService,
        private userUtilsService: UserUtilsService
    ) {
    }


    async create(createUserDto: CreateUserDto) {
        const hash = await bcrypt.hash(createUserDto.password, 10);
        const userRole = await this.roleService.createNewRole(NORMAL_USER);
        if (!userRole) {
            return {
                code: operationsCodes.FAILED,
                message:
                    "Could not grant a role, kindly contact us to solve this problem",
            };
        }
        try {
            const createdUser = new this.userModel({
                ...createUserDto,
                password: hash,
                _roles: [userRole],
            });
            const savedUser = await createdUser.save();
            savedUser['password'] = undefined;
            savedUser['__v'] = undefined;

            const token = await this.authenticationService.generateAccessToken({
                id: savedUser.id,
                email: savedUser.email,
            });
            return await mailService.sendEmailNodeMailer(
                savedUser,
                token,
                {
                    from: "no-reply@slark.com",
                    to: savedUser.email,
                    subject: "Account Verification Link",
                    text: "and easy to do anywhere, even with Node.js",
                    html: `<pre>Hello ${savedUser.name}\n\nPlease verify your account by clicking the link:\n<a href="http://localhost:3000/account/verify/${savedUser.email}/${token}" target="_blank">Confirm email</a>\n\nThank You!\n</pre>`,
                });
        } catch (e) {
            console.log("createNewUser [user.service.ts] e: ", e);
            return {
                code: operationsCodes.DATABASE_ERROR,
                error: e.messagee || e,
            };
        }
    }

    public async findOne(userId?: string, email?: string): Promise<User> {
        if (!userId && !email) {
            throw new NotFoundException(`You should provide userId or email`);
        }
        let user;
        if (userId) {
            user = await this.userModel
                .findById({_id: userId})
                .populate("_roles")
                .exec();
        } else {
            user = await this.userModel.findOne({
                email: email
            }).populate("_roles");
        }
        if (!user) {
            throw new NotFoundException(`User #${email || userId} not found`);
        }

        return user;
    }

    async deleteUser({ email, password }: { email: string; password: string }) {
        try {
            if (!email || !password) {
                return {
                    code: operationsCodes.MISSING_DATA,
                    message: `You should provide valid credentials, received email: ${email}, password: ${password}`,
                };
            }

            const user = await this.userUtilsService.getUserByEmail(email);

            if (!user) {
                return {
                    code: operationsCodes.FAILED,
                    message: `There's no account associated with ${email}, please sign up`,
                };
            }

            const passwordIsValid = bcrypt.compareSync(
                password.toString(),
                user.password
            );
            if (!passwordIsValid) {
                console.log("Password don't match");
                return {
                    message: "Password don't match",
                    email: email,
                    password: password,
                    code: operationsCodes.AUTHORIZATION_FAILED,
                };
            }
            await user.deleteOne();

            return {
                message: `User associated with ${email} got deleted successfully`,
                code: operationsCodes.SUCCESS,
            };
        } catch (e) {
            console.log("error in deleting user [user.service.ts]: ", e.message || e);
            return {
                message: "Could not remove user, kindly try a bit later",
                email,
                password,
                code: operationsCodes.DATABASE_ERROR,
            };
        }
    }




    async updateUser(id, updateDoc, opts?: QueryOptions) {
        return await this.userModel
            .updateOne({ _id: id }, { $set: updateDoc }, opts)
            .then((updateResponse) => updateResponse)
            .catch((updateUserDBError) => {
                console.log("updateUserDBError confirmEmail: ", updateUserDBError);
                return null;
            });
    }
    async updateUseByRef(user, updatedDoc) {
        user
            .updateOne({ _id: user.db.id }, { $set: updatedDoc })
            .then((updateResponse) => updateResponse)
            .catch((updateUserDBError) => {
                console.log("updateUserDBError confirmEmail: ", updateUserDBError);
                return null;
            });
    }

    async getAllInWorkspace(workspaceId) {
        if (!workspaceId) {
            return {
                code: operationsCodes.MISSING_DATA,
                message: "Please provide a valid workspace ID: received " + workspaceId,
            };
        }

        try {
            const p = await this.workspaceService.findWorkspaceById(workspaceId);
            if (!p) {
                return {
                    code: operationsCodes.UNAVAILABLE_RESOURCE,
                    message: `Workspace with id: ${workspaceId} does not exist`,
                };
            }

            const users: Array<User> = await this.userModel
                .find({ _id: { $in: p._users } })
                .select({ name: 1, email: 1 });

            return {
                code: operationsCodes.SUCCESS,
                users,
                message: "Retrieving users is done",
            };
        } catch (e) {
            console.log("ERROR [user.service.ts]: ", e.message || e);
            return {
                code: operationsCodes.DATABASE_ERROR,
                message: "Retrieving users has failed",
                e,
            };
        }
    }
}
