import { IsBoolean, IsOptional, IsString, Length } from 'class-validator'

export class PostModel {
	@IsString()
	@IsOptional()
	id: string

	@Length(4, 25)
	@IsOptional()
	title: string

	@IsOptional()
	@Length(4, 1000)
	content: string

	@IsOptional()
	@IsBoolean()
	personal: boolean
}
