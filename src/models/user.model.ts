import { PATH_USER_MODEL } from '@constants/model.constants';
import { HookNextFunction, model, Schema, Types } from 'mongoose';
import { IUserDocument, IUserModel, NOTIFICATION_STATUS } from '../interfaces/models.interface';
import bcrypt from 'bcrypt';

const userSchema = new Schema<IUserDocument, IUserModel>(
	{
		email: { type: String, unique: true, trim: true, lowercase: true, required: true },
		alias: { type: String },
		name: { type: String },
		lastName: { type: String },
		isAdmin: { type: Boolean, default: false },
		password: { type: String, required: true, select: false },
		department: { type: Types.ObjectId, ref: 'Department' },
		projectsComments: [{ type: String }],
		focusPoint: [{ type: String }],
		favorites: {
			notes: [{ type: Types.ObjectId, ref: '' }],
			projects: [{ type: Types.ObjectId, ref: '' }]
		},
		subscribed: {
			notes: [{ type: Types.ObjectId, ref: '' }],
			projects: [{ type: Types.ObjectId, ref: '' }],
			testSystems: [{ type: Types.ObjectId, ref: '' }]
		},
		notifications: {
			status: { type: String, enum: NOTIFICATION_STATUS, default: NOTIFICATION_STATUS[0] },
			notification: { type: Types.ObjectId, ref: '' }
		}
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

userSchema.pre('save', function (next: HookNextFunction) {
	if (this.isModified('password')) {
		try {
			this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8)); // ToDo: Pass to globlal env.
		} catch (err) {
			return next(err);
		}
	}
	next();
});

userSchema.methods.validatePassword = function (password: string) {
	return bcrypt.compareSync(password, this.password);
};

export const UserModel = model(PATH_USER_MODEL, userSchema);
