import logger from '@log';
import { IClientDocument } from '../interfaces/models.interface';
import { ClientModel } from '../models/client.model';

const PROJECTS_NAME = [
	'2046-JANE-rev.varias',
	'2047-ALAVA-SAD',
	'GNL20',
	'DES20',
	'CCIAL20',
	'GTOS20',
	'OBSOLETO_2048-INTA-mto19',
	'2049-EMMA-GOU',
	'2050-UC3M-hopkinson',
	'2051-GAING-PistolaElevalunas',
	'2052-ADDITIUM-med_velo5',
	'2053-GAING-mto20',
	'2054-CEDEX-acondicionador',
	'2055-KIOST-reparacion',
	'2056-GAING-palpadorCIL',
	'2057-UdC-torredecaida',
	'2058-DAPLAST-be_asientoabatible',
	'2059-ADDITIUM-med_velo6',
	'2060-UC3M-mto.lab.',
	'2061-DST-GOU',
	'2062-UC3M-utillajeHopkinson',
	'2063-GUNT-GOU',
	'2064-UC3M-calib.med.vel.',
	'2065-INTA-mto20',
	'2066-VALEO-mto20',
	'2037-IFREMER-GOU',
	'2067-UC3M-Marco',
	'2068-ISRINGHAUSEN-PC+Soft.',
	'2069-KRISO-spares',
	'2070-ETSIN-mto20',
	'2071-UdC-GOM',
	'2072-KARWALA-ropes',
	'2073-CESVIMAP-acc_chipdallas',
	'2074-IHC-mto20-21',
	'2075-UCa-SADsonda',
	'2076-GESTAMP-carac_silentblocks',
	'GNL21',
	'DES21',
	'CCIAL21',
	'GTOS21',
	'2077-DYSMECA-Taladro',
	'2078-CESA-controlUplock',
	'2079-SAFE LIFE-mcee_48',
	'2080-GAING-mto21',
	'2081-CEDEX-mto21',
	'2082-ADDITIUM-reptarjTRW-CN',
	'2083-UGR-controlGOM',
	'2084-UGR-mto21',
	'2085-SAFE LIFE-mto21_PEC',
	'2086-DALPHI METAL-mto21_vigo',
	'2087-GUNT-rep_bloq'
];

export const randomNumberFnc = (number: number): number => ~~(Math.random() * number);

const testSystemAliasCode = (index: number) => index.toString().padStart(3, '0');

export default async (): Promise<void> => {
	const { randomBytes } = await import('crypto');
	const nameModel = ClientModel.collection.name;
	logger.info(nameModel);
	await ClientModel.deleteMany({});
	logger.info(`Borrado de la base de datos ${nameModel}`);

	const createClientBase = (index: number): (Partial<IClientDocument> & { name: string })[] => [
		{
			name: 'CENTRO DE ESTUDIOS Y EXPERIMENTACION DE OBRAS PÚBLICAS (CEDEX) Centro de Estudios de Puertos y Costas (CEPYC)',
			alias: `CEDEX1-${testSystemAliasCode(index)}`
		},
		{
			name: 'INSTITUTO FRANCES DE INVESTIGACION PARA LA EXPLOTACION DEL MAR (IFREMER)',
			alias: `IFREMER-${testSystemAliasCode(index)}`
		},
		{
			name: 'UNIVERSIDAD CARLOS III',
			alias: `UC3M-${testSystemAliasCode(index)}`
		},
		{
			name: 'COMPAÑÍA ESPAÑOLA DE SISTEMAS AERONAUTICOS, S.A.',
			alias: `CESA-${testSystemAliasCode(index)}`
		},
		{
			name: 'KOREA RESEARCH INSTITUTE OF SHIPS & OCEAN ENGINEERING (KRISO)',
			alias: `KRISO-${testSystemAliasCode(index)}`
		},
		{
			name: 'GRUPO ANTOLIN INGENIERIA, S.A.',
			alias: `GAING-${testSystemAliasCode(index)}`
		},
		{
			name: 'GRUPO ANTOLIN OSTRAVA, s.r.o.',
			alias: `GA OSTRAVA-${testSystemAliasCode(index)}`
		},
		{
			name: 'CENTRO DE ESTUDIOS Y EXPERIMENTACION DE OBRAS PÚBLICAS (CEDEX) Centro de Estudios del Transporte',
			alias: `CEDEX2-${testSystemAliasCode(index)}`
		},
		{
			name: 'CENTRO DE ESTUDIOS Y EXPERIMENTACION DE OBRAS PÚBLICAS (CEDEX) Laboratorio de Geotecnia',
			alias: `CEDEX3-${testSystemAliasCode(index)}`
		},
		{
			name: 'DEVELOPMENT CENTRE FOR SHIP TECHNOLOGY AND TRANSPORT SYSTEMS e.V.',
			alias: `DST-${testSystemAliasCode(index)}`
		}
	];

	const createNotes = () => ({
		title: randomBytes(8).toString('hex'),
		description: 'Description',
		link: 'link',
		documents: [],
		messages: [
			new Array(randomNumberFnc(3) + 1)
				.fill(undefined)
				.map(() => ({ message: randomBytes(8).toString('hex') }))
		],
		approved: true,
		formalized: false
	});

	const createTestSystem = (clientName: string) => {
		const alias = `${clientName}-${randomBytes(8).toString('hex')}`;
		const vtiCode = `${randomBytes(8).toString('hex')}`;
		return {
			vtiCode,
			alias,
			date: {
				year: randomNumberFnc(21) + 2000 // random 2021 - 2000
			}
		};
	};

	const createProject = (numberOfTestSystem: number, testSystem: unknown[]) => ({
		alias: `${PROJECTS_NAME[randomNumberFnc(PROJECTS_NAME.length)]}-${randomBytes(8).toString(
			'hex'
		)}`,
		date: {
			year: randomNumberFnc(21) + 2000 // random 2021 - 2000
		},
		testSystems: new Array(numberOfTestSystem).fill(undefined).map((_, index) => testSystem[index])
	});

	const clientsArray = new Array(2)
		.fill(undefined)
		.map((_, index) => {
			const clients = createClientBase(index);

			return clients.reduce((clients, client) => {
				client.testSystems = new Array(randomNumberFnc(3) + 1)
					.fill(undefined)
					.map(() => createTestSystem(client.name));
				clients.push(client);
				return clients;
			}, [] as Partial<IClientDocument>[]);
		})
		.flat();

	const clientsDBWithTestSystem = await Promise.all(
		clientsArray.map((client) => {
			return new ClientModel(client).save();
		})
	);

	const clientsDBWithProjects = await Promise.all(
		clientsDBWithTestSystem.map((client) => {
			const projects = new Array(randomNumberFnc(3) + 1)
				.fill(undefined)
				.map(() =>
					createProject(randomNumberFnc(client.testSystems.length) + 1, client.testSystems)
				);
			client.projects = projects;
			return client.save();
		})
	);

	const clientsDBWithNotes = await Promise.all(
		clientsDBWithProjects.map((client) => {
			const notes = new Array(randomNumberFnc(5) + 1).fill(undefined).map(createNotes);
			client.notes = notes;
			return client.save();
		})
	);

	await Promise.all(
		clientsDBWithNotes.map((client) => {
			const { notes } = client;
			if (notes.length > 0) {
				client.projects = client.projects.map((project) => {
					project.notes = new Array(randomNumberFnc(notes.length) + 1)
						.fill(undefined)
						.map((_, i) => {
							return notes[i]._id;
						});
					return project;
				});
				return client.save();
			}
			return client;
		})
	);
};
