import { IsAlphanumeric, Length } from 'class-validator';

export class User {
	@IsAlphanumeric('en-US')
	@Length(4, 20)
	username: string

	@IsAlphanumeric('en-US')
	@Length(6, 20)
	password: string
}
