class MeasurementData {
  macAddress: string
  header: MeasurementDataHeader
  temperature?: number
  acc: [MeasurementDataACC]
  battery?: number
  isCharging?: boolean
  magnitude?: number
  phase?: number
  eeg: [MeasurementDataEEG]
  opt: [MeasurementDataOPT]
  loff: MeasurementDataLOFF
  timestamp: Date
  firstPacketReceivedAt: Date

  constructor(obj?: any) {
    this.macAddress = obj.mac_address
    this.header = new MeasurementDataHeader(obj.header)
    this.temperature = obj.temperature
    this.acc = obj.acc.map((acc: any) => new MeasurementDataACC(acc))
    this.battery = obj.battery
    this.isCharging = obj.is_charging
    this.magnitude = obj.magnitude
    this.phase = obj.phase
    this.eeg = obj.eeg.map((eeg: any) => new MeasurementDataEEG(eeg))
    this.opt = obj.opt.map((opt: any) => new MeasurementDataOPT(opt))
    this.loff = new MeasurementDataLOFF(obj.loff)
    this.timestamp = new Date(obj.device_timestamp)
    this.firstPacketReceivedAt = new Date(obj.first_packet_received_date)
  }
}

class MeasurementDataHeader {
  frameSeqNo?: number
  time?: number
  flagEEG?: boolean
  flagOPT?: boolean
  flagBZ?: boolean
  flagACC?: boolean
  flagFG?: boolean
  flagTEMP?: boolean

  constructor(obj?: any) {
    this.frameSeqNo = obj.frame_seq_no
    this.time = obj.time
    this.flagEEG = obj.flag_eeg
    this.flagOPT = obj.flag_opt
    this.flagBZ = obj.flag_bz
    this.flagACC = obj.flag_acc
    this.flagFG = obj.flag_fg
    this.flagTEMP = obj.flag_temp
  }
}

class MeasurementDataACC {
  x?: number
  y?: number
  z?: number

  constructor(obj?: any) {
    this.x = obj.x
    this.y = obj.y
    this.z = obj.z
  }
}

class MeasurementDataEEG {
  ch1?: number
  ch2?: number
  ch3?: number
  ch4?: number

  constructor(obj?: any) {
    this.ch1 = obj.ch1
    this.ch2 = obj.ch2
    this.ch3 = obj.ch3
    this.ch4 = obj.ch4
  }
}

class MeasurementDataOPT {
  ch1?: number
  ch2?: number
  ch3?: number
  ch4?: number

  constructor(obj?: any) {
    this.ch1 = obj.ch1
    this.ch2 = obj.ch2
    this.ch3 = obj.ch3
    this.ch4 = obj.ch4
  }
}

class MeasurementDataLOFF {
  ch1?: boolean
  ch2?: boolean
  ch3?: boolean
  ch4?: boolean

  constructor(obj?: any) {
    this.ch1 = obj.ch1
    this.ch2 = obj.ch2
    this.ch3 = obj.ch3
    this.ch4 = obj.ch4
  }
}

export {
  MeasurementData,
  MeasurementDataHeader,
  MeasurementDataACC,
  MeasurementDataEEG,
  MeasurementDataOPT,
  MeasurementDataLOFF,
}
