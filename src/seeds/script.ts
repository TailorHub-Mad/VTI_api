import { randomBytes } from 'crypto';
import { ClientModel } from '../models/client.model';
import { randomNumberFnc } from './client.seed';

const TEST_SYSTEM_NAME = [
	'ADS-DALPHI-003',
	'ADS-SAFELIFE-002',
	'GOM-Ifremer-001',
	'ControlGOM-UGR-001',
	'DropTow-AIC-001',
	'DropTow-YANFENG-001',
	'FluComb-UGR-001',
	'GOM-CEDEX-001',
	'GOU-ETSIN-001',
	'GOM-UdC-001',
	'GOM-UdC-001',
	'GOU-GUNT-001',
	'MCEE48-SAFELIFE-001',
	'MedVelo-ADDITIUM-003',
	'MedVelo-ADDITIUM--007',
	'Posic-INTA-001',
	'RackSond4Ch-Uca-001',
	'SilentBlock-GESTAMP-001',
	'UpLock-CESA--001'
];

export default async (): Promise<void> => {
	// const allClients = await (ClientModel as any).updateMany({}, { $unset: 'testSystem' });
	await ClientModel.updateMany({}, { $unset: { testSystem: 1 } }, { multi: true });
	// await Promise.all(
	// 	allClients.map((client) => {
	// 		// client.testSystems = (client as any).testSystem.map((testSystems: any) => {
	// 		// 	testSystems.alias =
	// 		// 		TEST_SYSTEM_NAME[randomNumberFnc(TEST_SYSTEM_NAME.length)] +
	// 		// 		'-' +
	// 		// 		randomBytes(3).toString('hex');
	// 		// 	return testSystems;
	// 		// });
	// 		return client.updateOne({
	// 			testSystems: (client.toObject() as any).testSystem,
	// 			testSystem: undefined
	// 		});
	// 	})
	// );
	// allClients[0].testSystems = (allClients[0] as any).testSystem;
	// console.log((allClients[0].toObject() as any).testSystem);
	// await allClients[0].updateOne({
	// 	testSystems: (allClients[0].toObject() as any).testSystem,
	// 	testSystem: undefined
	// });
};
