// Avatars are stored as a data: URL directly on the character row (imageUrl
// is a plain string column) rather than uploaded to a file store, so keep
// them small.
const MAX_AVATAR_BYTES = 1.5 * 1024 * 1024;

export function readAvatarFile(file: File): Promise<string> {
	if (file.size > MAX_AVATAR_BYTES) {
		return Promise.reject(new Error("Image is too large — please use one under 1.5MB."));
	}

	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = () => reject(reader.error ?? new Error("Failed to read image file"));
		reader.readAsDataURL(file);
	});
}
