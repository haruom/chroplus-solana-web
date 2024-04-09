import * as admin from "firebase-admin"
import * as functions from "firebase-functions"
import * as express from "express"
import * as bearerToken from "express-bearer-token"
import * as cors from "cors"
import {postMeasurementData} from "./MeasurementData/index"
import {testRequest} from "./test/index"

const app = express()

app.use(cors())

app.use(async (req, res, next) => {
  if (req.method === "OPTIONS") {
    res.status(200).end()
    return
  }
  next()
})

// Admin user check
app.use(bearerToken())
app.use(async (req, res, next) => {
  console.log("req.path", req.path)
  if (req.method === "OPTIONS") {
    res.status(200).end()
    return
  }
  if (req.path === "/test") {
    next()
    return
  }
  const idToken = req.token;
  if (!idToken) {
    res.status(401).end()
    return
  }
  const decodedToken = await admin.auth().verifyIdToken(idToken!)
  req.body["_user_info"] = decodedToken
  if (!decodedToken) {
    res.status(401).end()
    return
  }
  next()
})

const router = express.Router()
app.use(router)
router.post("/measurement_data", postMeasurementData)
router.post("/test", testRequest)

module.exports = functions.runWith({
  timeoutSeconds: 540,
  maxInstances: 3000,
}).https.onRequest(app)
