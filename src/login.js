const dbFunctions = require("./dbFunctions");
const crypto = require("node:crypto");
const prompt = require("prompt-sync")();
const GCM = require("./aes");
const { validate2FA } = require("./secondFactor");

module.exports = () => {
  const user = dbFunctions.findUser();
  if (!user) {
    console.log("usuario não encontrado");
    return;
  }

  const inputPassword = prompt("senha:");

  const ivBuffer = crypto
    .pbkdf2Sync(user.mail, user.salt, 100, 32, "sha256")
    .toString("base64");
  const keyBuffer = crypto.pbkdf2Sync(inputPassword, salt, 100, 32, "sha256");

  try {
    const decypherpassword = GCM.decrypt(
      Buffer.from(password, "base64"),
      keyBuffer,
      ivBuffer,
      Buffer.from(authTag, "base64")
    );

    if (!user.secondFactor) {
      console.log("sucesso no login");
      return;
    }

    const isValid = validate2FA(user);

    if (isValid) {
      console.log("sucesso no login");
      return;
    } else {
      console.log("código invalido");
      return;
    }
  } catch (error) {
    console.error("senha incorreta");
  }
};
