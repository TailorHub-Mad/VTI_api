import { Types } from 'mongoose';
import { RefsEnum } from 'src/enums/client.enum';
import { GenericModel } from 'src/interfaces/models.interface';
import { findLastField } from 'src/repositories/client.repository';

export const transformStringToObjectId = (id: string): Types.ObjectId => {
	return Types.ObjectId(id);
};

export const createSet = (
	body: { [key: string]: unknown },
	field: string
): {
	[key: string]: unknown;
} => {
	return Object.entries(body).reduce((set, [property, value]) => {
		set[`${field}.${property}`] = value;
		return set;
	}, {} as { [key: string]: unknown });
};

export const createRef = async <T extends { ref: string }>(
	field: 'notes' | 'projects' | 'testSystems'
): Promise<string> => {
	const lastField = await findLastField<T>(field);
	let newRef;
	if (lastField.ref) {
		const lastNumber = +lastField.ref.slice(2);
		newRef = `${RefsEnum[field]}${(lastNumber + 1).toString().padStart(4, '0')}`;
	} else {
		newRef = `${RefsEnum[field]}0001`;
	}
	return newRef;
};

/*
Note -> AP
Project -> PR
TestSytem -> SE
 */
