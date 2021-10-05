import { BaseError } from '@errors/base.error';
import { encryptPassword } from '@utils/model.utils';
import { randomBytes } from 'crypto';
import { Types } from 'mongoose';
import { sendMail } from '../config/nodemailer.config';
import { INoteDocument, IReqUser, IUserDocument } from '../interfaces/models.interface';
import { UserModel } from '../models/user.model';
import { updateRepository } from '../repositories/common.repository';
import { recoveryValidation, resetPasswordValidation } from '../validations/user.validation';

export const resetPassword = async (
	body: { email: string },
	isRecovery: boolean
): Promise<void> => {
	const validateEmail = await resetPasswordValidation.validateAsync(body);
	const recovery = randomBytes(64).toString('hex');
	const user = updateRepository<IUserDocument>(
		UserModel,
		{ email: validateEmail.email },
		{
			$push: { recovery }
		}
	);

	if (!user) throw new BaseError('Not found user', 400);
	const url = `${process.env.FRONT_URL}/${
		isRecovery ? 'recuperar-acceso' : 'crear-acceso'
	}/${recovery}`;
	await sendMail({
		to: validateEmail.email,
		subject: 'Recovery',
		html: `<a href=${url}>RECOVERY</a>`
	});
};

export const recovery = async (body: { password: string; recovery: string }): Promise<void> => {
	const validateRecovery = await recoveryValidation.validateAsync(body);

	await updateRepository<IUserDocument>(
		UserModel,
		{
			recovery: { $in: [validateRecovery.recovery] }
		},
		{
			$pull: { recovery: validateRecovery.recovery },
			password: encryptPassword(validateRecovery.password)
		}
	);
};

export const getFavorite = async (user: IReqUser): Promise<any> => {
	const notes = await UserModel.aggregate([
		{
			$match: {
				_id: Types.ObjectId(user.id)
			}
		},
		{
			$unwind: { path: '$favorites.notes' }
		},
		{
			$lookup: {
				from: 'clients',
				let: {
					note: '$favorites.notes'
				},
				pipeline: [
					{ $unwind: '$notes' },
					{
						$match: {
							$expr: {
								$eq: ['$notes._id', '$$note']
							}
						}
					},
					{
						$unwind: {
							path: '$projects',
							preserveNullAndEmptyArrays: true
						}
					},
					{
						$lookup: {
							from: 'sectors',
							localField: 'projects.sector',
							foreignField: '_id',
							as: 'projects.sector'
						}
					},
					{
						$group: {
							_id: '$_id',
							client: {
								$first: '$$ROOT'
							},
							projects: {
								$push: '$projects'
							}
						}
					},
					{
						$replaceRoot: {
							newRoot: { $mergeObjects: ['$client', { projects: '$projects' }] }
						}
					},
					{
						$unwind: {
							path: '$notes'
						}
					},
					{
						$lookup: {
							from: 'tagnotes',
							localField: 'notes.tags',
							foreignField: '_id',
							as: 'notes.tags'
						}
					},
					{
						$addFields: {
							'notes.projects': {
								$filter: {
									input: '$projects',
									as: 'project',
									cond: {
										$in: ['$notes._id', '$$project.notes']
									}
								}
							},
							'notes.testSystems': {
								$filter: {
									input: '$testSystems',
									as: 'testSystem',
									cond: {
										$in: ['$notes._id', '$$testSystem.notes']
									}
								}
							},
							'notes.year': {
								$dateToString: {
									date: '$notes.createdAt',
									format: '%Y'
								}
							}
						}
					},
					{
						$replaceRoot: {
							newRoot: { $mergeObjects: ['$notes'] }
						}
					}
				],
				as: 'notes'
			}
		},
		{
			$project: {
				notes: 1,
				_id: 0
			}
		},
		{
			$unwind: {
				path: '$notes'
			}
		},
		{
			$group: {
				_id: null,
				notes: {
					$push: '$notes'
				}
			}
		}
	]);
	return notes;
};
export const getSubscribers = async (user: IReqUser): Promise<any> => {
	const notes = await UserModel.aggregate([
		{
			$match: {
				_id: Types.ObjectId(user.id)
			}
		},
		{
			$unwind: { path: '$subscribed.notes' }
		},
		{
			$lookup: {
				from: 'clients',
				let: {
					note: '$subscribed.notes'
				},
				pipeline: [
					{ $unwind: '$notes' },
					{
						$match: {
							$expr: {
								$eq: ['$notes._id', '$$note']
							}
						}
					},
					{
						$unwind: {
							path: '$projects',
							preserveNullAndEmptyArrays: true
						}
					},
					{
						$lookup: {
							from: 'sectors',
							localField: 'projects.sector',
							foreignField: '_id',
							as: 'projects.sector'
						}
					},
					{
						$group: {
							_id: '$_id',
							client: {
								$first: '$$ROOT'
							},
							projects: {
								$push: '$projects'
							}
						}
					},
					{
						$replaceRoot: {
							newRoot: { $mergeObjects: ['$client', { projects: '$projects' }] }
						}
					},
					{
						$unwind: {
							path: '$notes'
						}
					},
					{
						$lookup: {
							from: 'tagnotes',
							localField: 'notes.tags',
							foreignField: '_id',
							as: 'notes.tags'
						}
					},
					{
						$addFields: {
							'notes.projects': {
								$filter: {
									input: '$projects',
									as: 'project',
									cond: {
										$in: ['$notes._id', '$$project.notes']
									}
								}
							},
							'notes.testSystems': {
								$filter: {
									input: '$testSystems',
									as: 'testSystem',
									cond: {
										$in: ['$notes._id', '$$testSystem.notes']
									}
								}
							},
							'notes.year': {
								$dateToString: {
									date: '$notes.createdAt',
									format: '%Y'
								}
							}
						}
					},
					{
						$group: {
							_id: null,
							notes: {
								$push: '$notes'
							}
						}
					},
					{
						$replaceRoot: {
							newRoot: { $mergeObjects: ['$notes'] }
						}
					}
				],
				as: 'notes'
			}
		},
		{
			$project: {
				notes: 1,
				_id: 0
			}
		},
		{
			$unwind: {
				path: '$notes'
			}
		},
		{
			$group: {
				_id: null,
				notes: {
					$push: '$notes'
				}
			}
		}
	]);
	return notes;
};
export const getNotRead = async (user: IReqUser): Promise<any> => {
	const notes = await UserModel.aggregate([
		{
			$match: {
				_id: Types.ObjectId(user.id)
			}
		},
		{
			$lookup: {
				from: 'clients',
				let: {
					user: '$_id'
				},
				pipeline: [
					{ $unwind: '$notes' },
					{
						$match: {
							$expr: {
								$in: ['$$user', '$notes.readBy']
							}
						}
					},
					{
						$unwind: {
							path: '$projects',
							preserveNullAndEmptyArrays: true
						}
					},
					{
						$lookup: {
							from: 'sectors',
							localField: 'projects.sector',
							foreignField: '_id',
							as: 'projects.sector'
						}
					},
					{
						$group: {
							_id: '$_id',
							client: {
								$first: '$$ROOT'
							},
							projects: {
								$push: '$projects'
							}
						}
					},
					{
						$replaceRoot: {
							newRoot: { $mergeObjects: ['$client', { projects: '$projects' }] }
						}
					},
					{
						$unwind: {
							path: '$notes'
						}
					},
					{
						$lookup: {
							from: 'tagnotes',
							localField: 'notes.tags',
							foreignField: '_id',
							as: 'notes.tags'
						}
					},
					{
						$addFields: {
							'notes.projects': {
								$filter: {
									input: '$projects',
									as: 'project',
									cond: {
										$in: ['$notes._id', '$$project.notes']
									}
								}
							},
							'notes.testSystems': {
								$filter: {
									input: '$testSystems',
									as: 'testSystem',
									cond: {
										$in: ['$notes._id', '$$testSystem.notes']
									}
								}
							},
							'notes.year': {
								$dateToString: {
									date: '$notes.createdAt',
									format: '%Y'
								}
							}
						}
					},
					{
						$replaceRoot: {
							newRoot: { $mergeObjects: ['$notes'] }
						}
					}
				],
				as: 'notes'
			}
		},
		{
			$project: {
				notes: 1,
				_id: 0
			}
		},
		{
			$unwind: {
				path: '$notes'
			}
		},
		{
			$group: {
				_id: null,
				notes: {
					$push: '$notes'
				}
			}
		}
	]);
	return notes;
};
