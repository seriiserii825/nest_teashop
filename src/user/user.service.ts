import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'argon2';
import { transformUserToDto } from 'src/utils/transform-user';
import { Repository } from 'typeorm';
import { TCreateUserDto, TUserResponseDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(input: TCreateUserDto): Promise<TUserResponseDto> {
    await this.userExists(input.email);
    const hashedPassword = await hash(input.password);
    const newUser = this.userRepository.create({
      ...input,
      password: hashedPassword,
    });
    await this.userRepository.save(newUser);
    delete (newUser as Partial<User>).password;
    return transformUserToDto(newUser);
  }

  findAll() {
    return this.userRepository.find({
      relations: ['stores', 'favorites', 'orders'],
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['stores', 'favorites', 'orders'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['stores', 'favorites', 'orders'],
    });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async userExists(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new ConflictException('User with this email already exists');
    }
  }
}
