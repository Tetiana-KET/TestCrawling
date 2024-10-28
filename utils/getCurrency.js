export function getCurrencySymbol(priceText) {
	const match = priceText.match(/[\€\$\£]/);
	if (match) {
		return currencyMap[match[0]];
	}
	return 'N/A';
}
