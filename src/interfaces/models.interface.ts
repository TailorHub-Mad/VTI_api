/* eslint-disable no-use-before-define */
import { Document, Model } from 'mongoose';

interface IDate {
	day: string;
	month: string;
	year: string;
}

interface IDepartment {
	name: string;
	users: IUserDocument['_id'][];
	ref: string;
}

interface IDocument {
	url: string;
	name: string;
	_id?: string;
}

export interface IDepartmentDocument extends IDepartment, Document {}

export type IDepartmentModel = Model<IDepartmentDocument>;

export const NOTIFICATION_STATUS = ['no read', 'read', 'disabled'] as const;

export type TNotificationStatus = typeof NOTIFICATION_STATUS[number];

export interface IUser {
	email: string;
	alias: string;
	name: string;
	lastName: string;
	isAdmin: boolean;
	department: IDepartmentDocument['_id'];
	projectsComments: IProjectsDocument['_id'][];
	focusPoint: IUserDocument['_id'][];
	favorites: {
		notes: [];
		projects: IProjectsDocument['_id'][];
	};
	subscribed: {
		notes: [];
		projects: IProjectsDocument['_id'][];
		testSystems: ITestSystemDocument['_id'][];
	};
	notifications: {
		status: TNotificationStatus;
		notification: INotificationDocument['_id'];
		pin: boolean;
	}[];
	password: string;
	recovery: string[];
	ref: string;
}

export interface IUserDocument extends IUser, Document {
	validatePassword: (password: string) => boolean;
}

export type IUserModel = Model<IUserDocument>;

export interface ITestSystem {
	vtiCode: string;
	date: IDate;
	projects: IProjectsDocument['_id'][];
	alias: string;
	notes: INoteDocument['id'][];
}

export interface ITestSystemDocument extends ITestSystem, Document {}

export type ITestSystemModel = Model<ITestSystemDocument>;

interface ISector {
	title: string;
	projects: IProjectsDocument['_id'][];
	ref: string;
}

export interface ISectorDocument extends ISector, Document {}

export type ISectorModel = Model<ISectorDocument>;

export interface IProjects {
	alias: string;
	date: IDate;
	client: IClientDocument['_id'];
	sector: ISectorDocument['_id'];
	focusPoint: IUserDocument['_id'][];
	testSystems: ITestSystemDocument['_id'][];
	tags: [];
	notes: [];
	closed: IDate;
	ref: string;
}

export interface IProjectsDocument extends IProjects, Document {
	title?: string; // to resolve error.
}

export type IProjectsModel = Model<IProjectsDocument>;

export interface IClient {
	alias: string;
	name: string;
	testSystems: ITestSystemDocument['_id'][];
	projects: IProjectsDocument['_id'][];
	notes: INoteDocument['_id'][];
	ref: string;
}

export interface IClientDocument extends IClient, Document {}

export type IClientModel = Model<IClientDocument>;

export interface INote {
	title: string;
	description: string;
	link: string;
	documents: IDocument[];
	testSystems: ITestSystemDocument['_id'][];
	project: IProjectsDocument['_id'];
	tags: ITagDocument['_id'][];
	updateLimitDate: Date;
	updateTime: Date;
	owner: IUserDocument['_id'];
	readBy: IUserDocument['_id'][];
	messages: IMessageDocument['_id'][];
	approved: boolean;
	formalized: boolean;
	ref: string;
}

export interface INoteDocument extends INote, Document {}

export type INoteModel = Model<INoteDocument>;

export interface IMessage {
	owner: IUserDocument['_id'];
	approved: boolean;
	formalized: boolean;
	link: string;
	documents: IDocument[];
	message: string;
}

export interface IMessageDocument extends IMessage, Document {}

export type IMessageModel = Model<IMessageDocument>;

export interface ITag {
	name: string;
	updated: IDate;
	projects: IProjectsDocument['_id'][];
	relatedTags: ITagDocument['_id'][];
	index: number;
	ref: string;
}

export interface ITagDocument extends ITag, Document {}

export interface ITagNoteDocument extends ITag, Document {
	type: 'note';
	// notes: INoteDocument['_id'][];
}
export interface ITagProjectDocument extends ITag, Document {
	type: 'project';
	projects: IProjectsDocument['_id'][];
}

export type ITagModel = Model<ITagDocument>;

export type ITagNoteModel = Model<ITagNoteDocument>;

export type ITagProjectModel = Model<ITagProjectDocument>;

export type ITagBothDocument = ITagNoteDocument | ITagProjectDocument;

export type GenericModel<T> = Model<T, unknown, never>;

export type ITagBothModel = GenericModel<ITagNoteDocument> | GenericModel<ITagProjectDocument>;

export interface ICriterion {
	name: string;
	title: string;
	type: 'note' | 'project';
	relatedTags: ITagNoteDocument['_id'] | ITagProjectDocument['_id'];
	order: number;
}

export interface ICriterionNoteDocument extends ICriterion, Document {
	type: 'note';
	relatedTags: ITagNoteDocument['_id'];
}

export interface ICriterionProjectDocument extends ICriterion, Document {
	type: 'project';
	relatedTags: ITagProjectDocument['_id'];
}

export type ICriterionNoteModel = Model<ICriterionNoteDocument>;

export type ICriterionProjectModel = Model<ICriterionProjectDocument>;

export interface INotification {
	description: string;
	owner: string;
	urls: {
		label: string;
		model: string;
		id: string;
	}[];
	deleteTime: boolean;
	type: string;
	pin: boolean;
}

export interface INotificationDocument extends INotification, Document {}

export type INotificationModel = Model<INotificationDocument>;

export interface IVtiCode {
	name: string;
	testSystems: ITestSystemDocument['_id'];
	ref: string;
}

export interface IVtiCodeDocument extends IVtiCode, Document {}

export type IVtiCodeModel = Model<IVtiCodeDocument>;

export interface IFilter {
	name: string;
	type: string;
	query: string;
	public: boolean;
	object: string;
}

export interface IFilterDocument extends IFilter, Document {}

export type IFilterModel = Model<IFilterDocument>;
export interface IReqUser {
	id: string;
	email: string;
	role: string;
}
