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
