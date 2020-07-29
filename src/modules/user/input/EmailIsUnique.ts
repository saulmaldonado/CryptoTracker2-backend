import { getModelForClass } from '@typegoose/typegoose';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { User } from '../../../schemas/Users';

@ValidatorConstraint({ async: true })
export class EmailIsUniqueConstraint implements ValidatorConstraintInterface {
  async validate(email: string) {
    const UsersModel = getModelForClass(User, {
      schemaOptions: { collection: 'auth' },
    });

    const user = await UsersModel.findOne({ email });
    return !user;
  }
}

export function EmailIsUnique(validationOptions?: Omit<ValidationOptions, 'message'>) {
  const options: ValidationOptions = { ...validationOptions, message: 'Email already exists' };
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options,
      constraints: [],
      validator: EmailIsUniqueConstraint,
    });
  };
}
