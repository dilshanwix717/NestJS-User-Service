import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('get-user-profile')
  getUserProfile(@Payload() userId: string) {
    return this.userService.getUserProfile(userId);
  }
}
