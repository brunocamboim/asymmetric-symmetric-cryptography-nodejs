// dependencias
const fs     = require('fs');
const crypto = require('crypto');
const path   = require('path');

// secret para gerar a chave privada
const passphrase = 'mySecret';

const privateKeyPath  = './src/keys/asymmetric_private.pem';
const publicKeyPath   = './src/keys/asymmetric_public.pem';

// Função responsavel por criptografar a mensagem com base na chave publica
const encryptStringWithRsaPublicKey = (toEncrypt, relativeOrAbsolutePathToPublicKey) => {
  var absolutePath = path.resolve(relativeOrAbsolutePathToPublicKey);
  var publicKey = fs.readFileSync(absolutePath, 'utf8');
  var buffer = Buffer.from(toEncrypt);
  var encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString('base64');
};

// Função responsavel por desencriptografar a mensagem usando a chave privada
const decryptStringWithRsaPrivateKey = (toDecrypt, relativeOrAbsolutePathtoPrivateKey) => {
  var absolutePath  = path.resolve(relativeOrAbsolutePathtoPrivateKey);
  var privateKey    = fs.readFileSync(absolutePath, 'utf8');
  var buffer        = Buffer.from(toDecrypt, 'base64');
  const decrypted   = crypto.privateDecrypt(
    {
      key         : privateKey.toString(),
      passphrase  : passphrase
    },
    buffer
  );
  return decrypted.toString('utf8');
};

// função para gerar a private e a public key (pem)
const generateKeys = async () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', 
    {
      modulusLength: 4096,
      namedCurve: 'secp256k1', 
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'     
      },     
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: passphrase
      } 
    }
  );
  
  // escreve as chaves publica e privada
  fs.writeFileSync(privateKeyPath, privateKey);
  fs.writeFileSync(publicKeyPath, publicKey);
};

console.log('Generating private and public keys...');
generateKeys();

// Cliente a criptografa a mensagem com a chave publica
const message = 'Write a message here';
const a       = encryptStringWithRsaPublicKey(message, publicKeyPath);
console.log(`Sending message (${message}) encrypted`, a);

// Destinatario recebe a mensagem criptografada e desencriptografa a chave privada
const b = decryptStringWithRsaPrivateKey(a, privateKeyPath);
console.log('\nReceive message decrypted:', b);