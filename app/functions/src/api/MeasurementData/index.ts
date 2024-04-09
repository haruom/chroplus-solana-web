import { Request, Response } from "express"
import { DecodedIdToken } from "firebase-admin/auth"
import { MeasurementData } from "../../models/MeasurementData"
import {
  MeasurementDataToBigQuery,
} from "../../services/measurement_data/MeasurementDataToBigQuery"
import { MetaData } from "../../models/MetaData"

const postMeasurementData = async (req: Request, res: Response) => {
  // console.log(JSON.stringify(req.body))
  const recievedAt = new Date()
  const rawMeasurementDataSet = req.body.measurement_data_set
  const rawMetaData = req.body.meta_data
  const userInfo: DecodedIdToken = req.body._user_info
  if (!rawMeasurementDataSet || !rawMetaData || !userInfo) {
    if (!rawMeasurementDataSet) {
      console.error("measurement_data_set is null")
    }
    if (!rawMetaData) {
      console.error("meta_data is null")
    }
    if (!userInfo) {
      console.error("_user_info is null")
    }
    return res.status(400).end()
  }

  // 重複チェック START

  // timestampをキーとして、その値がいくつ存在するかをカウントするオブジェクト
  const timestampCounts: any[] = [];

  // dataArrayをループして、timestampの値をカウントする
  rawMeasurementDataSet.forEach((data: any) => {
    const timestamp = data.device_timestamp;
    if (!timestampCounts[timestamp]) {
      timestampCounts[timestamp] = [];
    }
    timestampCounts[timestamp].push(data.first_packet_received_date);
  });

  // timestampCountsをループして、カウントが1より大きい場合はログに出力
  for (const timestamp in timestampCounts) {
    if (timestampCounts[timestamp].length > 1) {
      console.error(
        `[RAW]
        重複したtimestamp: ${timestamp})},
        カウント: ${timestampCounts[timestamp]}`
      );
    }
  }

  // 重複チェック END

  const measurementDataSet = rawMeasurementDataSet.map(
    (rawMeasurementData: any) => {
      return new MeasurementData(rawMeasurementData)
    }
  )
  const metaData = new MetaData(recievedAt, rawMetaData)
  const request = new MeasurementDataToBigQuery()
  try {
    await request.insert(
      userInfo.uid,
      measurementDataSet,
      metaData,
      req.body.expt_id
    )
    return res.status(201).json({
      success: [],
      failure: [],
    })
  } catch (error) {
    console.error(error)
    return res.status(400).end()
  }
}

export { postMeasurementData }
