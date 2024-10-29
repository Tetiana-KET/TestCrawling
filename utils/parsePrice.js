export function parsePrice(price) {
	return parseFloat(price.split(' ')[1].replace(',', '.').trim());
}

export function parsePriceNumFirst(price) {
	return parseFloat(price.split(' ')[0].replace(',', '.').trim());
}