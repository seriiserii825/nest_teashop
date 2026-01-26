import { UserBasicDto } from 'src/user/dto/user.dto';

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface ILoginResponse {
  user: UserBasicDto;
  tokens: ITokens;
}

export interface ILoginResponseWithoutRefresh {
  user: UserBasicDto;
  tokens: { accessToken: string };
}
