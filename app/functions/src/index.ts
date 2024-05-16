import * as admin from "firebase-admin"

const serviceAccount = require("../env/serviceAccountKey.json")
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

exports.api = require("./api/index")
exports.setThePriceOfDailyXHROData =
  require("./triggers/firestore/setThePriceOfDailyXHROData")
exports.worldIdLogin = require("./oncall/worldIdLogin")
