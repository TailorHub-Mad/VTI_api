import { model, Schema } from 'mongoose';
import { IClientDocument, IClientModel } from '../interfaces/models.interface';
import { projectSchema } from './project.model';
import { testSystemSchema } from './test_system.model';

const clientSchema = new Schema<IClientDocument, IClientModel>(
	{
		alias: { type: String, unique: true, required: true, index: true },
		name: { type: String },
		testSystem: [testSystemSchema],
		projects: [projectSchema]
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
clientSchema.index({
	alias: 'text',
	'testSystem.vtiCode': 'text',
	'testSystem.alias': 'text'
});
export const ClientModel = model('Client', clientSchema);
