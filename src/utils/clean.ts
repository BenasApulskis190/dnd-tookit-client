export function clean(text: string): string {
	return text
		.replace(
			/\{@(?:dice|damage|hit)\s([^|}]+)(?:\|([^}]+))?\}/g,
			(_, content, display) => `<strong>${display ?? content}</strong>`,
		)
		.replace(
			/\{@\w+\s([^|}]+)(?:\|([^}]+))?\}/g,
			(_, content, display) => display ?? content,
		)
}
