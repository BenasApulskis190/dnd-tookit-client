export interface IUser {
	id: string;
	name: string;
	email: string;
	avatarUrl?: string;
}

export interface ILoginCredentials {
	email: string;
	password: string;
}
