

export const calculateLineItem = (item) => {
  const qty = parseFloat(item.qty) || 0;
  const price = parseFloat(item.price) || 0;
  const taxRate = parseFloat(item.taxRate) || 0;

  const exclAmount = qty * price;
  const taxAmount = exclAmount * (taxRate / 100);
  const inclAmount = exclAmount + taxAmount;

  return { ...item, exclAmount, taxAmount, inclAmount };
};

export const calculateGrandTotals = (items) => {
  return {
    totalExcl: items.reduce((sum, r) => sum + (r.exclAmount || 0), 0),
    totalTax: items.reduce((sum, r) => sum + (r.taxAmount || 0), 0),
    totalIncl: items.reduce((sum, r) => sum + (r.inclAmount || 0), 0),
  };
};