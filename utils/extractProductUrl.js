export function extractProductId(url) {
	return url.split('/').pop()?.split('-').pop()?.split('.')[0] || '';
}
