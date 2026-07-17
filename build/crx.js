const fs = require("fs");
const crypto = require("crypto");

const [zippath, pempath, outpath] = process.argv.slice(2);
if (!zippath || !pempath || !outpath) {console.error("do node crx.js input.zip key.pem output.crx"); process.exit(1)}

const varint = n => {
  const out = [];
  while (n > 127) {out.push((n & 127) | 128); n >>>= 7}
  out.push(n);
  return Buffer.from(out);
};
const field = (num, buf) => Buffer.concat([varint((num << 3) | 2), varint(buf.length), buf]);
const le32 = n => {const b = Buffer.alloc(4); b.writeUInt32LE(n); return b};

let pem;
if (fs.existsSync(pempath)) pem = fs.readFileSync(pempath, "utf8");
else {
  const kp = crypto.generateKeyPairSync("rsa", {modulusLength: 2048});
  pem = kp.privateKey.export({type: "pkcs8", format: "pem"});
  fs.writeFileSync(pempath, pem);
  console.log("generated new signing key:", pempath);
}

const key = crypto.createPrivateKey(pem);
const pub = crypto.createPublicKey(key).export({type: "spki", format: "der"});
const zip = fs.readFileSync(zippath);

const crxid = crypto.createHash("sha256").update(pub).digest().subarray(0, 16);
const signeddata = field(1, crxid);
const sigbase = Buffer.concat([Buffer.from("CRX3 SignedData\x00", "latin1"), le32(signeddata.length), signeddata, zip]);
const sig = crypto.createSign("RSA-SHA256").update(sigbase).sign(key);

const proof = Buffer.concat([field(1, pub), field(2, sig)]);
const header = Buffer.concat([field(2, proof), field(10000, signeddata)]);
fs.writeFileSync(outpath, Buffer.concat([Buffer.from("Cr24"), le32(3), le32(header.length), header, zip]));

const extid = [...crxid].map(b => "abcdefghijklmnop"[b >> 4] + "abcdefghijklmnop"[b & 15]).join("");
console.log("packed:", outpath);
console.log("extension id:", extid);
