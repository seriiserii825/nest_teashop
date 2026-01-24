import { TUserResponseDto } from 'src/user/dto/user.dto';

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface ILoginResponse {
  user: TUserResponseDto;
  tokens: ITokens;
}

export interface ILoginResponseWithoutRefresh {
  user: TUserResponseDto;
  tokens: { accessToken: string };
}
