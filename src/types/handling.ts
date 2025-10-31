export interface HandlingData {
  // Flight Identification
  flightNumber: string;
  aircraftRegistration: string;
  timeCompleted: string;
  date: string;
  teamLeader: string;
  collectionInfo?: string;
  client: string;
  flightType: "arrival" | "departure";
  base: string;
  
  // Flight Data
  arrivalFlight?: string;
  departureFlight?: string;
  aircraftModel?: string;
  registration?: string;
  chocksOn?: string;
  releaseTime?: string;
  origin?: string;
  destination?: string;
  parkingPosition?: string;
  
  // Complex data
  disembarkation: {
    cargoDoorOpen?: string;
    cargoDoorClose?: string;
    firstBaggage?: string;
    lastBaggage?: string;
    firstCargo?: string;
    lastCargo?: string;
    towingStart?: string;
    towingEnd?: string;
  };
  boarding: {
    cargoDoorOpen?: string;
    cargoDoorClose?: string;
    firstBaggage?: string;
    lastBaggage?: string;
    firstCargo?: string;
    lastCargo?: string;
    towingStart?: string;
    towingEnd?: string;
  };
  personnel: {
    wing: { quantity?: string; startTime?: string; endTime?: string };
    qev: { quantity?: string; startTime?: string; endTime?: string };
  };
  equipmentList?: EquipmentUsed[];
  inspectionPoints?: InspectionPoint[];
  cargoHoldItems?: CargoHoldItem[];
  
  // Damage Report
  damageDetected: boolean;
  damageDescription?: string;
  damagePhotos?: File[] | string[];
  
  // Cancellation
  cancellationRequester?: string;
  cancellationReason?: string;
  
  // Signature
  responsibleName?: string;
  responsibleId?: string;
  representativeName?: string;
  representativeId?: string;
  
  // General Notes
  generalNotes?: string;
}

export interface EquipmentUsed {
  id: string;
  equipment: string;
  quantity: number;
  startTime?: string;
  endTime?: string;
  ptm?: string;
  operator?: string;
  registration?: string;
}

export interface InspectionPoint {
  id: string;
  name: string;
  position: { top: string; left: string };
  checked: boolean;
}

export interface CargoHoldItem {
  id: string;
  name: string;
  checked: boolean;
  notes?: string;
}