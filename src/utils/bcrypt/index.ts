import { genSaltSync, hashSync, compareSync } from 'bcrypt';

export const hash = (data: string, saltRounds: number = 10): string => {
	return hashSync(data, genSaltSync(saltRounds));
};

export const compare = (data: string, hash: string): boolean => {
	return compareSync(data, hash);
};
