import { HookNextFunction, model, Schema, Types } from 'mongoose';
import { IDepartmentDocument, IDepartmentModel } from '../interfaces/models.interface';

const departmentSchema = new Schema<IDepartmentDocument, IDepartmentModel>(
	{
		name: { type: String, unique: true, required: true },
		users: [{ type: Types.ObjectId, ref: 'User' }],
		ref: { type: String }
	},
	{
		timestamps: true,
		versionKey: false
	}
);

departmentSchema.pre('save', async function (next: HookNextFunction) {
	try {
		if (this.isNew) {
			const [client] = await this.db
				.model<IDepartmentDocument>('Department')
				.find()
				.sort({ ref: -1 })
				.collation({
					locale: 'es',
					numericOrdering: true
				})
				.limit(1);
			if (client?.ref) {
				this.ref = 'DPT' + (+client.ref.slice(2) + 1).toString().padStart(4, '0');
			} else {
				this.ref = 'DPT0001';
			}
		}
		next();
	} catch (err) {
		next(err);
	}
});

export const DepartmentModel = model('Department', departmentSchema);
