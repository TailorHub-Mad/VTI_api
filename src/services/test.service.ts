import { Document } from 'mongoose';
import cacheLoader from '../loaders/cache.loader';
import BrandModel from '../models/brand.model';

export const searchModelCarCahce = async ({
	brand,
	year,
	fuel
}: {
	brand: string;
	year: number;
	fuel: string;
}): Promise<Document[]> => {
	let model = cacheLoader.get<Document[]>(`${brand}.${fuel}.${year}`);
	if (!model) {
		const currentYear = new Date().getFullYear();
		model = await BrandModel.aggregate([
			{
				$match: {
					brand
				}
			},
			{
				$project: {
					_model: {
						$filter: {
							input: '$_model',
							as: 'model',
							cond: {
								$and: [
									{ $eq: ['$$model.xgd', fuel] },
									{ $gte: [{ $arrayElemAt: ['$$model.periodo', 0] }, year] },
									{
										$or: [
											{ $eq: [{ $arrayElemAt: ['$$model.periodo', -1] }, 0] },
											{ $lte: [currentYear, { $arrayElemAt: ['$$model.periodo', -1] }] }
										]
									}
								]
							}
						}
					}
				}
			},
			{
				$project: {
					_id: 0,
					models: '$_model.modelo'
				}
			}
		]);
		cacheLoader.set(`${brand}.${fuel}.${year}`, model);
	}
	return model;
};

export const searchModelCar = async ({
	brand,
	year,
	fuel
}: {
	brand: string;
	year: number;
	fuel: string;
}): Promise<Document[]> => {
	const currentYear = new Date().getFullYear();
	return await BrandModel.aggregate([
		{
			$match: {
				brand
			}
		},
		{
			$project: {
				_model: {
					$filter: {
						input: '$_model',
						as: 'model',
						cond: {
							$and: [
								{ $eq: ['$$model.xgd', fuel] },
								{ $gte: [{ $arrayElemAt: ['$$model.periodo', 0] }, year] },
								{
									$or: [
										{ $eq: [{ $arrayElemAt: ['$$model.periodo', -1] }, 0] },
										{ $lte: [currentYear, { $arrayElemAt: ['$$model.periodo', -1] }] }
									]
								}
							]
						}
					}
				}
			}
		},
		{
			$project: {
				_id: 0,
				models: '$_model.modelo'
			}
		}
	]);
};
