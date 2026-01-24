import { tags } from 'typia';

type StoreDto = {
  id: number;
  title: string & tags.MinLength<2>;
  description?: string & tags.MinLength<10>;
  user_id: number;
  createdAt: string & tags.Format<'date-time'>;
  updatedAt: string & tags.Format<'date-time'>;
};

export type CreateStoreDto = Pick<StoreDto, 'title'>;
export type UpdateStoreDto = Partial<Pick<StoreDto, 'title' | 'description'>>;

export type StoreResponseDto = StoreDto;
