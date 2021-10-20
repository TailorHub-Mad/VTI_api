import Joi from 'joi';
import { mongoIdValidation } from './common.validation';

export const newUserValidation = Joi.object().keys({
	email: Joi.string().email().required(),
	password: Joi.string().required(), // TODO: Create regExp
	alias: Joi.string().required(),
	name: Joi.string(),
	lastName: Joi.string(),
	department: mongoIdValidation.required()
});

export const loginUserValidation = Joi.object().keys({
	email: Joi.string().email().required(),
	password: Joi.string().required() // TODO: Create regExp
});

export const updateUserValidation = Joi.object().keys({
	alias: Joi.string(),
	name: Joi.string(),
	lastName: Joi.string(),
	favorites: Joi.object({
		notes: Joi.array().items(mongoIdValidation),
		projects: Joi.array().items(mongoIdValidation)
	}),
	subscribed: Joi.object({
		notes: Joi.array().items(mongoIdValidation),
		projects: Joi.array().items(mongoIdValidation),
		testSystems: Joi.array().items(mongoIdValidation),
		noteTags: Joi.array().items(mongoIdValidation),
		projectTags: Joi.array().items(mongoIdValidation)
	}),
	department: mongoIdValidation
});

export const recoveryValidation = Joi.object().keys({
	recovery: Joi.string(),
	password: Joi.string().required()
});

export const resetPasswordValidation = Joi.object().keys({
	email: Joi.string().email().required()
});

export const filterUserValidation = Joi.object().keys({
	email: Joi.string(),
	alias: Joi.string(),
	name: Joi.string(),
	lastName: Joi.string(),
	ref: Joi.string(),
	'department.name': Joi.string(),
	'department._id': Joi.string(),
	focusPoint: Joi.string(),
	projectsComments: Joi.string(),
	union: Joi.string()
});
