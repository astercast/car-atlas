const { send, loadJSON } = require("../lib/data");

/* GET /api/clubs?region=Germany&marque=Porsche */
module.exports = (req, res) => {
  const url = new URL(req.url, "http://localhost");
  const region = url.searchParams.get("region");
  const marque = url.searchParams.get("marque");
  let clubs = loadJSON("clubs.json").clubs;
  if (region) clubs = clubs.filter((c) => c.region === region);
  if (marque) clubs = clubs.filter((c) => c.marque === marque);
  send(res, 200, { clubs, count: clubs.length });
};
