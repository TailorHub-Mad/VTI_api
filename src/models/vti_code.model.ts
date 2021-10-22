import { HookNextFunction, model, Schema, Types } from 'mongoose';
import { IVtiCodeDocument, IVtiCodeModel } from '../interfaces/models.interface';

const vtiCodeSchema = new Schema<IVtiCodeDocument, IVtiCodeModel>(
	{
		name: { type: String, unique: true },
		testSystems: [{ type: Types.ObjectId, ref: 'client' }],
		ref: { type: String }
	},
	{
		timestamps: true,
		versionKey: false
	}
);

vtiCodeSchema.pre('save', async function (next: HookNextFunction) {
	try {
		if (this.isNew) {
			const [client] = await this.db
				.model<IVtiCodeDocument>('VtiCode')
				.find()
				.sort({ ref: -1 })
				.collation({
					locale: 'es',
					numericOrdering: true
				})
				.limit(1);
			if (client?.ref) {
				this.ref = 'VTI' + (+client.ref.slice(3) + 1).toString().padStart(4, '0');
			} else {
				this.ref = 'VTI0001';
			}
		}
		next();
	} catch (err) {
		next(err);
	}
});

export const VtiCodeModel = model('VtiCode', vtiCodeSchema);
