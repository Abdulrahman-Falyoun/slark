import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {User} from './entities/user';
import {CreateUserDto} from './dtos/create-user.dto';
import {UpdateUserDto} from './dtos/update-user.dto';
import {PaginationQueryDto} from './dtos/pagination-query.dto';
import * as bcrypt from 'bcrypt';
import {operationsCodes} from "../utils/operation-codes";
import {RoleService} from "../role/role.service";
import {NORMAL_USER} from "../utils/system-roles";
import {AuthenticationService} from "../authentication/authentication.service";
import {mailService} from "../services/mail.service";
import {SLARK_USER} from "../utils/schema-names";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(SLARK_USER) private readonly userModel: Model<User>,
        private roleService: RoleService,
        private authenticationService: AuthenticationService
    ) {
    }

    public async findAll(
        paginationQuery: PaginationQueryDto,
    ): Promise<User[]> {
        const {limit, offset} = paginationQuery;
        return await this.userModel
            .find()
            .skip(offset)
            .limit(limit)
            .exec();
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
                .exec();
        } else {
            user = await this.userModel.findOne({
                email: email
            });
        }
        if (!user) {
            throw new NotFoundException(`User #${email || userId} not found`);
        }

        return user;
    }

    public async update(
        userId: string,
        updateUserDto: UpdateUserDto,
    ): Promise<User> {
        const existingUser = await this.userModel.findByIdAndUpdate(
            {_id: userId},
            updateUserDto,
        );

        if (!existingUser) {
            throw new NotFoundException(`User #${userId} not found`);
        }

        return existingUser;
    }

    public async remove(userId: string): Promise<any> {
        return this.userModel.findByIdAndRemove(
            userId,
        ).select({name: 1, email: 1});
    }
}
