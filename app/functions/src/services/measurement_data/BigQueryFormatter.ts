import {
  MeasurementData,
  MeasurementDataACC,
  MeasurementDataEEG,
  MeasurementDataOPT,
} from "../../models/MeasurementData"
import { MetaData } from "../../models/MetaData"

export class BigQueryFormatter {
  public static accDataFormat(
    deviceId: string,
    uid: string,
    accData: MeasurementDataACC,
    timestamp: Date,
    millis: number,
    experimentId?: string,
  ): any {
    return {
      device_Id: deviceId,
      expt_id: experimentId,
      uid: uid,
      timestamp: timestamp.getTime(),
      millis: millis,
      x: accData.x,
      y: accData.y,
      z: accData.z,
    }
  }

  public static eegDataFormat(
    deviceId: string,
    uid: string,
    eegData: MeasurementDataEEG,
    timestamp: Date,
    millis: number,
    experimentId?: string,
  ): any {
    return {
      device_Id: deviceId,
      expt_id: experimentId,
      uid: uid,
      timestamp: timestamp.getTime(),
      millis: millis,
      ch1: eegData.ch1,
      ch2: eegData.ch2,
      ch3: eegData.ch3,
      ch4: eegData.ch4,
    }
  }

  public static vitalDataFormat(
    deviceId: string,
    uid: string,
    measurementData: MeasurementData,
    experimentId?: string,
  ): any {
    return {
      device_Id: deviceId,
      expt_id: experimentId,
      uid: uid,
      timestamp: measurementData.timestamp.getTime(),
      eeg_valid: measurementData.header.flagEEG,
      opt_valid: measurementData.header.flagOPT,
      bz_valid: measurementData.header.flagBZ,
      acc_valid: measurementData.header.flagACC,
      fg_valid: measurementData.header.flagFG,
      temp_valid: measurementData.header.flagTEMP,
      mag: measurementData.magnitude,
      phase: measurementData.phase,
      charge: measurementData.isCharging,
      temp: measurementData.temperature,
      loff_ch1: measurementData.loff.ch1,
      loff_ch2: measurementData.loff.ch2,
      loff_ch3: measurementData.loff.ch3,
      loff_ch4: measurementData.loff.ch4,
    }
  }

  public static optDataFormat(
    deviceId: string,
    uid: string,
    optData: MeasurementDataOPT,
    timestamp: Date,
    millis: number,
    experimentId?: string,
  ): any {
    return {
      device_Id: deviceId,
      expt_id: experimentId,
      uid: uid,
      timestamp: timestamp.getTime(),
      millis: millis,
      ch1: optData.ch1,
      ch2: optData.ch2,
      ch3: optData.ch3,
      ch4: optData.ch4,
    }
  }

  public static metaDataFormat(
    deviceId: string,
    uid: string,
    metaData: MetaData,
    timestamp: Date,
    measuredAt: Date,
    clientReceivedAt: Date,
    experimentId?: string,
  ): any {
    return {
      device_Id: deviceId,
      expt_id: experimentId,
      uid: uid,
      timestamp: timestamp.getTime(),
      client_platform: metaData.clientPlatform,
      client_app_id: metaData.clientAppId,
      client_model_name: metaData.clientModelName,
      client_os_ver: metaData.clientOsVersion,
      client_app_ver: metaData.clientAppVersion,
      xhro_name: metaData.xhroName,
      xhro_uuid: metaData.xhroUUID,
      xhro_hardware_ver: metaData.xhroHardwareVersion,
      xhro_firmware_ver: metaData.xhroFirmwareVersion,
      measured_at: measuredAt.getTime(),
      client_sent_at: metaData.sentAt.getTime(),
      server_received_at: metaData.recievedAt.getTime(),
      client_received_at: clientReceivedAt.getTime(),
      created_at: (new Date()).getTime(),
    }
  }
}
