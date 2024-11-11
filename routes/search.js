const { getJson } = require("serpapi");
const config = require("../config.json");
module.exports = (app) => {
  app.get("/api/search/:deger/:sayi?", (req, res) => {
    const deger = req.params.deger;
    const sayi = req.params.sayi ? parseInt(req.params.sayi, 10) : 1; // Default değeri 1

    // Sayı kontrolü yap
    if (isNaN(sayi) || sayi < 1 || sayi > 6) {
      return res
        .status(400)
        .json("Hatalı sayı. Sayı 1 ile 6 arasında olmalıdır.");
    }

    const params = {
      engine: "google",
      q: deger,
      hl: "tr",
      gl: "tr",
      num: sayi, // Burada sayi değerini direkt olarak num parametresine atıyoruz
      start: sayi,
      safe: "active",
      api_key: config.keys.googleAPI,
    };

    getJson(params, (json) => {
      // Belirli alanları çıkart
      const sanitizedResults = json.organic_results.map((result) => {
        const { favicon, about_page_serpapi_link, thumbnail, ...rest } = result;
        return rest;
      });

      // JSON.stringify'nin üçüncü parametresi ile düzenli JSON oluştur
      const formattedData = JSON.stringify(sanitizedResults, null, 2);
      res.header("Content-Type", "application/json").send(formattedData);
    });
  });
};
