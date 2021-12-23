import { Body, Injectable, Post, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { UserRepository } from './users.repository';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { JwTPayload } from './dto/jwt-payload.interface';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.createUser(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}>{
      const {username, password} = authCredentialsDto;

      const user = await this.userRepository.findOne({username})
      if(user && await bcrypt.compare(password, user.password) ){
        const payload: JwTPayload = {username};
        const accessToken: string = await this.jwtService.sign(payload)
        return {accessToken};
      }
      else
        throw new UnauthorizedException();

  }

}
