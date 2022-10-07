const crypto = require("crypto");

module.exports.encrypt = (message, key, iv) => {
  const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(key), iv);

  let encrypted = cipher.update(Buffer.from(message, "utf-8"));

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  const authTag = cipher.getAuthTag();

  return { encrypted, authTag };
};

module.exports.decrypt = (encrypted, key, iv, authTag) => {
  const decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(key), iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(Buffer.from(encrypted, "utf-8"));

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted;
};
