"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  FlightIdentification,
  FlightData,
  OperationTimings,
  Disembarkartion,
  Boarding,
  Personnel,
  Equipment,
  AircraftDiagram,
  CargoHoldInspection,
  DamageReport,
  Cancellation,
  Signature,
  GeneralNotes,
} from "@/components/form/handling"
import { 
  CargoHoldItem, 
  ChecklistItem, 
  EquipmentUsed, 
  HandlingData, 
  InspectionPoint 
} from "@/types/handling"

const initialFormData: HandlingData = {
  flightNumber: "",
  aircraftRegistration: "",
  timeCompleted: "",
  date: "",
  teamLeader: "",
  collectionInfo: "",
  client: "",
  flightType: "arrival",
  base: "",
  arrivalFlight: "",
  departureFlight: "",
  aircraftModel: "",
  registration: "",
  chocksOn: "",
  releaseTime: "",
  origin: "",
  destination: "",
  parkingPosition: "Finger",
  disembarkation: {
    cargoDoorOpen: "",
    cargoDoorClose: "",
    firstBaggage: "",
    lastBaggage: "",
    firstCargo: "",
    lastCargo: "",
    towingStart: "",
    towingEnd: "",
  },
  boarding: {
    cargoDoorOpen: "",
    cargoDoorClose: "",
    firstBaggage: "",
    lastBaggage: "",
    firstCargo: "",
    lastCargo: "",
    towingStart: "",
    towingEnd: "",
  },
  personnel: {
    wing: { quantity: "", startTime: "", endTime: "" },
    qev: { quantity: "", startTime: "", endTime: "" },
  },
  damageDetected: false,
  damageDescription: "",
  cancellationRequester: "",
  cancellationReason: "",
  responsibleName: "",
  responsibleId: "",
  representativeName: "",
  representativeId: "",
  generalNotes: "",
}

export default function NewHandlingPage() {
  const [formData, setFormData] = useState<HandlingData>(initialFormData)
  const [equipmentList, setEquipmentList] = useState<EquipmentUsed[]>([])

  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: "1",
      category: "Fuselagem",
      item: "Verificar danos na fuselagem",
      checked: false,
      hasIssue: false,
      observation: "",
    },
    {
      id: "2",
      category: "Fuselagem",
      item: "Verificar portas e janelas",
      checked: false,
      hasIssue: false,
      observation: "",
    },
    {
      id: "3",
      category: "Asas",
      item: "Verificar superfície das asas",
      checked: false,
      hasIssue: false,
      observation: "",
    },
    { id: "4", category: "Asas", item: "Verificar flaps e ailerons", checked: false, hasIssue: false, observation: "" },
    {
      id: "5",
      category: "Trem de Pouso",
      item: "Verificar pneus e rodas",
      checked: false,
      hasIssue: false,
      observation: "",
    },
    { id: "6", category: "Trem de Pouso", item: "Verificar freios", checked: false, hasIssue: false, observation: "" },
    { id: "7", category: "Motor", item: "Verificar entrada de ar", checked: false, hasIssue: false, observation: "" },
    { id: "8", category: "Motor", item: "Verificar vazamentos", checked: false, hasIssue: false, observation: "" },
    {
      id: "9",
      category: "Cauda",
      item: "Verificar superfícies de controle",
      checked: false,
      hasIssue: false,
      observation: "",
    },
    { id: "10", category: "Cauda", item: "Verificar antenas", checked: false, hasIssue: false, observation: "" },
  ])

  // Pontos de inspeção no diagrama da aeronave
  const [inspectionPoints, setInspectionPoints] = useState<InspectionPoint[]>([
    {
      id: "porta_dianteira_esq",
      name: "Porta dianteira esquerda",
      position: { top: "30%", left: "25%" },
      checked: false,
    },
    {
      id: "porta_dianteira_dir",
      name: "Porta dianteira direita",
      position: { top: "30%", left: "75%" },
      checked: false,
    },
    { id: "porta_traseira_esq", name: "Porta traseira esquerda", position: { top: "70%", left: "25%" }, checked: false },
    { id: "porta_traseira_dir", name: "Porta traseira direita", position: { top: "70%", left: "75%" }, checked: false },
    { id: "gpu", name: "Ground Power Unit (GPU)", position: { top: "40%", left: "15%" }, checked: false },
    { id: "acu", name: "Air Conditioning Unit (ACU)", position: { top: "50%", left: "15%" }, checked: false },
    { id: "porao_dianteiro", name: "Porão dianteiro", position: { top: "40%", left: "50%" }, checked: false },
    { id: "porao_traseiro", name: "Porão traseiro", position: { top: "60%", left: "50%" }, checked: false },
    { id: "qta", name: "Compartimento QTA (potável)", position: { top: "55%", left: "20%" }, checked: false },
    { id: "qtu", name: "Compartimento QTU (dejetos)", position: { top: "55%", left: "80%" }, checked: false },
    { id: "bulk_esquerdo", name: "Porta Bulk (esquerdo)", position: { top: "80%", left: "30%" }, checked: false },
    { id: "bulk_direito", name: "Porta Bulk (direito)", position: { top: "80%", left: "70%" }, checked: false },
  ])

  const [cargoHoldItems, setCargoHoldItems] = useState<CargoHoldItem[]>([
    { id: "piso", name: "Piso", checked: false, notes: "" },
    { id: "teto", name: "Teto", checked: false, notes: "" },
    { id: "paredes", name: "Paredes laterais", checked: false, notes: "" },
    { id: "travas", name: "Travas", checked: false, notes: "" },
    { id: "redes", name: "Redes", checked: false, notes: "" },
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const issuesCount = checklist.filter((item) => item.hasIssue).length
    console.log("Complete handling data:", {
      formData,
      equipmentList,
      checklist,
      inspectionPoints,
      cargoHoldItems,
      issuesCount,
    })
    alert("Handling and inspection recorded successfully!")
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [section, field] = name.split(".") as [keyof HandlingData, string]
      
      setFormData((prev) => {
        const sectionData = prev[section]
        if (typeof sectionData === "object" && sectionData !== null) {
          return {
            ...prev,
            [section]: {
              ...sectionData,
              [field]: value,
            },
          }
        }
        return prev
      })
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FlightIdentification formData={formData} handleChange={handleChange} />
          <FlightData formData={formData} handleChange={handleChange} />
          <OperationTimings formData={formData} handleChange={handleChange} />
          <Disembarkartion formData={formData} handleChange={handleChange} />
          <Boarding formData={formData} handleChange={handleChange} />
          <Personnel formData={formData} handleChange={handleChange} />
          
          <Equipment 
            equipmentList={equipmentList}
            setEquipmentList={setEquipmentList}
          />
          
          <AircraftDiagram 
            inspectionPoints={inspectionPoints}
            setInspectionPoints={setInspectionPoints}
          />
          
          <CargoHoldInspection 
            cargoHoldItems={cargoHoldItems}
            setCargoHoldItems={setCargoHoldItems}
          />
          
          <DamageReport 
            formData={formData}
            setFormData={setFormData}
          />
          
          <Cancellation 
            formData={formData}
            handleChange={handleChange}
          />
          
          <Signature 
            formData={formData}
            handleChange={handleChange}
          />
          
          <GeneralNotes 
            formData={formData}
            handleChange={handleChange}
          />

          <div className="flex justify-end gap-4 pt-6">
            <Link href="/app/handlings">
              <Button 
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-300 border-red-300 hover:border-red-400 transition-colors"
              >
                Cancelar
              </Button>
            </Link>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}