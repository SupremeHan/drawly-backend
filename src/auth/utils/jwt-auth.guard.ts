import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategiesEnum } from 'src/utils/types';

@Injectable()
export class JwtGuard extends AuthGuard(StrategiesEnum.JWT) {}
