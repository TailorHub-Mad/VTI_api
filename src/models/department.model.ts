import { model, Schema, Types } from 'mongoose';
import { IDepartmentDocument, IDepartmentModel } from '../interfaces/models.interface';

const departmentSchema = new Schema<IDepartmentDocument, IDepartmentModel>(
	{
		name: { type: String, unique: true, required: true },
		users: [{ type: Types.ObjectId, ref: 'User' }]
	},
	{
		timestamps: true,
		versionKey: false
	}
);

export const DepartmentModel = model('Department', departmentSchema);
