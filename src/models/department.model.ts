import { model, Schema, Types } from 'mongoose';
import { IDepartamentDocument, IDepartamentModel } from '../interfaces/models.interface';

const departmentSchema = new Schema<IDepartamentDocument, IDepartamentModel>(
	{
		name: { type: String, unique: true, required: true },
		users: [{ type: Types.ObjectId, ref: 'User' }]
	},
	{
		timestamps: true,
		versionKey: false,
		toJSON: {
			transform: function (doc, ret) {
				ret.id = doc._id;
				delete ret._id;
			}
		},
		toObject: {
			transform: function (doc, ret) {
				ret.id = doc._id;
				delete ret._id;
			}
		}
	}
);

export const DepartmentModel = model('Department', departmentSchema);
