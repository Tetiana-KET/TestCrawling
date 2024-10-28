export function parsePrice(price) {
	return parseFloat(price.split(' ')[1].replace(',', '.').trim());
}
