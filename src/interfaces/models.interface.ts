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

interface IUser {
	email: string;
	alias: string;
	name: string;
	lastName: string;
	idAdmin: boolean;
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
}

export interface IUserDocument extends IUser, Document {}

export type IUserModel = Model<IUserDocument>;

interface ITestSystem {
	vtiCode: string;
	date: IDate;
	projects: IProjectsDocument['_id'][];
	client: IClientDocument['_id'];
	alias: string;
	notes: INoteDocument['id'][];
	year: number;
}

export interface ITestSystemDocument extends ITestSystem, Document {}

export type ITestSystemModel = Model<ITestSystemDocument>;

interface ISector {
	title: string;
	projects: IProjectsDocument['_id'][];
}

export interface ISectorDocument extends ISector, Document {}

export type ISectorModel = Model<ISectorDocument>;

interface IProjects {
	alias: string;
	date: IDate;
	client: IClientDocument['_id'];
	sector: ISectorDocument['_id'];
	focusPoint: IUserDocument['_id'][];
	testSystem: ITestSystemDocument['_id'][];
	tag: [];
	notes: [];
	closed: Date;
}

export interface IProjectsDocument extends IProjects, Document {}

export type IProjectsModel = Model<IProjectsDocument>;

interface IClient {
	alias: string;
	name: string;
	testSystem: ITestSystemDocument['_id'][];
	projects: IProjectsDocument['_id'][];
}

export interface IClientDocument extends IClient, Document {}

export type IClientModel = Model<IClientDocument>;

interface INote {
	title: string;
	description: string;
	link: string;
	documents: IDocument[];
	// type: enum;
	testSystem: ITestSystemDocument['_id'][];
	projects: IProjectsDocument['_id'][];
	// tags: ITagDocument['_id'][];
	// messages: IMessageDocument['_id'][];
	// update: IDate; // da error con el Document de mongoose
	updateTime: IDate;
	owner: IUserDocument['_id'];
	read: IUserDocument['_id'][];
	aproved: boolean;
	formalize: boolean;
}

export interface INoteDocument extends INote, Document {}

export type INoteModel = Model<INoteDocument>;

interface ITag {
	name: string;
	updated: IDate;
	projects: IProjectsDocument['_id'][];
	relatedTags: ITagDocument['_id'][];
	index: number;
}

export interface ITagDocument extends ITag, Document {}

export type ITagModel = Model<ITagDocument>;
