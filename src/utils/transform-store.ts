import { StoreResponseDto } from 'src/store/dto/store.dto';
import { Store } from 'src/store/entities/store.entity';

export function transformStoreToDto(store: Store): StoreResponseDto {
  return {
    id: store.id,
    title: store.title,
    user_id: store.user_id,
    description: store.description ?? undefined,
    createdAt: store.createdAt,
    updatedAt: store.updatedAt,
  };
}
