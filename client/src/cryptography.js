const forge = require("node-forge");

const key = "sKfjZqhxy4yX22xT";
const iv = "djLLZ0rI1waRfdtO";
// decrypt and encrypt uses constant hardcoded key and iv for simplicity sake
export function hash(input) {
    const md = forge.md.sha256.create();
    md.update(input);
    return md.digest().toHex();
}
export function encrypt(input) {
    var cipher = forge.cipher.createCipher("AES-CBC", key);
    cipher.start({ iv: iv });
    cipher.update(forge.util.createBuffer(input));
    cipher.finish();
    var encrypted = cipher.output;
    console.log(encrypted);
    console.log(decrypt(encrypted));
    return encrypted;
}
function decrypt(encrypted) {
    var decipher = forge.cipher.createDecipher("AES-CBC", key);
    decipher.start({ iv: iv });
    decipher.update(encrypted);
    var result = decipher.finish(); // check 'result' for true/false
    return JSON.parse(decipher.output.toString());
}
