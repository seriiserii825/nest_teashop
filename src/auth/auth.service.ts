import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { TCreateUserDto, TUserResponseDto } from 'src/user/dto/user.dto';
import { transformUserToDto } from 'src/utils/transform-user';
import { ILoginResponse, ITokens } from './interfaces/ILoginResponse';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwt: JwtService,
    private configService: ConfigService,
  ) {}

  async login(dto: TCreateUserDto): Promise<ILoginResponse> {
    const user = await this.validateUser(dto);
    const tokens = this.issueTokens(user.id);
    return { user, tokens };
  }

  async register(dto: TCreateUserDto): Promise<TUserResponseDto> {
    const user = await this.userService.create(dto);
    return user;
  }

  issueTokens(userId: number): ITokens {
    const data = { id: userId };

    const accessToken = this.jwt.sign(data, {
      expiresIn: this.configService.getOrThrow('JWT_EXPIRATION_TIME'),
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: this.configService.getOrThrow('JWT_REFRESH_EXPIRATION_TIME'),
    });

    return { accessToken, refreshToken };
  }

  private async validateUser(dto: TCreateUserDto): Promise<TUserResponseDto> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new NotFoundException('User not found');
    return transformUserToDto(user);
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
