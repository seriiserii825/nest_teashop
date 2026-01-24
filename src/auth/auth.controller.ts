import {
  BadGatewayException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { TCreateUserDto, TUserResponseDto } from 'src/user/dto/user.dto';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/create-auth.dto';
import { ILoginResponseWithoutRefresh } from './interfaces/ILoginResponse';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({
    type: TUserResponseDto,
    description: 'User successfully registered',
  })
  create(@Body() input: TCreateUserDto): Promise<TUserResponseDto> {
    return this.authService.register(input);
  }

  @Post('login')
  @ApiCreatedResponse({
    type: LoginResponseDto,
    description: 'User successfully logged in',
  })
  async login(
    @Body() input: TCreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ILoginResponseWithoutRefresh> {
    const { tokens, ...user } = await this.authService.login(input);
    this.authService.addRefreshTokenToResponse(res, tokens.refreshToken);

    return { ...user, tokens: { accessToken: tokens.accessToken } };
  }

  @Post('login/access-token')
  @ApiCreatedResponse({
    type: LoginResponseDto,
    description: 'New access token generated successfully',
  })
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
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response): void {
    this.authService.removeRefreshTokenFromResponse(res);
  }

  @UseGuards(AuthGuard('google'))
  @Get('google')
  googleAuth(@Req() _req: Request) {
    console.log('Google auth', _req.user);
  }

  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
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
