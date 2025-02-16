import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

//Definiendo el nombre de validación del decorador
@ValidatorConstraint({
  name: 'MatchPassword',
  async: false,
})
export class MatchPassword implements ValidatorConstraintInterface {
  validate(
    password: any,
    args?: ValidationArguments,
  ): Promise<boolean> | boolean {
    //Comparar password con el password de confirmación
    if (password !== (args.object as any)[args.constraints[0]]) return false;

    return true;
  }

  //Si la validación falla:

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args?: ValidationArguments): string {
    return `Password and password confirmation don't match`;
  }
}
