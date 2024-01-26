import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly _usersRepository: UsersRepository,
    private readonly _jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this._usersRepository.createUser(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const user = await this._usersRepository.findOne({
      where: {
        username,
      },
    });
    if (user && user.password !== bcrypt.compare(password, user.password)) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this._jwtService.signAsync(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException(
        'Please check your credentials and try again',
      );
    }
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this._usersRepository.findOne({ where: { username } });
    if (user && bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this._jwtService.sign(payload),
    };
  }
}
