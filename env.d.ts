/// <reference types="vite/client" />

interface ImportMetaEnv {
	/** API base URL. Relative (`/api`) keeps auth cookies first-party. */
	readonly VITE_API_URL?: string;
	readonly VITE_GOOGLE_CLIENT_ID?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

interface Window {
	google?: {
		accounts: {
			id: {
				initialize(config: {
					client_id: string;
					callback: (response: { credential: string }) => void;
				}): void;
				renderButton(
					parent: HTMLElement,
					options: {
						theme?: "outline" | "filled_blue" | "filled_black";
						size?: "large" | "medium" | "small";
						shape?: "rectangular" | "pill" | "circle" | "square";
						text?: "signin_with" | "signup_with" | "continue_with" | "signin";
						width?: number;
					},
				): void;
			};
		};
	};
}
