const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const config = require("../config.json");
const cio = require("cheerio");
/**
 *
 * @param {import("express").Application} app
 */
module.exports = (app) => {
  app.get("/api/song/:songname", async (req, res) => {
    try {
      const name = req.params.songname.replace(/ /g, '-')
      const get = await fetch(
        encodeURI(
          `https://api.genius.com/search?q=${encodeURIComponent(name)}`
        ),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${config.keys.genius}`,
            "Content-Type": "application/json",
          },
        }
      ).then(async (x) => x.json());
      if (get.meta.status !== 200) {
        res.json({
          get: false,
          error: "Api Returned undefined",
        });
      } else {
        const first = get.response.hits[0];
        if (!first)
          return res.json({
            get: false,
            error: "Unknown song",
          });
        res.json(first);
      }
    } catch (error) {
      console.log(error);
      res.json({
        get: false,
        error,
      });
    }
  });
  app.get("/api/lyrics/:songname", async (req, res) => {
    try {
      const name = req.params.songname.replace(/ /g, '-')
      const get = await fetch(
        encodeURI(
          `https://api.genius.com/search?q=${encodeURIComponent(name)}`
        ),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${config.keys.genius}`,
            "Content-Type": "application/json",
          },
        }
      ).then(async (x) => x.json());
      if (get.meta.status !== 200) {
        res.json({
          get: false,
          error: "Api Returned undefined",
        });
      } else {
        const first = get.response.hits[0];
        if (!first?.result?.url)
          return res.json({
            get: false,
            error: "Unknown song",
          });
        const get2 = await fetch(encodeURI(first.result.url)).then(async (x) =>
          x.text()
        );
        const $ = cio.load(get2);
        let lyrics = $('div[class="lyrics"]').text().trim();
        if (!lyrics) {
          lyrics = "";
          $('div[class^="Lyrics__Container"]').each((i, elem) => {
            if ($(elem).text().length !== 0) {
              let snippet = $(elem)
                .html()
                .replace(/<br>/g, "\n")
                .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, "");
              lyrics += $("<textarea/>").html(snippet).text().trim() + "\n\n";
            }
          });
        }
        if (!lyrics)
          return res.json({
            get: false,
            error: "Unknown song",
          });
        return res.json({
          get: true,
          lyrics,
          title: first.result.full_title,
          url: first.result.url,
        });
      }
    } catch (error) {
      console.log(error);
      res.json({
        get: false,
        error,
      });
    }
  });
};
