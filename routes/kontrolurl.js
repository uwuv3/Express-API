const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
/**
 *
 * @param {import("express").Application} app
 */
module.exports = (app) => {
  app.get("/api/kontrolurl/:domain", async (req, res) => {
    try {
      const { domain } = req.params;
      const url = new URL("http://" + domain);

      const response = await fetch(url);
      if (response.status === 200) {
        res.json({
          kontrol: true,
          status: response.status,
        });
      } else {
        res.json({
          kontrol: false,
          status: response.status,
        });
      }
    } catch (error) {
      console.log(error);
      res.json({
        kontrol: false,
        error,
      });
    }
  });
};
