import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}
  
  async create(createUserDto: CreateUserDto):Promise<User> {
    const newUser: User = await this.repository.save({
      ...createUserDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return newUser;
  }

  async findAll() :Promise<User[]> {
    return await this.repository.find();
  }

  async findOne(id: number) :Promise<User | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    Object.assign(user, updateUserDto, { updatedAt: new Date() });
    return this.repository.save(user);
  }

  async remove(id: number):Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {  
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.repository.findOne({ where: { email:username } });
  }
}
