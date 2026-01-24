import { Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { AuthJwt } from 'src/auth/decorators/auth.jwt.decorator';
import { CurrentUser } from './decorators/user.decorator';
import { TUserResponseDto } from './dto/user.dto';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@AuthJwt()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('profile')
  getProfile(@CurrentUser() user: User): Promise<TUserResponseDto> {
    return this.userService.findOne(+user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Get(':email')
  findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Patch('favorites/:productId')
  async toggleFavorite(
    @CurrentUser('id') userId: number,
    @Param('productId') productId: string,
  ) {
    return this.userService.toggleFavorite(+productId, userId);
  }
}
