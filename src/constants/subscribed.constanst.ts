/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const SUBSCRIBED_PROJECT_POPULATE = (query: string) => [
	{
		$unwind: {
			path: '$subscribed.projects',
			preserveNullAndEmptyArrays: true
		}
	},
	{
		$lookup: {
			from: 'clients',
			let: {
				projectId: '$subscribed.projects'
			},
			pipeline: [
				{
					$unwind: '$projects'
				},
				{
					$match: {
						$expr: {
							$eq: ['$projects._id', '$$projectId']
						}
					}
				},
				{
					$match: query ? { 'projects.alias': { $regex: `${query}`, $options: 'i' } } : {}
				},
				{
					$addFields: {
						[`projects.notes`]: {
							$filter: {
								input: `$notes`,
								as: 'populate',
								cond: {
									$in: ['$$populate._id', `$projects.notes`]
								}
							}
						}
					}
				},
				{
					$addFields: {
						'projects.isActive': {
							$cond: {
								if: '$projects.closed',
								then: false,
								else: true
							}
						}
					}
				},
				{
					$replaceRoot: {
						newRoot: {
							$mergeObjects: ['$projects']
						}
					}
				}
			],
			as: 'subscribed.projects'
		}
	},
	{
		$addFields: {
			'subscribed.projects': {
				$arrayElemAt: ['$subscribed.projects', 0]
			}
		}
	},
	{
		$group: {
			_id: '$_id',
			subscribed: {
				$push: '$subscribed.projects'
			},
			user: { $first: '$$ROOT' }
		}
	},
	{
		$replaceRoot: {
			newRoot: {
				$mergeObjects: ['$user', { projects: '$subscribed' }]
			}
		}
	},
	{
		$addFields: {
			'subscribed.projects': '$projects'
		}
	},
	{
		$project: {
			projects: 0
		}
	}
];
export const SUBSCRIBED_PROJECT = [
	{
		$unwind: {
			path: '$subscribed.projects',
			preserveNullAndEmptyArrays: true
		}
	},
	{
		$lookup: {
			from: 'clients',
			let: {
				projectId: '$subscribed.projects'
			},
			pipeline: [
				{
					$unwind: '$projects'
				},
				{
					$match: {
						$expr: {
							$eq: ['$projects._id', '$$projectId']
						}
					}
				},
				{
					$replaceRoot: {
						newRoot: {
							$mergeObjects: ['$projects']
						}
					}
				},
				{
					$project: {
						alias: 1
					}
				}
			],
			as: 'subscribed.projects'
		}
	},
	{
		$addFields: {
			'subscribed.projects': {
				$arrayElemAt: ['$subscribed.projects', 0]
			}
		}
	},
	{
		$group: {
			_id: '$_id',
			subscribed: {
				$push: '$subscribed.projects'
			},
			user: { $first: '$$ROOT' }
		}
	},
	{
		$replaceRoot: {
			newRoot: {
				$mergeObjects: ['$user', { projects: '$subscribed' }]
			}
		}
	},
	{
		$addFields: {
			'subscribed.projects': '$projects'
		}
	},
	{
		$project: {
			projects: 0
		}
	}
];
export const SUBSCRIBED_TESTSYSTEM_POPULATE = (query: string) => [
	{
		$unwind: {
			path: '$subscribed.testSystems',
			preserveNullAndEmptyArrays: true
		}
	},
	{
		$lookup: {
			from: 'clients',
			let: {
				projectId: '$subscribed.testSystems'
			},
			pipeline: [
				{
					$unwind: '$testSystems'
				},
				{
					$match: {
						$expr: {
							$eq: ['$testSystems._id', '$$projectId']
						}
					}
				},
				{
					$match: query ? { 'testSystems.alias': { $regex: `${query}`, $options: 'i' } } : {}
				},
				{
					$addFields: {
						[`testSystems.notes`]: {
							$filter: {
								input: `$notes`,
								as: 'populate',
								cond: {
									$in: ['$$populate._id', `$testSystems.notes`]
								}
							}
						}
					}
				},
				{
					$replaceRoot: {
						newRoot: {
							$mergeObjects: ['$testSystems']
						}
					}
				}
			],
			as: 'subscribed.testSystems'
		}
	},
	{
		$addFields: {
			'subscribed.testSystems': {
				$arrayElemAt: ['$subscribed.testSystems', 0]
			}
		}
	},
	{
		$group: {
			_id: '$_id',
			subscribed: {
				$push: '$subscribed.testSystems'
			},
			user: { $first: '$$ROOT' }
		}
	},
	{
		$replaceRoot: {
			newRoot: {
				$mergeObjects: ['$user', { testSystems: '$subscribed' }]
			}
		}
	},
	{
		$addFields: {
			'subscribed.testSystems': '$testSystems'
		}
	},
	{
		$project: {
			testSystems: 0
		}
	}
];
export const SUBSCRIBED_TESTSYSTEM = [
	{
		$unwind: {
			path: '$subscribed.testSystems',
			preserveNullAndEmptyArrays: true
		}
	},
	{
		$lookup: {
			from: 'clients',
			let: {
				projectId: '$subscribed.testSystems'
			},
			pipeline: [
				{
					$unwind: '$testSystems'
				},
				{
					$match: {
						$expr: {
							$eq: ['$testSystems._id', '$$projectId']
						}
					}
				},
				{
					$replaceRoot: {
						newRoot: {
							$mergeObjects: ['$testSystems']
						}
					}
				},
				{
					$project: {
						alias: 1
					}
				}
			],
			as: 'subscribed.testSystems'
		}
	},
	{
		$addFields: {
			'subscribed.testSystems': {
				$arrayElemAt: ['$subscribed.testSystems', 0]
			}
		}
	},
	{
		$group: {
			_id: '$_id',
			subscribed: {
				$push: '$subscribed.testSystems'
			},
			user: { $first: '$$ROOT' }
		}
	},
	{
		$replaceRoot: {
			newRoot: {
				$mergeObjects: ['$user', { testSystems: '$subscribed' }]
			}
		}
	},
	{
		$addFields: {
			'subscribed.testSystems': '$testSystems'
		}
	},
	{
		$project: {
			testSystems: 0
		}
	}
];
export const SUBSCRIBED_NOTE_POPULATE = (query: string) => [
	{
		$unwind: {
			path: '$subscribed.notes',
			preserveNullAndEmptyArrays: true
		}
	},
	{
		$lookup: {
			from: 'clients',
			let: {
				projectId: '$subscribed.notes'
			},
			pipeline: [
				{
					$unwind: '$notes'
				},
				{
					$match: {
						$expr: {
							$eq: ['$notes._id', '$$projectId']
						}
					}
				},
				{
					$match: query ? { 'notes.title': { $regex: `${query}`, $options: 'i' } } : {}
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
						'notes.isAnswered': {
							$cond: {
								if: {
									$size: ['$notes.messages']
								},
								then: true,
								else: false
							}
						}
					}
				},
				{
					$replaceRoot: {
						newRoot: {
							$mergeObjects: ['$notes']
						}
					}
				}
			],
			as: 'subscribed.notes'
		}
	},
	{
		$addFields: {
			'subscribed.notes': {
				$arrayElemAt: ['$subscribed.notes', 0]
			}
		}
	},
	{
		$group: {
			_id: '$_id',
			subscribed: {
				$push: '$subscribed.notes'
			},
			user: { $first: '$$ROOT' }
		}
	},
	{
		$replaceRoot: {
			newRoot: {
				$mergeObjects: ['$user', { notes: '$subscribed' }]
			}
		}
	},
	{
		$addFields: {
			'subscribed.notes': '$notes'
		}
	},
	{
		$project: {
			notes: 0
		}
	}
];
export const SUBSCRIBED_NOTE = [
	{
		$unwind: {
			path: '$subscribed.notes',
			preserveNullAndEmptyArrays: true
		}
	},
	{
		$lookup: {
			from: 'clients',
			let: {
				projectId: '$subscribed.notes'
			},
			pipeline: [
				{
					$unwind: '$notes'
				},
				{
					$match: {
						$expr: {
							$eq: ['$notes._id', '$$projectId']
						}
					}
				},
				{
					$replaceRoot: {
						newRoot: {
							$mergeObjects: ['$notes']
						}
					}
				},
				{
					$project: {
						title: 1
					}
				}
			],
			as: 'subscribed.notes'
		}
	},
	{
		$addFields: {
			'subscribed.notes': {
				$arrayElemAt: ['$subscribed.notes', 0]
			}
		}
	},
	{
		$group: {
			_id: '$_id',
			subscribed: {
				$push: '$subscribed.notes'
			},
			user: { $first: '$$ROOT' }
		}
	},
	{
		$replaceRoot: {
			newRoot: {
				$mergeObjects: ['$user', { notes: '$subscribed' }]
			}
		}
	},
	{
		$addFields: {
			'subscribed.notes': '$notes'
		}
	},
	{
		$project: {
			notes: 0
		}
	}
];
