import { validate } from 'class-validator';
import { RequestHandler } from 'express';

interface Constructable<T> {
	new(...args: any) : T;
}

export enum RequireModelDataTarget {
	Body   = 'body',
	Params = 'params'
}

export type RequiresModelOptions = {
	dataTarget: RequireModelDataTarget
}

export const requiresModel = <T extends object>(modelClass: Constructable<T>, modelName: string, requiredFields: Partial<T>, options?: RequiresModelOptions) => {
	return (async (req, res, next) => {
		const model = new modelClass();

		const dataTarget = req[options?.dataTarget || RequireModelDataTarget.Body];

		for(const [key, defaulfValue] of Object.entries(requiredFields)) {
			if(!dataTarget[key] && defaulfValue == undefined)
				continue;
			model[key as keyof T] = dataTarget[key] || defaulfValue;
		}

		const errors = await validate(model);

		if(errors.length)
			return res.status(401).send(errors);

		res.locals[modelName] = model;

		next();
	}) as RequestHandler;
};
