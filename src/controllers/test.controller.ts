import { Request, Response, NextFunction } from 'express';
import { aggregateCrud } from '../repositories/aggregate.repository';
import { searchModelCarCahce } from '../services/test.service';

export const FindModelCarTest = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const allSoftwareEngineers = [
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 }
		];
		const { offset = 0, limit = 0 } = req.query;
		const results2 = allSoftwareEngineers.reduce((result, engineer) => {
			const { salary } = engineer;
			if (salary > 100000) {
				result += salary;
			}
			return result;
		}, 0);
		// const models = await aggregateCrud(req.body, { offset: +offset, limit: +limit });
		res.json(results2);
	} catch (err) {
		next(err);
	}
};

export const FindModelCarTestCache = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const allSoftwareEngineers = [
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 },
			{ salary: 123344 }
		];
		let results = 0;
		for (const engineer of allSoftwareEngineers) {
			// Check if salary is above 100000
			if (engineer.salary > 100000) results += engineer.salary;
		}
		// const models = await searchModelCarCahce(req.body);
		res.json(results);
	} catch (err) {
		next(err);
	}
};
