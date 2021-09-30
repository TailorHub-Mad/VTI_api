import { PATH_USER_MODEL } from '@constants/model.constants';
import { HookNextFunction, model, Schema, Types } from 'mongoose';
import { IUserDocument, IUserModel, NOTIFICATION_STATUS } from '../interfaces/models.interface';
import bcrypt from 'bcrypt';
import { encryptPassword } from '@utils/model.utils';

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
			notes: [{ type: Types.ObjectId }],
			projects: [{ type: Types.ObjectId }]
		},
		subscribed: {
			notes: [{ type: Types.ObjectId }],
			projects: [{ type: Types.ObjectId }],
			testSystems: [{ type: Types.ObjectId }]
		},
		notifications: {
			status: { type: String, enum: NOTIFICATION_STATUS, default: NOTIFICATION_STATUS[0] },
			notification: { type: Types.ObjectId, ref: '' }
		},
		recovery: [{ type: String }]
	},
	{
		timestamps: true,
		versionKey: false
	}
);

userSchema.pre('save', function (next: HookNextFunction) {
	if (this.isModified('password')) {
		try {
			this.password = encryptPassword(this.password);
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
