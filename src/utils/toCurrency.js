// Create our number formatter.
const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

/**
 * Convert a string or number to a currency string
 * @param {string|number} money Currency in string format
 */
function toCurrency(money) {
  return currencyFormatter.format(money);
}

export default toCurrency;
