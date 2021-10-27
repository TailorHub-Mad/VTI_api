import { BaseError } from '@errors/base.error';
import { encryptPassword } from '@utils/model.utils';
import { randomBytes } from 'crypto';
import { Types } from 'mongoose';
import { sendMail } from '../config/nodemailer.config';
import { IReqUser, IUserDocument } from '../interfaces/models.interface';
import { UserModel } from '../models/user.model';
import { updateRepository } from '../repositories/common.repository';
import { recoveryValidation, resetPasswordValidation } from '../validations/user.validation';
import QueryString from 'qs';
import { userFilterAggregate } from '../repositories/user.repository';

export const resetPassword = async (
	body: { email: string },
	isRecovery: boolean
): Promise<void> => {
	// if (!/(@vtisl.com)$/.test(body.email)) {
	// 	throw new BaseError('Not email valid', 400);
	// }
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

export const filterUser = async (query: QueryString.ParsedQs): Promise<IUserDocument[]> => {
	const users = await userFilterAggregate(query);
	return users;
};

export const getFavoriteProjects = async (user: IReqUser): Promise<unknown> => {
	const projects = await UserModel.aggregate([
		{
			$match: {
				_id: Types.ObjectId(user.id)
			}
		},
		{
			$unwind: { path: '$favorites.projects' }
		},
		{
			$lookup: {
				from: 'clients',
				let: {
					projects: '$favorites.projects'
				},
				pipeline: [
					{ $unwind: '$projects' },
					{
						$match: {
							$expr: {
								$eq: ['$projects._id', '$$projects']
							}
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
						$lookup: {
							from: 'tagprojects',
							localField: 'projects.tags',
							foreignField: '_id',
							as: 'projects.tags'
						}
					},
					{
						$addFields: {
							'projects.testSystems': {
								$filter: {
									input: '$notes',
									as: 'note',
									cond: {
										$eq: ['$projects.notes', '$$note._id']
									}
								}
							}
						}
					},
					{
						$addFields: {
							'projects.notes': {
								$filter: {
									input: '$notes',
									as: 'note',
									cond: {
										$in: ['$$note._id', '$projects.notes']
									}
								}
							},
							'projects.testSystems': {
								$filter: {
									input: '$notes',
									as: 'note',
									cond: {
										$in: ['$$note._id', '$projects.testSystems']
									}
								}
							}
						}
					},
					{
						$replaceRoot: {
							newRoot: { $mergeObjects: ['$projects'] }
						}
					}
				],
				as: 'projects'
			}
		},
		{
			$project: {
				projects: 1,
				_id: 0
			}
		},
		{
			$unwind: {
				path: '$projects'
			}
		},
		{
			$group: {
				_id: null,
				projects: {
					$push: '$projects'
				}
			}
		}
	]);
	return projects;
};

export const getSubscribersProjects = async (user: IReqUser): Promise<unknown> => {
	const projects = await UserModel.aggregate([
		{
			$match: {
				_id: Types.ObjectId(user.id)
			}
		},
		{
			$unwind: { path: '$subscribed.projects' }
		},
		{
			$lookup: {
				from: 'clients',
				let: {
					projects: '$subscribed.projects'
				},
				pipeline: [
					{ $unwind: '$projects' },
					{
						$match: {
							$expr: {
								$eq: ['$projects._id', '$$projects']
							}
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
						$lookup: {
							from: 'tagprojects',
							localField: 'projects.tags',
							foreignField: '_id',
							as: 'projects.tags'
						}
					},
					{
						$addFields: {
							'projects.testSystems': {
								$filter: {
									input: '$notes',
									as: 'note',
									cond: {
										$eq: ['$projects.notes', '$$note._id']
									}
								}
							}
						}
					},
					{
						$addFields: {
							'projects.notes': {
								$filter: {
									input: '$notes',
									as: 'note',
									cond: {
										$in: ['$$note._id', '$projects.notes']
									}
								}
							},
							'projects.testSystems': {
								$filter: {
									input: '$notes',
									as: 'note',
									cond: {
										$in: ['$$note._id', '$projects.testSystems']
									}
								}
							}
						}
					},
					{
						$replaceRoot: {
							newRoot: { $mergeObjects: ['$projects'] }
						}
					}
				],
				as: 'projects'
			}
		},
		{
			$project: {
				projects: 1,
				_id: 0
			}
		},
		{
			$unwind: {
				path: '$projects'
			}
		},
		{
			$group: {
				_id: null,
				projects: {
					$push: '$projects'
				}
			}
		}
	]);
	return projects;
};

export const getFavoriteNotes = async (user: IReqUser): Promise<unknown> => {
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
export const getSubscribersNotes = async (user: IReqUser): Promise<unknown> => {
	const notes = await UserModel.aggregate([
		{
			$match: {
				_id: Types.ObjectId(user.id)
			}
		},
		{
			$unwind: { path: '$subscribed.notes', preserveNullAndEmptyArrays: true }
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
			$unwind: { path: '$subscribed.projects', preserveNullAndEmptyArrays: true }
		},
		{
			$lookup: {
				from: 'clients',
				let: {
					projects: '$subscribed.projects'
				},
				pipeline: [
					{ $unwind: '$projects' },
					{
						$match: {
							$expr: {
								$eq: ['$projects._id', '$$projects']
							}
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
						$unwind: {
							path: '$notes'
						}
					},
					// {
					// 	$match: {
					// 		$expr: {
					// 			$in: ['$notes._id', '$projects.notes']
					// 		}
					// 	}
					// },
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
							'notes.projects': ['$projects'],
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
				as: 'projectNotes'
			}
		},
		{
			$unwind: { path: '$subscribed.testSystems', preserveNullAndEmptyArrays: true }
		},
		{
			$lookup: {
				from: 'clients',
				let: {
					testSystems: '$subscribed.testSystems'
				},
				pipeline: [
					{ $unwind: '$testSystems' },
					{
						$match: {
							$expr: {
								$eq: ['$testSystems._id', '$$testSystems']
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
					// {
					// 	$match: {
					// 		$expr: {
					// 			$in: ['$notes._id', '$testSystems.notes']
					// 		}
					// 	}
					// },
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
							'notes.testSystems': ['$testSystems'],
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
				as: 'testSystemsNotes'
			}
		},
		{
			$project: {
				notes: { $concatArrays: ['$notes', '$projectNotes', '$testSystemsNotes'] },
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
				_id: '$notes._id',
				notes: {
					$push: '$notes'
				}
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
export const getActiveNote = async (user: IReqUser): Promise<unknown> => {
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
								$eq: ['$notes.isClosed', false]
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
								$not: { $in: ['$$user', '$notes.readBy'] }
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
