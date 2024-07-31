import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthEntity } from './auth.entity';

@ValidatorConstraint({ async: true })
@Injectable()
export class AuthExistsConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
  ) {}

  async validate(authId: number) {
    if (!authId) {
      return false;
    }

    const authExists = await this.authRepository.findOne({
      where: { id: authId },
    });
    return !!authExists;
  }
}

export function AuthExists(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: AuthExistsConstraint,
    });
  };
}
