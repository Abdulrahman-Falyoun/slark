import {Injectable} from '@nestjs/common';
import {UserService} from "../user.service";
import {SignupDto} from "./dto/signup.dto";
import {LoginDto} from "./dto/login.dto";
import * as bcrypt from 'bcrypt';
import {AuthenticationService} from "../../authentication/authentication.service";
import {operationsCodes} from "../../utils/operation-codes";
import {UserUtilsService} from "../user-utils.service";
import {mailService} from "../../services/mail.service";

@Injectable()
export class AccountService {
    constructor(private userService: UserService, private authenticationService: AuthenticationService, private userUtilsService: UserUtilsService) {
    }


    signup(signUpDto: SignupDto) {
        return this.userService.create(signUpDto);
    }

    async login(loginDto: LoginDto) {
        const user = await this.userService.findOne(null, loginDto.email);
        const isMatch = await bcrypt.compare(loginDto.password, user.password);
        if (!isMatch) {
            return {
                message: 'Password is not correct'
            }
        }
        return {
            _id: user._id,
            email: user.email,
            name: user.name,
            token: `Bearer ${this.authenticationService.generateAccessToken(user)}`
        };
    }


    async resendActivationLink(email) {
        if (!email) {
            return {
                message: `Missing data => email: ${email}`,
                code: operationsCodes.MISSING_DATA,
            };
        }
        const user = await this.userUtilsService.getUserByEmail(email);
        if (!user) {
            return {
                message:
                    "We were unable to find an user for this verification. Please SignUp!",
                code: operationsCodes.UNAVAILABLE_RESOURCE,
            };
        }
        if (user.verified) {
            return {
                message: "user has been already verified. Please Login",
                code: operationsCodes.SUCCESS,
            };
        }
        const token = await this.authenticationService.generateAccessToken({
            id: user.id,
            email: user.email,
        });
        return await mailService.sendEmailNodeMailer(
            user,
            token, {
                from: "no-reply@slark.com",
                to: user.email,
                subject: "Account Verification Link",
                text: "and easy to do anywhere, even with Node.js",
                html: `<pre>Hello ${user.name}\n\nPlease verify your account by clicking the link:\n<a href="http://localhost:3000/account/verify/${user.email}/${token}" target="_blank">Confirm email</a>\n\nThank You!\n</pre>`,
            });
    }

    async confirmEmail(email, token) {
        if (email === undefined || token === undefined) {
            return {
                message: `Missing data => email: ${email}, token: ${token}`,
                code: operationsCodes.MISSING_DATA,
            };
        }

        const user = await this.userUtilsService.getUserByEmail(email);
        if (!user) {
            return {
                message:
                    "We were unable to find user for this verification. Please SignUp!",
                code: operationsCodes.UNAVAILABLE_RESOURCE,
            };
        }
        if (user.verified) {
            return {
                message: "User has been already verified. Please Login",
                code: operationsCodes.SUCCESS,
            };
        }

        user.password = undefined;

        return await this.userUtilsService
            .updateOne({_id: user["_id"]}, {$set: {verified: true}})
            .then((updateResponse) => {
                return {
                    message:
                        updateResponse.nModified > 0
                            ? "Your account has been successfully verified"
                            : "Failed to verify your account, please contact your administrator",
                    user,
                    code: operationsCodes.SUCCESS,
                };
            })
            .catch((updateUserDBError) => {
                console.log("updateUserDBError confirmEmail: ", updateUserDBError);
                return {
                    message: "Internal server error",
                    code: operationsCodes.DATABASE_ERROR,
                };
            });
    };

}
