export interface IError extends Error {
	status?: number;
	message: string;
	code?: string;
}
