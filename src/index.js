const prompt = require("prompt-sync")();

const login = require("./login");
const registerUser = require("./register");
const { register2FA } = require("./secondFactor");
const { parse } = require("./utils");

function main() {
  const mainMenu = {
    1: "Cadastro",
    2: "cadastrar 2FA",
    3: "login",
    0: "sair",
  };

  const parsedMenu = parse(mainMenu);
  console.log(parsedMenu);
  const input = prompt("escolha uma opção: ");

  switch (input) {
    case "1":
      return registerUser();
    case "2":
      return register2FA();
    case "3":
      return login();
    case "0":
      return;
    default:
      return main();
  }
}

main();
