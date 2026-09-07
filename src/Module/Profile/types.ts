export interface IUser {
	id: string;
	username: string;
	email: string;
	name: string | null;
	avatarUrl: string | null;
	createdAt?: string;
}

export interface ILoginCredentials {
	identifier: string;
	password: string;
}

export interface IRegisterCredentials {
	username: string;
	email: string;
	password: string;
}

export interface IAuthResponse {
	accessToken: string;
	user: IUser;
}
