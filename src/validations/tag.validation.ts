import Joi from 'joi';

export const createTagValidation = Joi.object().keys({
	name: Joi.string().required(),
	parent: Joi.string()
});

export const updateTagValidation = Joi.object().keys({
	name: Joi.string(),
	parent: Joi.string()
});

export const filterTagNoteValidation = Joi.object().keys({
	name: [Joi.string(), Joi.array()],
	'parent.name': [Joi.string(), Joi.array()],
	'notes.title': [Joi.string(), Joi.array()],
	'relatedTags.name': [Joi.string(), Joi.array()],
	ref: [Joi.string(), Joi.array()]
});

export const filterTagProjectValidation = Joi.object().keys({
	name: [Joi.string(), Joi.array()],
	'parent.name': [Joi.string(), Joi.array()],
	'projects.alias': [Joi.string(), Joi.array()],
	'relatedTags.name': [Joi.string(), Joi.array()],
	ref: [Joi.string(), Joi.array()]
});
