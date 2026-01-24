import { tags } from 'typia';

interface IUserDto {
  id: number;
  name?: undefined | (string & tags.MinLength<2>);
  email: string & tags.Format<'email'>;
  password: string & tags.MinLength<6>;
  picture: string;
  createdAt: string & tags.Format<'date-time'>;
  updatedAt: string & tags.Format<'date-time'>;
}

export type TCreateUserDto = Pick<IUserDto, 'name' | 'email' | 'password'>;

export type TUserResponseDto = Omit<IUserDto, 'password'>;
