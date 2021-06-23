import JWT from 'jsonwebtoken';

// Esta función se encarga de crear el token de cada usuario.
export const signJWT = (userId: string, isAdmin: boolean): string => {
	const role = isAdmin ? 'admin' : 'user';
	return JWT.sign({ role }, 'PRIVATEKEY', { subject: userId, expiresIn: '7d' });
};

export const verifyJWT = (token: string): string | JWT.JwtPayload => {
	return JWT.verify(token, 'PRIVATEKEY');
};
