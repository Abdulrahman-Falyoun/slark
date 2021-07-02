import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';
import { UserModel } from './user.model';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { RoleService } from '../role/role.service';
import { NORMAL_USER } from '../utils/system-roles';
import { AuthenticationService } from '../authentication/authentication.service';
import { mailService } from '../services/mail.service';
import { SLARK_USER } from '../utils/schema-names';
import { WorkspaceService } from '../workspace/workspace.service';
import { withTransaction } from '../utils/transaction-initializer';
import { MongoError } from 'mongodb';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(SLARK_USER) private readonly userModel: Model<UserModel>,
    private roleService: RoleService,
    private authenticationService: AuthenticationService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return await withTransaction(this.userModel, async (session) => {
      const hash = await bcrypt.hash(createUserDto.password, 10);
      const userRole = await this.roleService.createNewRole(NORMAL_USER);
      if (!userRole) {
        throw new Error(
          'Could not grant a role, kindly contact us to solve this problem',
        );
      }
      const createdUser = new this.userModel({
        ...createUserDto,
        password: hash,
        _roles: [userRole],
      });
      const savedUser = await createdUser.save({ session });
      savedUser['password'] = undefined;
      savedUser['__v'] = undefined;

      const token = await this.authenticationService.generateAccessToken({
        id: savedUser.id,
        email: savedUser.email,
      });
      const sendMailResponse = await mailService.sendEmailNodeMailer(
        savedUser,
        token,
        {
          from: 'no-reply@slark.com',
          to: savedUser.email,
          subject: 'Account Verification Link',
          text: 'and easy to do anywhere, even with Node.js',
          html: `<pre>Hello ${savedUser.name}\n\nPlease verify your account by clicking the link:\n<a href="http://localhost:3000/accounts/verify/${savedUser.email}/${token}" target="_blank">Confirm email</a>\n\nThank You!\n</pre>`,
        },
      );
      console.log({ sendMailResponse });
      return sendMailResponse;
    });
  }

  public async findOne(
    filterQuery: FilterQuery<UserModel>,
  ): Promise<UserModel> {
    return this.userModel
      .findOne(filterQuery)
      .populate('_roles')
      .populate('_workspaces')
      .then((u) => {
        if (!u) {
          throw new MongoError({
            message: `User not found`,
            error: `User not found`,
          });
        }
        return u;
      });
  }

  async deleteUser(id: string) {
    const user = await this.findOne({ _id: id });
    await user.deleteOne();
    return user;
  }

  async updateUser(
    filterQuery: FilterQuery<UserModel>,
    updateDoc,
    opts?: QueryOptions,
  ) {
    return await this.userModel
      .updateOne(filterQuery, { $set: updateDoc }, opts)
      .then((updateResponse) => updateResponse)
      .catch((updateUserDBError) => {
        console.log('updateUserDBError confirmEmail: ', updateUserDBError);
        return null;
      });
  }
  async mongooseUpdate(
    filterQuery: FilterQuery<UserModel>,
    updateQuery: UpdateQuery<UserModel>,
    opts?: QueryOptions,
  ) {
    return await this.userModel
      .updateOne(filterQuery, updateQuery, opts)
      .then((updateResponse) => {
        if (updateResponse.nModified < 1) {
          throw new MongoError({
            message: `User not updated`,
            error: `User not updated`,
          });
        }
        return updateResponse;
      });
  }
  async updateMultipleUsers(
    filterQuery: FilterQuery<UserModel>,
    updateQuery: UpdateQuery<UserModel>,
    opts?: QueryOptions,
  ) {
    return this.userModel.updateMany(filterQuery, updateQuery, opts);
  }
  async findAll(filterQuery?: FilterQuery<UserModel>) {
    return this.userModel.find(filterQuery);
  }
}
