const { send, makes, allModels, loadJSON } = require("../lib/data");

module.exports = (req, res) => {
  const models = allModels();
  const clubs = loadJSON("clubs.json").clubs.length;
  send(res, 200, {
    status: "ok",
    makes: makes().length,
    models: models.length,
    generations: models.reduce((n, { model }) => n + model.generations.length, 0),
    clubs,
  });
};
