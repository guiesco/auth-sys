const dbFunctions = require("./dbFunctions");
const QRCode = require("qrcode");
const { totp } = require("otplib");

module.exports.register2FA = () => {
  const user = dbFunctions.findUser(true);
  if (!user) {
    console.log("usuario não encontrado");
    return;
  }

  const isValid = validate2FA(user);

  if (isValid) {
    dbFunctions.saveUser({
      ...user,
      secondFactor: true,
    });
    console.log("segundo fator ativado com sucesso");
  } else {
    dbFunctions.saveUser(user);
    console.log("código invalido");
  }
};

module.exports.validate2FA = (user) => {
  const token = totp.generate(user.salt);

  QRCode.toString(token, { type: "terminal" }, function (err, url) {
    console.log(url);
  });

  const inputToken = prompt("código: ");

  const isValid = totp.check(inputToken, user.salt);

  // const controlValidation = totp.check(token, user.salt);
  // console.log("controlValidation", controlValidation);
  // console.log("token", token);
  // console.log("inputToken", inputToken);

  if (isValid) {
    return true;
  }
  if (!isValid && inputToken === token) {
    console.log("codigo expirado");
    return validate2FA(user);
  }
  return false;
};
