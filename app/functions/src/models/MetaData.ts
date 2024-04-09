class MetaData {
  clientPlatform?: string
  clientAppId?: string
  clientModelName?: string
  clientOsVersion?: string
  clientAppVersion?: string
  xhroName?: string
  xhroUUID?: string
  xhroHardwareVersion?: string
  xhroFirmwareVersion?: string
  sentAt: Date
  recievedAt: Date
  measuredAt: Date
  clientReceivedAt: Date

  constructor(recievedAt: Date, obj?: any) {
    this.clientPlatform = obj.client_platform
    this.clientAppId = obj.client_app_id
    this.clientModelName = obj.client_model_name
    this.clientOsVersion = obj.client_os_version
    this.clientAppVersion = obj.client_app_version
    this.xhroName = obj.xhro_device_name
    this.xhroUUID = obj.xhro_device_uuid
    this.xhroHardwareVersion = obj.xhro_hardware_version
    this.xhroFirmwareVersion = obj.xhro_firmware_version
    this.sentAt = new Date(obj.sent_at)
    this.recievedAt = recievedAt
    this.measuredAt = new Date(obj.measured_at)
    this.clientReceivedAt = new Date(obj.client_received_at)
  }
}

export { MetaData }
