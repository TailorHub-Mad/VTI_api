import { HookNextFunction, model, Schema } from 'mongoose';
import { ISectorDocument, ISectorModel } from '../interfaces/models.interface';

const sectorSchema = new Schema<ISectorDocument, ISectorModel>(
	{
		title: { type: String, unique: true, required: true },
		projects: [{ type: String }],
		ref: { type: String }
	},
	{
		timestamps: true,
		versionKey: false
	}
);

sectorSchema.pre('save', async function (next: HookNextFunction) {
	try {
		if (this.isNew) {
			const [client] = await this.db
				.model<ISectorDocument>('Sector')
				.find()
				.sort({ ref: -1 })
				.collation({
					locale: 'es',
					numericOrdering: true
				})
				.limit(1);
			if (client?.ref) {
				this.ref = 'SCT' + (+client.ref.slice(2) + 1).toString().padStart(4, '0');
			} else {
				this.ref = 'SCT0001';
			}
		}
		next();
	} catch (err) {
		next(err);
	}
});

export const SectorModel = model('Sector', sectorSchema);
