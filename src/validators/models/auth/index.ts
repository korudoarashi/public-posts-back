import { Validate, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import validator from 'validator';

@ValidatorConstraint({ name: 'bearerToken', async: false })
export class BearerToken implements ValidatorConstraintInterface {
  validate(bearerToken: string) {
    if(!bearerToken)
			return false;

		const parts = bearerToken.split(' ');
		if(parts.length !== 2)
			return false;

		const [scheme, token] = parts;

		if(!/^Bearer$/i.test(scheme))
			return false;

		return validator.isJWT(token);
  }

  defaultMessage() {
    return '($value) is a invalid Bearer Token!';
  }
}

export class Auth {
	@Validate(BearerToken)
	bearerToken: string

	constructor(bearerToken?: string) {
		this.bearerToken = bearerToken || '';
	}

	getToken() {
		return this.bearerToken.split(' ')?.[1] || '';
	}
}
