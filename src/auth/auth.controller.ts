import { TypedBody, TypedRoute } from '@nestia/core';
import {
  BadGatewayException,
  Controller,
  HttpCode,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { TCreateUserDto, TUserResponseDto } from 'src/user/dto/user.dto';
import { AuthService } from './auth.service';
import { ILoginResponseWithoutRefresh } from './interfaces/ILoginResponse';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @HttpCode(200)
  @TypedRoute.Post('logout')
  logout(@Res({ passthrough: true }) res: Response): void {
    this.authService.removeRefreshTokenFromResponse(res);
  }

  @UseGuards(AuthGuard('google'))
  @TypedRoute.Get('google')
  googleAuth(@Req() _req: Request) {
    console.log('Google auth', _req.user);
  }

  @UseGuards(AuthGuard('google'))
  @TypedRoute.Get('google/callback')
  async googleAuthCallback(
    @Req() req: { user: { name: string; email: string; picture: string } },
    @Res() res: Response,
  ) {
    const { tokens } = await this.authService.validateOAuthLogin(req);
    this.authService.addRefreshTokenToResponse(res, tokens.refreshToken);

    return res.redirect(
      `${process.env.CLIENT_URL}/dashboard?accessToken=${tokens.accessToken}`,
    );
  }
}
