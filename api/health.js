const { send, makes, allModels, loadJSON, datasetUpdatedAt } = require("../lib/data");

/* Live-Wire-style surface for this site: real counts computed from
   the dataset on every call (never hardcoded), plus the dataset's
   own date so a stale deploy is visible at a glance. */
module.exports = (req, res) => {
  const models = allModels();
  const clubs = loadJSON("clubs.json").clubs.length;
  send(res, 200, {
    status: "ok",
    makes: makes().length,
    models: models.length,
    generations: models.reduce((n, { model }) => n + model.generations.length, 0),
    clubs,
    datasetUpdatedAt: datasetUpdatedAt(),
  });
};
