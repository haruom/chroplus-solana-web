import * as admin from "firebase-admin";
import { https, config } from "firebase-functions";
import { CallableContext } from "firebase-functions/v1/https";
import * as jose from "jose";
import { createHash } from "crypto";

module.exports = https.onCall(async (data: any, context: CallableContext) => {
  console.info(data);
  console.info(data["id_token"]);

  const idToken = data["id_token"] as string;

  const jwksURL = new URL("https://id.worldcoin.org/jwks.json");
  const JWKS = jose.createRemoteJWKSet(jwksURL);

  const { payload, protectedHeader } = await jose.jwtVerify(idToken, JWKS, {
    issuer: "https://id.worldcoin.org",
    audience: config().chroplus.worldid.appid,
  });

  console.log(payload);
  console.log(protectedHeader);

  if (payload["nonce"] !== data["nonce"]) {
    return "invalid";
  }

  const subject = payload["sub"] as string
  console.log(subject);

  const salt = config().chroplus.worldid.salt;

  const hash = createHash("sha256");
  const hashedId = hash.update(subject + salt).digest("base64url");

  const token = await admin.auth().createCustomToken(hashedId);

  return token;
});
