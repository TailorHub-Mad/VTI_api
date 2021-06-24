import winston from 'winston';

const levels = {
	error: 0,
	notice: 1,
	warn: 2,
	info: 3,
	http: 4,
	debug: 5
};

const level = () => {
	const env = process.env.NODE_ENV || 'development';
	const isDevelopment = env === 'development';
	return isDevelopment ? 'debug' : 'warn';
};

const colors = {
	error: 'red',
	warn: 'yellow',
	info: 'green',
	http: 'magenta',
	debug: 'white',
	notice: 'blue'
};

winston.addColors(colors);

const format = winston.format.combine(
	winston.format.timestamp({ alias: 'time', format: 'DD-MM-YYYY HH:mm:ss:ms' }),
	winston.format.label({ label: 'API' }),
	winston.format.printf(
		(info) => `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`
	)
);

const transports = [
	new winston.transports.Console(),
	new winston.transports.File({
		filename: 'logs/error.log',
		level: 'error'
	}),
	new winston.transports.File({
		filename: 'logs/vti.log',
		level: 'notice'
	}),
	new winston.transports.File({ filename: 'logs/all.log' })
];

const logger = winston.createLogger({
	level: level(),
	levels,
	format,
	transports
});

global.logger = logger;

export default logger;
