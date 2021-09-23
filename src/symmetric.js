// dependencias
const CryptoJS = require('crypto-js');

// public key shared
const symmetricKey = require('./keys/symmetric.json');

// O cliente, com posse da public-key, criptografa sua mensagem para enviar ao destino
const message          = 'Write a message here';
const encryptedMessage = CryptoJS.AES.encrypt('oi', symmetricKey.publicKey);
console.log(`Sending message (${message}) encrypted`, encryptedMessage.toString());

// O destinatário, com posse da public-key também, desencriptografa a mensagem recebida
const bytesDecrypted = CryptoJS.AES.decrypt(encryptedMessage, symmetricKey.publicKey);
const decryptedData  = bytesDecrypted.toString(CryptoJS.enc.Utf8);

// Printa a mensagem desencriptografada
console.log('\nReceive message decrypted:', decryptedData);
