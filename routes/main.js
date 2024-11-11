const config = require("../config.json");
/**
 *
 * @param {Express.Application} app
 */
module.exports = (app) => {
  app.get("/", (req, res) => {
    res.render("api.ejs", {
      pages: config.pages,
      footerLinks: config.footerLinks,
    });
  });
};
