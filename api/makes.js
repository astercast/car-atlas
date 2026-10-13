const { send, makes, makeFile } = require("../lib/data");

module.exports = (req, res) => {
  const list = makes().map((m) => {
    const file = makeFile(m.slug);
    return { ...m, modelCount: file ? file.models.length : 0 };
  });
  send(res, 200, { makes: list });
};
