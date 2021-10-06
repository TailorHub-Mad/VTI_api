import { HookNextFunction, model, Schema } from 'mongoose';
import { IClientDocument, IClientModel } from '../interfaces/models.interface';
import { noteSchema } from './note.model';
import { projectSchema } from './project.model';
import { testSystemSchema } from './test_system.model';

const clientSchema = new Schema<IClientDocument, IClientModel>(
	{
		alias: { type: String, unique: true, required: true, index: true },
		name: { type: String },
		testSystems: [testSystemSchema],
		testSystem: [testSystemSchema],
		projects: [projectSchema],
		notes: [noteSchema],
		ref: { type: String }
	},
	{
		timestamps: true,
		versionKey: false
	}
);
clientSchema.index({
	alias: 'text',
	'testSystems.vtiCode': 'text',
	'testSystems.alias': 'text',
	'projects.alias': 'text',
	'notes.title': 'text'
});

clientSchema.pre('save', async function (next: HookNextFunction) {
	try {
		if (this.isNew) {
			const [client] = await this.db
				.model<IClientDocument>('Client')
				.find()
				.sort({ ref: -1 })
				.collation({
					locale: 'es',
					numericOrdering: true
				})
				.limit(1);
			if (client.ref) {
				this.ref = 'US' + (+client.ref.slice(2) + 1).toString().padStart(4, '0');
			} else {
				this.ref = 'US0001';
			}
		}
		next();
	} catch (err) {
		next(err);
	}
});

export const ClientModel = model('Client', clientSchema);
