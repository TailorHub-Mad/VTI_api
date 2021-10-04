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
	name: Joi.string(),
	'parent.name': Joi.string(),
	'notes.title': Joi.string(),
	'relatedTags.name': Joi.string(),
	ref: Joi.string()
});

export const filterTagProjectValidation = Joi.object().keys({
	name: Joi.string(),
	'parent.name': Joi.string(),
	'projects.alias': Joi.string(),
	'relatedTags.name': Joi.string(),
	ref: Joi.string()
});
