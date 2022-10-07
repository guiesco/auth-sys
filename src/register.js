const crypto = require("node:crypto");
const prompt = require("prompt-sync")();
const GCM = require("./aes");
const { doScrypt } = require("./utils");
const { saveUser, findUser } = require("./dbFunctions");

module.exports = () => {
  const salt = crypto.randomBytes(16).toString("base64");

  const mail = prompt("email: ");

  const user = findUser(mail);
  if (user) {
    console.log("email ja esta em uso");
    return;
  }
  const scryptMail = doScrypt(mail, salt);

  const password = prompt("senha: ");

  const keyBuffer = crypto.pbkdf2Sync(password, salt, 100, 32, "sha256");
  const ivBuffer = crypto
    .pbkdf2Sync(scryptMail, salt, 100, 32, "sha256")
    .toString("base64");

  const { encrypted, authTag } = GCM.encrypt(password, keyBuffer, ivBuffer);

  saveUser({
    mail: scryptMail,
    password: encrypted.toString("base64"),
    salt,
    authTag: authTag.toString("base64"),
  });

  // console.log("salt", salt);
  // console.log("scryptMail", scryptMail);
  // console.log("key", keyBuffer);
  // console.log("encryptedPassword", encrypted);
  // console.log("authTag", authTag);
  console.log("usuario registrado");
};
