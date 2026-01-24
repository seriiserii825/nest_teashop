import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { TCreateUserDto, TUserResponseDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { transformUserToDto } from 'src/utils/transform-user';
import { IJwtPayload } from './interfaces/IJwtPayload';
import { ILoginResponse, ITokens } from './interfaces/ILoginResponse';

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

  async getNewTokens(refreshToken: string): Promise<ILoginResponse> {
    const result: IJwtPayload = this.jwt.verify(refreshToken);
    if (!result) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.userService.findOne(result.id);
    if (!user) throw new NotFoundException('User not found');

    const tokens = this.issueTokens(user.id);
    return { user: transformUserToDto(user), tokens };
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string): void {
    const expiresIn = new Date();
    const days = this.configService.getOrThrow<number>(
      'JWT_REFRESH_COOKIE_DAYS',
    );
    expiresIn.setDate(expiresIn.getDate() + days);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      expires: expiresIn,
      domain: this.configService.getOrThrow<string>('SERVER_DOMAIN'),
      secure: true,
      sameSite: 'none',
    });
  }

  removeRefreshTokenFromResponse(res: Response): void {
    const expiresIn = new Date(0);
    res.cookie('refreshToken', '', {
      httpOnly: true,
      expires: expiresIn,
      domain: this.configService.getOrThrow<string>('SERVER_DOMAIN'),
      secure: true,
      sameSite: 'none',
    });
  }

  private async validateUser(dto: TCreateUserDto): Promise<TUserResponseDto> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new NotFoundException('User not found');
    return transformUserToDto(user);
  }

  async validateOAuthLogin(req: {
    user: {
      name: string;
      email: string;
      picture: string;
    };
  }): Promise<ILoginResponse> {
    let user = await this.userService.findByEmailOrNull(req.user.email);
    if (!user) {
      user = await this.userService.createForGoogle({
        email: req.user.email,
        name: req.user.name,
      });
    }
    const tokens = this.issueTokens(user.id);
    return { user: transformUserToDto(user), tokens };
  }
}
