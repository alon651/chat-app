const forge = require("node-forge");
export function hash(input) {
    const md = forge.md.sha256.create();
    md.update(input);
    return md.digest().toHex();
}
