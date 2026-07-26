export const formatFileName = (name: string) => {
	if (!/[ÐÑâ]/.test(name)) return name

	const bytes = Uint8Array.from(name, character => character.charCodeAt(0))
	const decoded = new TextDecoder().decode(bytes)

	return /[\p{L}\p{N}]/u.test(decoded) && !decoded.includes('�') ? decoded : name
}
