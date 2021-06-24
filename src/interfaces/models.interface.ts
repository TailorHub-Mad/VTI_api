/* eslint-disable no-use-before-define */
import { Document, Model } from 'mongoose';

interface IDate {
	day: string;
	month: string;
	year: string;
}

interface IDepartament {
	name: string;
	users: IUserDocument['_id'][];
}

interface IDocument {
	url: string;
	name: string;
}

export interface IDepartamentDocument extends IDepartament, Document {}

export type IDepartamentModel = Model<IDepartamentDocument>;

export const NOTIFICATION_STATUS = ['no read', 'read'] as const;

export type TNotificationStatus = typeof NOTIFICATION_STATUS[number];

export interface IUser {
	email: string;
	alias: string;
	name: string;
	lastName: string;
	isAdmin: boolean;
	department: IDepartamentDocument['_id'];
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
		notification: 'id';
	};
	password: string;
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
	closed: Date;
}

export interface IProjectsDocument extends IProjects, Document {}

export type IProjectsModel = Model<IProjectsDocument>;

export interface IClient {
	alias: string;
	name: string;
	testSystem: ITestSystemDocument['_id'][];
	projects: IProjectsDocument['_id'][];
	notes: INoteDocument['_id'][];
}

export interface IClientDocument extends IClient, Document {}

export type IClientModel = Model<IClientDocument>;

export interface INote {
	title: string;
	description: string;
	link: string;
	documents: IDocument[];
	testSystem: ITestSystemDocument['_id'][];
	project: IProjectsDocument['_id'];
	tags: ITagDocument['_id'][];
	updateLimitDate: Date;
	updateTime: Date;
	owner: IUserDocument['_id'];
	readBy: IUserDocument['_id'][];
	message: IMessageDocument['_id'][];
	approved: boolean;
	formalized: boolean;
}

export interface INoteDocument extends INote, Document {}

export type INoteModel = Model<INoteDocument>;

export interface IMessage {
	owner: IUserDocument['_id'];
	approved: boolean;
	formalized: boolean;
	message: string;
}

export interface IMessageDocument extends IMessage, Document {}

export type IMessageModel = Model<IMessageDocument>;

interface ITag {
	name: string;
	updated: IDate;
	projects: IProjectsDocument['_id'][];
	relatedTags: ITagDocument['_id'][];
	index: number;
}

export interface ITagDocument extends ITag, Document {}

export type ITagModel = Model<ITagDocument>;

export type GenericModel<T> = Model<T, unknown, never>;

export interface IReqUser {
	id: string;
	email: string;
}
