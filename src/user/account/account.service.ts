import {Injectable} from '@nestjs/common';
import {UserService} from "../user.service";

@Injectable()
export class AccountService {
    constructor(private userService: UserService) {

    }


    async signUp(signUpDto: any) {
        return await this.userService.create(signUpDto);
    }

}
