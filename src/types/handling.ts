export interface EquipmentUsed {
  id: string
  equipment: string
  quantity: number
  startTime: string
  endTime: string
  ptm: string
  operator: string
  registration: string
}

export interface ChecklistItem {
  id: string
  category: string
  item: string
  checked: boolean
  hasIssue: boolean
  observation: string
}

export interface CargoHoldItem {
  id: string
  name: string
  checked: boolean
  notes: string
}

export interface InspectionPoint {
  id: string
  name: string
  position: { top: string; left: string }
  checked: boolean
}

export interface HandlingData {
  flightNumber: string
  aircraftRegistration: string
  timeCompleted: string
  date: string
  teamLeader: string
  collectionInfo: string
  client: string
  flightType: string
  base: string
  arrivalFlight: string
  departureFlight: string
  aircraftModel: string
  registration: string
  chocksOn: string
  releaseTime: string
  origin: string
  destination: string
  parkingPosition: string
  disembarkation: {
    cargoDoorOpen: string
    cargoDoorClose: string
    firstBaggage: string
    lastBaggage: string
    firstCargo: string
    lastCargo: string
    towingStart: string
    towingEnd: string
  }
  boarding: {
    cargoDoorOpen: string
    cargoDoorClose: string
    firstBaggage: string
    lastBaggage: string
    firstCargo: string
    lastCargo: string
    towingStart: string
    towingEnd: string
  }
  personnel: {
    wing: { quantity: string; startTime: string; endTime: string }
    qev: { quantity: string; startTime: string; endTime: string }
  }
  damageDetected: boolean
  damageDescription: string
  cancellationRequester: string
  cancellationReason: string
  responsibleName: string
  responsibleId: string
  representativeName: string
  representativeId: string
  generalNotes: string
}