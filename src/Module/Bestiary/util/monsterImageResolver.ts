export const resoleMonsterImageUrl = (
	source: string,
	name: string,
	extension: "png" = "png",
): string => {
	const apiUrl = "http://api.dev/api/images/";

	return (
		apiUrl +
		encodeURIComponent(source) +
		"/" +
		encodeURIComponent(name) +
		"." +
		extension
	);
};
