const getDoviz = require("../functions/getDoviz");

/**
 *
 * @param {import("express").Application} app
 */
module.exports = (app) => {
  app.get("/api/doviz", async (req, res) => {
    try {
      const values = await getDoviz();
      if (!values) return res.sendStatus(403).send("Failed to get info");
      res.json(values);
    } catch (error) {
      res.sendStatus(403).send("Failed to get info");
    }
  });
};
