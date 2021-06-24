import logger from '@log';
import { Document } from 'mongoose';
import BrandModel from '../models/brand.model';
import brandsJson from './boe_coches_final.json';

export default async (): Promise<Document[]> => {
	const nameModel = BrandModel.collection.name;
	logger.info(nameModel);
	await BrandModel.deleteMany({});
	logger.info(`Borrado de la base de datos ${nameModel}`);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const initialBrand: any = brandsJson;
	const modifyBrand = initialBrand.map(
		(car: {
			brand: string;
			_model: {
				modelo: string;
				periodo?: string | number[];
				cc: number;
				cilindros: number;
				xgd: string;
				pkw: string;
				cvf: number;
				cv: number;
				valor: number;
				type: string;
			}[];
		}) => {
			car._model = car._model.map((model) => {
				if (model.periodo) {
					model.periodo = (model.periodo as string).split('-').map((year) => +year);
				}
				let xgd = '';
				switch (model.xgd) {
					case 'D':
						xgd = 'diesel';
						break;
					case 'G':
						xgd = 'gas';
						break;
					case 'Elc':
						xgd = 'electric';
						break;
					case 'GyE':
						xgd = 'hybrid';
						break;
				}
				model.xgd = xgd;
				return model;
			});
			return car;
		}
	);
	const brans = await BrandModel.insertMany(modifyBrand);
	logger.info(`Creado de la base de datos ${nameModel}`);
	return brans;
};

/* car: {
	brand: string;
	_model: {
		modelo: string;
		periodo?: string | string[];
		cc: number;
		cilindros: number;
		xgd: string;
		pkw: string;
		cvf: number;
		cv: number;
		valor: number;
		type: string;
	};
}[] */
