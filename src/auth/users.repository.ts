import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import {BadRequestException, ConflictException, Injectable, InternalServerErrorException} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = this.create({
      username,
      password,
    });

    try {
      await this.save(user);
      console.log(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User with that username already exist');
      }

      throw new InternalServerErrorException();
    }
  }
}
