import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategiesEnum } from 'src/utils/types';

@Injectable()
export class GoogleAuthGuard extends AuthGuard(StrategiesEnum.Google) {}
