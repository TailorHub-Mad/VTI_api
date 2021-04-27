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

export interface IDepartamentDocument extends IDepartament, Document {}

export type IDepartamentModel = Model<IDepartamentDocument>;

interface IUser {
	email: string;
	alias: string;
	name: string;
	lastName: string;
	idAdmin: boolean;
	departament: IDepartamentDocument['_id'];
	projectsComments: IProjectsDocument['_id'][];
	focusPoint: IUserDocument['_id'][];
	favorites: {
		notes: [];
		projects: [];
	};
	subscribed: {
		notes: [];
		projects: IProjectsDocument['_id'][];
		testSystem: ITestSystemDocument['_id'][];
	};
	notifications: {
		status: 'no read' | 'read';
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
}

interface ITestSystemDocument extends ITestSystem, Document {}

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
