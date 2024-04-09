import { BigQuery, Dataset } from "@google-cloud/bigquery"
import { MeasurementData } from "../../models/MeasurementData"
import { MetaData } from "../../models/MetaData"
import { BigQueryFormatter } from "./BigQueryFormatter"

class MeasurementDataToBigQuery {
  private bigQuery: BigQuery
  private dataset: Dataset

  constructor() {
    this.bigQuery = new BigQuery()
    this.dataset = this.bigQuery.dataset("xhro")
  }

  public async insert(
    uid: string,
    measurementDataSet: [MeasurementData],
    metaData: MetaData,
    experimentId?: string,
  ) {
    const accDataPromise =
      this.insertACCData(uid, measurementDataSet, experimentId)
    const eegDataPromise =
      this.insertEEGData(uid, measurementDataSet, experimentId)
    const optDataPromise =
      this.insertOPTData(uid, measurementDataSet, experimentId)
    const vitalDataPromise =
      this.insertVitalData(uid, measurementDataSet, experimentId)
    const metaDataPromise =
      this.insertMetaData(uid, measurementDataSet, metaData)
    await Promise.all([
      accDataPromise,
      eegDataPromise,
      optDataPromise,
      vitalDataPromise,
      metaDataPromise,
    ])
  }

  private insertACCData(
    uid: string,
    measurementDataSet: MeasurementData[],
    experimentId?: string,
  ): Promise<void> {
    // 25Hzのデータ
    const stepMillis = 1000 / 25
    const rows = measurementDataSet.map((measurementData) => {
      return measurementData.acc.map((accData, index) => {
        return BigQueryFormatter.accDataFormat(
          measurementData.macAddress,
          uid,
          accData,
          measurementData.timestamp,
          index * stepMillis,
          experimentId,
        )
      })
    }).flat()

    console.log(
      "[ACCData] LENGTH: " + rows.length + " " +
      "SIZE: " + JSON.stringify(rows).length / 1000 + "KB"
    )
    // this.checkTimestampDuplication("acc", rows);

    const table = this.dataset.table("acc")
    return new Promise((resolve, reject) => {
      table.insert(rows)
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  private insertEEGData(
    uid: string,
    measurementDataSet: MeasurementData[],
    experimentId?: string,
  ): Promise<void> {
    // 250Hzのデータ
    const stepMillis = 1000 / 250
    const rows = measurementDataSet.map((measurementData) => {
      return measurementData.eeg.map((eegData, index) => {
        return BigQueryFormatter.eegDataFormat(
          measurementData.macAddress,
          uid,
          eegData,
          measurementData.timestamp,
          index * stepMillis,
          experimentId,
        )
      })
    }).flat()

    console.log(
      "[EEGData] LENGTH: " + rows.length + " " +
      "SIZE: " + JSON.stringify(rows).length / 1000 + "KB"
    )
    // this.checkTimestampDuplication("eeg", rows);

    const table = this.dataset.table("eeg")
    return new Promise((resolve, reject) => {
      table.insert(rows)
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  private insertOPTData(
    uid: string,
    measurementDataSet: MeasurementData[],
    experimentId?: string,
  ): Promise<void> {
    // 50Hzのデータ
    const stepMillis = 1000 / 50
    const rows = measurementDataSet.map((measurementData) => {
      return measurementData.opt.map((eegData, index) => {
        return BigQueryFormatter.optDataFormat(
          measurementData.macAddress,
          uid,
          eegData,
          measurementData.timestamp,
          index * stepMillis,
          experimentId
        )
      })
    }).flat()

    console.log(
      "[OPTData] LENGTH: " + rows.length + " " +
      "SIZE: " + JSON.stringify(rows).length / 1000 + "KB"
    )
    // this.checkTimestampDuplication("opt", rows);

    const table = this.dataset.table("opt")
    return new Promise((resolve, reject) => {
      table.insert(rows)
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  private insertVitalData(
    uid: string,
    measurementDataSet: MeasurementData[],
    experimentId?: string,
  ): Promise<void> {
    const rows = measurementDataSet.map((measurementData) => {
      return BigQueryFormatter.vitalDataFormat(
        measurementData.macAddress,
        uid,
        measurementData,
        experimentId
      )
    })

    console.log(
      "[VitalData] LENGTH: " + rows.length + " " +
      "SIZE: " + JSON.stringify(rows).length / 1000 + "KB"
    )
    // this.checkTimestampDuplication("vital", rows);

    const table = this.dataset.table("vital")
    return new Promise((resolve, reject) => {
      table.insert(rows)
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  private insertMetaData(
    uid: string,
    measurementDataSet: MeasurementData[],
    metaData: MetaData,
    experimentId?: string,
  ): Promise<void> {
    const rows = measurementDataSet.map((measurementData) => {
      return BigQueryFormatter.metaDataFormat(
        measurementData.macAddress,
        uid,
        metaData,
        measurementData.timestamp,
        new Date(measurementData.header.time! * 1000),
        measurementData.firstPacketReceivedAt,
        experimentId,
      )
    })

    console.log(
      "[MetaData] LENGTH: " + rows.length + " " +
      "SIZE: " + JSON.stringify(rows).length / 1000 + "KB"
    )
    this.checkTimestampDuplication("meta", rows);

    const table = this.dataset.table("meta")
    return new Promise((resolve, reject) => {
      table.insert(rows)
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  private checkTimestampDuplication(table: string, rows: any[]) {
    // timestampをキーとして、その値がいくつ存在するかをカウントするオブジェクト
    const timestampCounts: any[] = [];

    // dataArrayをループして、timestampの値をカウントする
    rows.forEach((data) => {
      const timestamp = data.timestamp;
      timestampCounts[timestamp] = (timestampCounts[timestamp] || 0) + 1;
    });

    // timestampCountsをループして、カウントが1より大きい場合はログに出力
    for (const timestamp in timestampCounts) {
      if (timestampCounts[timestamp] > 1) {
        console.error(
          `[${table}]
          重複したtimestamp: ${new Date(parseInt(timestamp))},
          カウント: ${timestampCounts[timestamp]}`
        );
      }
    }
  }
}

export { MeasurementDataToBigQuery }
