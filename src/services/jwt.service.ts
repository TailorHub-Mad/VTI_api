import JWT from 'jsonwebtoken';

// Esta función se encarga de crear el token de cada usuario.
export const signJWT = (userId: string, isAdmin: boolean, email: string): string => {
	const role = isAdmin ? 'admin' : 'user';
	return JWT.sign({ role, email }, 'PRIVATEKEY', {
		subject: userId,
		expiresIn: '7d'
	});
};

interface Tverify {
	sub: string;
	email: string;
	role: string;
}

export const verifyJWT = (token: string): Tverify => {
	return JWT.verify(token, 'PRIVATEKEY') as Tverify;
};
