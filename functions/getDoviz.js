const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
module.exports = async () => {
  try {
    const data1 = await fetch(
      "https://api.exchangerate-api.com/v4/latest/USD"
    ).then(async (x) => await x.json());

    const data2 = await fetch(
      "https://api.exchangerate-api.com/v4/latest/EUR"
    ).then(async (x) => await x.json());

    const data3 = await fetch(
      "https://api.exchangerate-api.com/v4/latest/GBP"
    ).then(async (x) => await x.json());
    const dolar = data1.rates.TRY;
    const euro = data2.rates.TRY;
    const sterlin = data3.rates.TRY;
    return { dolar, euro, sterlin };
  } catch (error) {
    return undefined;
  }
};
