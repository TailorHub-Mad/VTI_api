import { ENCODING_UTF8 } from '@constants/formats';
import { Request, Response } from 'express';
import { connection } from '../enums';
import { readFileSync } from 'fs';
import mongoose from 'mongoose';

const pjson = JSON.parse(readFileSync('./package.json', ENCODING_UTF8));

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const HealthStatus = async (_req: Request, res: Response) => {
	// eslint-disable-next-line promise/param-names
	const commit = await new Promise((res, rej) =>
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		require('child_process').exec('git rev-parse HEAD', function (_err: unknown, stdout: unknown) {
			if (_err) {
				rej(_err);
			}
			res(stdout);
		})
	);
	const processId = process.pid;
	res.status(200).send({
		name: pjson.name,
		version: pjson.version,
		mongodb: {
			status: connection[mongoose.connection.readyState]
		},
		git: `Last commit hash on this branch is: ${commit}`,
		process: `Server Started in process ${processId}`
	});
};
