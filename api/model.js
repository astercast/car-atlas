const { send, makes, makeFile } = require("../lib/data");

/* GET /api/model?make=porsche&model=911 */
module.exports = (req, res) => {
  const url = new URL(req.url, "http://localhost");
  const makeSlug = url.searchParams.get("make");
  const modelSlug = url.searchParams.get("model");
  if (!makeSlug || !modelSlug) {
    return send(res, 400, { error: "Both ?make= and ?model= are required." });
  }
  const meta = makes().find((m) => m.slug === makeSlug);
  const file = makeFile(makeSlug);
  const model = file?.models.find((m) => m.slug === modelSlug);
  if (!meta || !model) {
    return send(res, 404, { error: `No record for ${makeSlug}/${modelSlug} in the atlas yet.` });
  }
  send(res, 200, { make: meta, model });
};
