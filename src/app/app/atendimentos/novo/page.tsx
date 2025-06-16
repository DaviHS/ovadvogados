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

  const [inspectionPoints, setInspectionPoints] = useState<InspectionPoint[]>([
    {
      id: "porta_dianteira_esq",
      name: "Portas da Cabine de passageiros dianteira esquerda",
      position: { top: "10%", left: "34%" },
      checked: false,
    },
    {
      id: "porta_dianteira_dir",
      name: "Portas da Cabine de passageiros dianteira direita",
      position: { top: "13%", left: "63%" },
      checked: false,
    },
    { id: "gpu", name: "Ground Power Unit (GPU)", position: { top: "3%", left: "90%" }, checked: false },
    { id: "acu", name: "Air Conditioning Unit (ACU)", position: { top: "22%", left: "14%" }, checked: false },
    
    { id: "porao_dianteiro", name: "Porta de porão dianteiro e painel de acesso", position: { top: "30%", left: "66%" }, checked: false },
    { id: "porta_traseira_esq", name: "Portas da Cabine de passageiros traseira esquerda", position: { top: "62%", left: "33%" }, checked: false },
    { id: "porta_traseira_dir", name: "Portas da Cabine de passageiros traseira direita", position: { top: "72%", left: "64%" }, checked: false },
    { id: "porao_traseiro", name: "Porta de porão traseiro e painel de acesso", position: { top: "66%", left: "67%" }, checked: false },
    { id: "qta", name: "Portinhola compartimento (QTA)", position: { top: "73.5%", left: "23%" }, checked: false },
    { id: "qtu", name: "Portinhola compartimento (QTU)", position: { top: "90%", left: "23%" }, checked: false },
    { id: "bulk_esquerdo", name: "Porta Bulk (esquerdo)", position: { top: "94%", left: "52%" }, checked: false },
    { id: "bulk_direito", name: "Porta Bulk (direito)", position: { top: "93%", left: "80%" }, checked: false },
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
    console.log("Complete handling data:", {
      formData,
      equipmentList,
      inspectionPoints,
      cargoHoldItems,
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
            <Link href="/app/atendimentos">
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