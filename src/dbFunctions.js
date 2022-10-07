const JSONdb = require("simple-json-db");
const db = new JSONdb("./src/storage/db.json");
const prompt = require("prompt-sync")();
const { doScrypt } = require("./utils");

module.exports.deleteFromIndex = (index, users) => {
  users.splice(index, 1);
  db.set("users", users);
};

module.exports.saveUser = (user) => {
  const users = db.get("users");
  console.log(users);
  if (Array.isArray(users)) {
    db.set("users", [user, ...users]);
  } else {
    db.set("users", [user]);
  }
};

module.exports.findUser = (mail, isEdit = false) => {
  const users = db.get("users");
  const inputMail = mail || prompt("email: ");

  return users.find(({ mail, salt }, index) => {
    const scryptInputMail = doScrypt(inputMail, salt);
    if (scryptInputMail !== mail) {
      return false;
    }
    isEdit ? deleteFromIndex(index, [...users]) : "";
    console.log("email encontrado!");
    return true;
  });
};
