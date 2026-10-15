export const money = (value: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "PLN" }).format(
    value,
  );
