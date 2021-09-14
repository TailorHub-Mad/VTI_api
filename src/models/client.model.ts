import { model, Schema } from 'mongoose';
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
		notes: [noteSchema]
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
export const ClientModel = model('Client', clientSchema);
