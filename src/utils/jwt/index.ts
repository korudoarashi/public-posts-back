import jwt from 'jsonwebtoken';

const SECRET = process.env.SECRET || '';

export const sign = (payload: object, options: jwt.SignOptions = {}): string => {
	return jwt.sign(payload, SECRET, options);
};

export const verify = (token: string): jwt.JwtPayload | null => {
	try {
		const payload = jwt.verify(token, SECRET) as jwt.JwtPayload;
		return payload;
	} catch {
		return null;
	}
};
