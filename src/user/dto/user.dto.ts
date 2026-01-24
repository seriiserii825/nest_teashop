import { tags } from 'typia';

interface IUserDto {
  id: number;
  name?: undefined | (string & tags.Minimum<2>);
  email: string & tags.Format<'email'>;
  password: string & tags.MinLength<6>;
  picture: string & tags.Format<'uri'>;
  createdAt: tags.Format<'date-time'>;
  updatedAt: tags.Format<'date-time'>;
}

export type TCreateUserDto = Pick<IUserDto, 'name' | 'email' | 'password'>;
