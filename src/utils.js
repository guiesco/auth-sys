const crypto = require("node:crypto");

module.exports.doScrypt = (payload, salt) => {
  return crypto.scryptSync(payload, salt, 64).toString("base64");
};

module.exports.parse = (entry) => {
  return JSON.stringify(entry)
    .replaceAll(",", "\n")
    .replace("{", "")
    .replace("}", "");
};
