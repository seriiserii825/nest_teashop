import { TypedBody, TypedRoute } from '@nestia/core';
import { BadGatewayException, Controller, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import type { TCreateUserDto, TUserResponseDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { ILoginResponseWithoutRefresh } from './interfaces/ILoginResponse';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @TypedRoute.Post('register')
  create(@TypedBody() input: TCreateUserDto): Promise<TUserResponseDto> {
    return this.authService.register(input);
  }

  @TypedRoute.Post('login')
  async login(
    @TypedBody() input: TCreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ILoginResponseWithoutRefresh> {
    const { tokens, ...user } = await this.authService.login(input);
    this.authService.addRefreshTokenToResponse(res, tokens.refreshToken);

    return { ...user, tokens: { accessToken: tokens.accessToken } };
  }

  @TypedRoute.Post('login/access-token')
  async loginAccessToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refreshToken'] as string;
    if (!refreshToken) {
      throw new BadGatewayException('No refresh token provided');
    }
    const { tokens, ...user } =
      await this.authService.getNewTokens(refreshToken);
    this.authService.addRefreshTokenToResponse(res, tokens.refreshToken);

    return { ...user, tokens: { accessToken: tokens.accessToken } };
  }
}
