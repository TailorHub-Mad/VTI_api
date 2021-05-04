import { model, Schema } from 'mongoose';

const brandSchema = new Schema(
	{
		brand: { type: String, unique: true, requiered: true, trim: true },
		_model: [
			{
				modelo: { type: String, trim: true, requiered: true },
				periodo: [{ type: Number, trim: true, requiered: true }],
				cc: { type: Number, requiered: true },
				cilindros: { type: Number, requiered: true },
				xgd: { type: String, trim: true, requiered: true },
				pkw: { type: String, trim: true, requiered: true },
				cvf: { type: Number, requiered: true },
				cv: { type: Number, requiered: true },
				valor: { type: Number, requiered: true },
				type: { type: String, trim: true, requiered: true }
			}
		]
	},
	{
		timestamps: true,
		versionKey: false,
		toJSON: {
			transform: (doc, ret) => {
				ret.id = doc._id;
				delete ret._id;
				return ret;
			}
		}
	}
);

const BrandModel = model('Brand', brandSchema);

export default BrandModel;
