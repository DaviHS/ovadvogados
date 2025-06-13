"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Save, Plus, Trash2, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface EquipamentoUtilizado {
  id: string
  equipamento: string
  qtd: number
  inicio: string
  termino: string
  ptm: string
  operador: string
  matricula: string
}

interface ChecklistItem {
  id: string
  category: string
  item: string
  checked: boolean
  hasIssue: boolean
  observation: string
}

interface PoraoInspecaoItem {
  id: string
  nome: string
  checked: boolean
  observacao: string
}

interface AeronaveCheckpoint {
  id: string
  nome: string
  posicao: { top: string; left: string }
  checked: boolean
}

export default function NovoAtendimentoPage() {
  const [formData, setFormData] = useState({
    // 🛫 Identificação do voo
    numeroVoo: "",
    prefixoAeronave: "",
    horaRealizada: "",
    data: "",
    nomeLider: "",
    coleta: "",
    cliente: "",
    tipoVoo: "chegada", // chegada ou partida

    // 1. Identificação do Atendimento
    base: "",
    vooChegada: "",
    vooSaida: "",
    modeloAeronave: "",
    prefixo: "",
    calco: "",
    liberacao: "",

    // 2. Dados do Voo
    rotaOrigem: "",
    rotaDestino: "",
    posicao: "Finger",

    // 3. Desembarque / Descarregamento
    desembarque: {
      aberturaPorao: "",
      fechamentoPorao: "",
      primeiraBagagem: "",
      ultimaBagagem: "",
      primeiraCarga: "",
      ultimaCarga: "",
      inicioReboque: "",
      terminoReboque: "",
    },

    // 4. Embarque / Carregamento
    embarque: {
      aberturaPorao: "",
      fechamentoPorao: "",
      primeiraBagagem: "",
      ultimaBagagem: "",
      primeiraCarga: "",
      ultimaCarga: "",
      inicioReboque: "",
      terminoReboque: "",
    },

    // 5. Efetivos
    efetivos: {
      asa: { qtd: "", inicio: "", termino: "" },
      qev: { qtd: "", inicio: "", termino: "" },
    },

    // 6. Avaria na Aeronave
    avariaDetectada: false,
    avariaDescricao: "",

    // 7. Dados para Cancelamento
    cancelamentoSolicitante: "",
    cancelamentoMotivo: "",

    // 9. Conferência e Assinatura
    responsavelNome: "",
    responsavelMatricula: "",
    representanteNome: "",
    representanteMatricula: "",

    // Observações gerais
    generalObservations: "",
  })

  const [equipamentos, setEquipamentos] = useState<EquipamentoUtilizado[]>([])

  // Checklist de inspeção walkaround
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
  const [aeronaveCheckpoints, setAeronaveCheckpoints] = useState<AeronaveCheckpoint[]>([
    {
      id: "porta_dianteira_esq",
      nome: "Porta dianteira esquerda",
      posicao: { top: "30%", left: "25%" },
      checked: false,
    },
    {
      id: "porta_dianteira_dir",
      nome: "Porta dianteira direita",
      posicao: { top: "30%", left: "75%" },
      checked: false,
    },
    { id: "porta_traseira_esq", nome: "Porta traseira esquerda", posicao: { top: "70%", left: "25%" }, checked: false },
    { id: "porta_traseira_dir", nome: "Porta traseira direita", posicao: { top: "70%", left: "75%" }, checked: false },
    { id: "gpu", nome: "Ground Power Unit (GPU)", posicao: { top: "40%", left: "15%" }, checked: false },
    { id: "acu", nome: "Air Conditioning Unit (ACU)", posicao: { top: "50%", left: "15%" }, checked: false },
    { id: "porao_dianteiro", nome: "Porão dianteiro", posicao: { top: "40%", left: "50%" }, checked: false },
    { id: "porao_traseiro", nome: "Porão traseiro", posicao: { top: "60%", left: "50%" }, checked: false },
    { id: "qta", nome: "Compartimento QTA (potável)", posicao: { top: "55%", left: "20%" }, checked: false },
    { id: "qtu", nome: "Compartimento QTU (dejetos)", posicao: { top: "55%", left: "80%" }, checked: false },
    { id: "bulk_esquerdo", nome: "Porta Bulk (esquerdo)", posicao: { top: "80%", left: "30%" }, checked: false },
    { id: "bulk_direito", nome: "Porta Bulk (direito)", posicao: { top: "80%", left: "70%" }, checked: false },
  ])

  // Inspeção interna de porão
  const [poraoInspecao, setPoraoInspecao] = useState<PoraoInspecaoItem[]>([
    { id: "piso", nome: "Piso", checked: false, observacao: "" },
    { id: "teto", nome: "Teto", checked: false, observacao: "" },
    { id: "paredes", nome: "Paredes laterais", checked: false, observacao: "" },
    { id: "travas", nome: "Travas", checked: false, observacao: "" },
    { id: "redes", nome: "Redes", checked: false, observacao: "" },
  ])

  const equipamentosDisponiveis = [
    "Ar Condicionado (Remoto)",
    "ASU/PU",
    "Barra de Reboque",
    "Carreta",
    "Dolly",
    "Escada Motorizada",
    "Escada Rebocável",
    "Esteira Motorizada",
    "GPU (Finger/Remota)",
    "Loader (Lower/Main Deck)",
    "QTA - Água Potável",
    "Reboque",
    "Trator",
    "Viatura - Van",
    "Empilhadeira",
    "Extintor",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const issuesCount = checklist.filter((item) => item.hasIssue).length
    console.log("Dados do atendimento completo:", {
      formData,
      equipamentos,
      checklist,
      aeronaveCheckpoints,
      poraoInspecao,
      issuesCount,
    })
    alert("Atendimento e inspeção registrados com sucesso!")
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [section, field] = name.split(".") as [keyof typeof formData, string]

      setFormData((prev) => {
        const sectionData = prev[section]

        // Verifica se é um objeto
        if (typeof sectionData === "object" && sectionData !== null) {
          return {
            ...prev,
            [section]: {
              ...sectionData,
              [field]: value,
            },
          }
        }

        console.warn(`Seção "${section}" não é um objeto válido no formData.`)
        return prev
      })
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const adicionarEquipamento = () => {
    const novoEquipamento: EquipamentoUtilizado = {
      id: Date.now().toString(),
      equipamento: "",
      qtd: 0,
      inicio: "",
      termino: "",
      ptm: "",
      operador: "",
      matricula: "",
    }
    setEquipamentos([...equipamentos, novoEquipamento])
  }

  const removerEquipamento = (id: string) => {
    setEquipamentos(equipamentos.filter((eq) => eq.id !== id))
  }

  const atualizarEquipamento = (id: string, field: keyof EquipamentoUtilizado, value: string | number) => {
    setEquipamentos(equipamentos.map((eq) => (eq.id === id ? { ...eq, [field]: value } : eq)))
  }

  const handleChecklistChange = (id: string, field: keyof ChecklistItem, value: boolean | string) => {
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const handleAeronaveCheckpointChange = (id: string, checked: boolean) => {
    setAeronaveCheckpoints((prev) => prev.map((item) => (item.id === id ? { ...item, checked } : item)))
  }

  const handlePoraoInspecaoChange = (id: string, field: "checked" | "observacao", value: boolean | string) => {
    setPoraoInspecao((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const groupedChecklist = checklist.reduce<Record<string, ChecklistItem[]>>((acc, item) => {
    const category = item.category as string
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {})

  const totalIssues = checklist.filter((item) => item.hasIssue).length
  const completedItems = checklist.filter((item) => item.checked).length
  const totalItems = checklist.length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link href="/app/atendimentos">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Novo Atendimento e Inspeção</h1>
              <p className="text-gray-600">Registre um atendimento completo com inspeção walkaround</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 🛫 Identificação do voo */}
          <Card>
            <CardHeader>
              <CardTitle>🛫 Identificação do voo</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="numeroVoo">Nº Voo *</Label>
                <Input
                  id="numeroVoo"
                  name="numeroVoo"
                  value={formData.numeroVoo}
                  onChange={handleChange}
                  placeholder="Ex: JJ3001"
                  required
                />
              </div>
              <div>
                <Label htmlFor="prefixoAeronave">Prefixo da Aeronave *</Label>
                <Input
                  id="prefixoAeronave"
                  name="prefixoAeronave"
                  value={formData.prefixoAeronave}
                  onChange={handleChange}
                  placeholder="Ex: PR-ABC"
                  required
                />
              </div>
              <div>
                <Label htmlFor="horaRealizada">Hora realizada *</Label>
                <Input
                  id="horaRealizada"
                  name="horaRealizada"
                  type="time"
                  value={formData.horaRealizada}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="data">Data *</Label>
                <Input id="data" name="data" type="date" value={formData.data} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="nomeLider">Nome do Líder *</Label>
                <Input
                  id="nomeLider"
                  name="nomeLider"
                  value={formData.nomeLider}
                  onChange={handleChange}
                  placeholder="Nome completo"
                  required
                />
              </div>
              <div>
                <Label htmlFor="coleta">Coleta</Label>
                <Input
                  id="coleta"
                  name="coleta"
                  value={formData.coleta}
                  onChange={handleChange}
                  placeholder="Informações de coleta"
                />
              </div>
              <div>
                <Label htmlFor="cliente">Cliente *</Label>
                <Input
                  id="cliente"
                  name="cliente"
                  value={formData.cliente}
                  onChange={handleChange}
                  placeholder="Nome da empresa"
                  required
                />
              </div>
              <div>
                <Label htmlFor="base">Base *</Label>
                <Input
                  id="base"
                  name="base"
                  value={formData.base}
                  onChange={handleChange}
                  placeholder="Ex: GRU, CGH, BSB"
                  required
                />
              </div>
              <div>
                <Label>Marcação de:</Label>
                <RadioGroup
                  value={formData.tipoVoo}
                  onValueChange={(value) => setFormData({ ...formData, tipoVoo: value })}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="chegada" id="chegada" />
                    <Label htmlFor="chegada">Chegada</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="partida" id="partida" />
                    <Label htmlFor="partida">Partida</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* 2. Dados do Voo */}
          <Card>
            <CardHeader>
              <CardTitle>2. Dados do Voo</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="rotaOrigem">Rota - Origem</Label>
                <Input
                  id="rotaOrigem"
                  name="rotaOrigem"
                  value={formData.rotaOrigem}
                  onChange={handleChange}
                  placeholder="Ex: GRU"
                />
              </div>
              <div>
                <Label htmlFor="rotaDestino">Rota - Destino</Label>
                <Input
                  id="rotaDestino"
                  name="rotaDestino"
                  value={formData.rotaDestino}
                  onChange={handleChange}
                  placeholder="Ex: CGH"
                />
              </div>
              <div>
                <Label htmlFor="posicao">Posição *</Label>
                <select
                  id="posicao"
                  name="posicao"
                  value={formData.posicao}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Finger">Finger</option>
                  <option value="Remota">Remota</option>
                </select>
              </div>
              <div>
                <Label htmlFor="modeloAeronave">Modelo da Aeronave</Label>
                <Input
                  id="modeloAeronave"
                  name="modeloAeronave"
                  value={formData.modeloAeronave}
                  onChange={handleChange}
                  placeholder="Ex: A320, B737"
                />
              </div>
            </CardContent>
          </Card>

          {/* Horários de Operação */}
          <Card>
            <CardHeader>
              <CardTitle>3. Horários de Operação</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="calco">Calço</Label>
                <Input id="calco" name="calco" type="time" value={formData.calco} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="liberacao">Liberação</Label>
                <Input id="liberacao" name="liberacao" type="time" value={formData.liberacao} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="vooChegada">Voo Chegada</Label>
                <Input
                  id="vooChegada"
                  name="vooChegada"
                  value={formData.vooChegada}
                  onChange={handleChange}
                  placeholder="Ex: JJ3001"
                />
              </div>
              <div>
                <Label htmlFor="vooSaida">Voo Saída</Label>
                <Input
                  id="vooSaida"
                  name="vooSaida"
                  value={formData.vooSaida}
                  onChange={handleChange}
                  placeholder="Ex: JJ3002"
                />
              </div>
            </CardContent>
          </Card>

          {/* 4. Desembarque / Descarregamento */}
          <Card>
            <CardHeader>
              <CardTitle>4. Desembarque / Descarregamento</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="desembarque.aberturaPorao">Abertura do Porão</Label>
                <Input
                  id="desembarque.aberturaPorao"
                  name="desembarque.aberturaPorao"
                  type="time"
                  value={formData.desembarque.aberturaPorao}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="desembarque.fechamentoPorao">Fechamento do Porão</Label>
                <Input
                  id="desembarque.fechamentoPorao"
                  name="desembarque.fechamentoPorao"
                  type="time"
                  value={formData.desembarque.fechamentoPorao}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="desembarque.primeiraBagagem">1ª Bagagem</Label>
                <Input
                  id="desembarque.primeiraBagagem"
                  name="desembarque.primeiraBagagem"
                  type="time"
                  value={formData.desembarque.primeiraBagagem}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="desembarque.ultimaBagagem">Última Bagagem</Label>
                <Input
                  id="desembarque.ultimaBagagem"
                  name="desembarque.ultimaBagagem"
                  type="time"
                  value={formData.desembarque.ultimaBagagem}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="desembarque.primeiraCarga">1ª Carga</Label>
                <Input
                  id="desembarque.primeiraCarga"
                  name="desembarque.primeiraCarga"
                  type="time"
                  value={formData.desembarque.primeiraCarga}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="desembarque.ultimaCarga">Última Carga</Label>
                <Input
                  id="desembarque.ultimaCarga"
                  name="desembarque.ultimaCarga"
                  type="time"
                  value={formData.desembarque.ultimaCarga}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="desembarque.inicioReboque">Início do Reboque</Label>
                <Input
                  id="desembarque.inicioReboque"
                  name="desembarque.inicioReboque"
                  type="time"
                  value={formData.desembarque.inicioReboque}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="desembarque.terminoReboque">Término do Reboque</Label>
                <Input
                  id="desembarque.terminoReboque"
                  name="desembarque.terminoReboque"
                  type="time"
                  value={formData.desembarque.terminoReboque}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* 5. Embarque / Carregamento */}
          <Card>
            <CardHeader>
              <CardTitle>5. Embarque / Carregamento</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="embarque.aberturaPorao">Abertura do Porão</Label>
                <Input
                  id="embarque.aberturaPorao"
                  name="embarque.aberturaPorao"
                  type="time"
                  value={formData.embarque.aberturaPorao}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="embarque.fechamentoPorao">Fechamento do Porão</Label>
                <Input
                  id="embarque.fechamentoPorao"
                  name="embarque.fechamentoPorao"
                  type="time"
                  value={formData.embarque.fechamentoPorao}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="embarque.primeiraBagagem">1ª Bagagem</Label>
                <Input
                  id="embarque.primeiraBagagem"
                  name="embarque.primeiraBagagem"
                  type="time"
                  value={formData.embarque.primeiraBagagem}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="embarque.ultimaBagagem">Última Bagagem</Label>
                <Input
                  id="embarque.ultimaBagagem"
                  name="embarque.ultimaBagagem"
                  type="time"
                  value={formData.embarque.ultimaBagagem}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="embarque.primeiraCarga">1ª Carga</Label>
                <Input
                  id="embarque.primeiraCarga"
                  name="embarque.primeiraCarga"
                  type="time"
                  value={formData.embarque.primeiraCarga}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="embarque.ultimaCarga">Última Carga</Label>
                <Input
                  id="embarque.ultimaCarga"
                  name="embarque.ultimaCarga"
                  type="time"
                  value={formData.embarque.ultimaCarga}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="embarque.inicioReboque">Início do Reboque</Label>
                <Input
                  id="embarque.inicioReboque"
                  name="embarque.inicioReboque"
                  type="time"
                  value={formData.embarque.inicioReboque}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="embarque.terminoReboque">Término do Reboque</Label>
                <Input
                  id="embarque.terminoReboque"
                  name="embarque.terminoReboque"
                  type="time"
                  value={formData.embarque.terminoReboque}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* 6. Efetivos */}
          <Card>
            <CardHeader>
              <CardTitle>6. Efetivos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">ASA</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="efetivos.asa.qtd">Qtd</Label>
                      <Input
                        id="efetivos.asa.qtd"
                        name="efetivos.asa.qtd"
                        type="number"
                        value={formData.efetivos.asa.qtd}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="efetivos.asa.inicio">Início</Label>
                      <Input
                        id="efetivos.asa.inicio"
                        name="efetivos.asa.inicio"
                        type="time"
                        value={formData.efetivos.asa.inicio}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="efetivos.asa.termino">Término</Label>
                      <Input
                        id="efetivos.asa.termino"
                        name="efetivos.asa.termino"
                        type="time"
                        value={formData.efetivos.asa.termino}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">QEV</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="efetivos.qev.qtd">Qtd</Label>
                      <Input
                        id="efetivos.qev.qtd"
                        name="efetivos.qev.qtd"
                        type="number"
                        value={formData.efetivos.qev.qtd}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="efetivos.qev.inicio">Início</Label>
                      <Input
                        id="efetivos.qev.inicio"
                        name="efetivos.qev.inicio"
                        type="time"
                        value={formData.efetivos.qev.inicio}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="efetivos.qev.termino">Término</Label>
                      <Input
                        id="efetivos.qev.termino"
                        name="efetivos.qev.termino"
                        type="time"
                        value={formData.efetivos.qev.termino}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 7. Equipamentos Utilizados */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>7. Equipamentos Utilizados</CardTitle>
                <Button type="button" onClick={adicionarEquipamento} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Equipamento
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {equipamentos.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhum equipamento adicionado</p>
              ) : (
                <div className="space-y-4">
                  {equipamentos.map((eq) => (
                    <div key={eq.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                        <div>
                          <Label>Equipamento</Label>
                          <select
                            value={eq.equipamento}
                            onChange={(e) => atualizarEquipamento(eq.id, "equipamento", e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="">Selecione...</option>
                            {equipamentosDisponiveis.map((equipamento) => (
                              <option key={equipamento} value={equipamento}>
                                {equipamento}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label>Qtd</Label>
                          <Input
                            type="number"
                            value={eq.qtd}
                            onChange={(e) => atualizarEquipamento(eq.id, "qtd", Number.parseInt(e.target.value) || 0)}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label>Início</Label>
                          <Input
                            type="time"
                            value={eq.inicio}
                            onChange={(e) => atualizarEquipamento(eq.id, "inicio", e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label>Término</Label>
                          <Input
                            type="time"
                            value={eq.termino}
                            onChange={(e) => atualizarEquipamento(eq.id, "termino", e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label>PTM</Label>
                          <Input
                            value={eq.ptm}
                            onChange={(e) => atualizarEquipamento(eq.id, "ptm", e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label>Operador</Label>
                          <Input
                            value={eq.operador}
                            onChange={(e) => atualizarEquipamento(eq.id, "operador", e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removerEquipamento(eq.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Label>Matrícula (ORB)</Label>
                        <Input
                          value={eq.matricula}
                          onChange={(e) => atualizarEquipamento(eq.id, "matricula", e.target.value)}
                          className="text-sm"
                          placeholder="Matrícula do equipamento"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* ✈️ Diagrama da Aeronave */}
          <Card>
            <CardHeader>
              <CardTitle>✈️ Diagrama da Aeronave (vista superior)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-[400px] border-2 border-gray-300 rounded-lg bg-gray-50 mb-6">
                {/* Desenho simplificado da aeronave */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60%] h-[80%]">
                  {/* Fuselagem */}
                  <div className="absolute top-[10%] left-[20%] w-[60%] h-[80%] bg-gray-200 rounded-full"></div>

                  {/* Asas */}
                  <div className="absolute top-[40%] left-0 w-[100%] h-[20%] bg-gray-300"></div>

                  {/* Cauda */}
                  <div className="absolute top-[70%] left-[45%] w-[10%] h-[30%] bg-gray-300"></div>

                  {/* Estabilizadores horizontais */}
                  <div className="absolute top-[80%] left-[35%] w-[30%] h-[5%] bg-gray-300"></div>
                </div>

                {/* Pontos de inspeção */}
                {aeronaveCheckpoints.map((checkpoint) => (
                  <div
                    key={checkpoint.id}
                    className="absolute flex items-center justify-center"
                    style={{
                      top: checkpoint.posicao.top,
                      left: checkpoint.posicao.left,
                    }}
                  >
                    <div className="flex items-center space-x-1">
                      <Checkbox
                        id={`checkpoint-${checkpoint.id}`}
                        checked={checkpoint.checked}
                        onCheckedChange={(checked) => handleAeronaveCheckpointChange(checkpoint.id, checked as boolean)}
                      />
                      <span className="text-xs font-medium bg-white px-1 rounded border">
                        {checkpoint.nome.split(" ")[0]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {aeronaveCheckpoints.map((checkpoint) => (
                  <div key={checkpoint.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`list-${checkpoint.id}`}
                      checked={checkpoint.checked}
                      onCheckedChange={(checked) => handleAeronaveCheckpointChange(checkpoint.id, checked as boolean)}
                    />
                    <Label htmlFor={`list-${checkpoint.id}`}>{checkpoint.nome}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 🔍 Inspeção interna de porão */}
          <Card>
            <CardHeader>
              <CardTitle>🔍 Inspeção interna de porão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {poraoInspecao.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={`porao-${item.id}`}
                        checked={item.checked}
                        onCheckedChange={(checked) => handlePoraoInspecaoChange(item.id, "checked", checked as boolean)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={`porao-${item.id}`} className="font-medium">
                          {item.nome}
                        </Label>
                        <div className="mt-2">
                          <Textarea
                            placeholder={`Observações sobre ${item.nome.toLowerCase()}...`}
                            value={item.observacao}
                            onChange={(e) => handlePoraoInspecaoChange(item.id, "observacao", e.target.value)}
                            rows={2}
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Checklist de Inspeção Walkaround */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Checklist de Inspeção Walkaround</CardTitle>
                <div className="flex gap-4 text-sm">
                  <span className="text-blue-600">
                    Progresso: {completedItems}/{totalItems}
                  </span>
                  {totalIssues > 0 && (
                    <span className="text-red-600 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      {totalIssues} problema(s)
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(groupedChecklist).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">{category}</h3>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={item.checked}
                              onCheckedChange={(checked) =>
                                handleChecklistChange(item.id, "checked", checked as boolean)
                              }
                            />
                            <div className="flex-1">
                              <p className="font-medium">{item.item}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <label className="flex items-center gap-2 text-sm">
                                  <Checkbox
                                    checked={item.hasIssue}
                                    onCheckedChange={(checked) =>
                                      handleChecklistChange(item.id, "hasIssue", checked as boolean)
                                    }
                                  />
                                  <span className="text-red-600">Problema identificado</span>
                                </label>
                              </div>
                              {(item.hasIssue || item.observation) && (
                                <div className="mt-2">
                                  <Textarea
                                    placeholder="Descreva o problema ou observação..."
                                    value={item.observation}
                                    onChange={(e) => handleChecklistChange(item.id, "observation", e.target.value)}
                                    rows={2}
                                    className="text-sm"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 8. Avaria na Aeronave */}
          <Card>
            <CardHeader>
              <CardTitle>8. Avaria na Aeronave</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="avariaDetectada"
                  checked={formData.avariaDetectada}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, avariaDetectada: checked as boolean }))
                  }
                />
                <Label htmlFor="avariaDetectada">Detectada alguma avaria na aeronave?</Label>
              </div>
              {formData.avariaDetectada && (
                <div>
                  <Label htmlFor="avariaDescricao">Descrição da Avaria</Label>
                  <Textarea
                    id="avariaDescricao"
                    name="avariaDescricao"
                    value={formData.avariaDescricao}
                    onChange={handleChange}
                    placeholder="Descreva detalhadamente a avaria encontrada..."
                    rows={3}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* 9. Dados para Cancelamento */}
          <Card>
            <CardHeader>
              <CardTitle>9. Dados para Cancelamento</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cancelamentoSolicitante">Solicitante</Label>
                <Input
                  id="cancelamentoSolicitante"
                  name="cancelamentoSolicitante"
                  value={formData.cancelamentoSolicitante}
                  onChange={handleChange}
                  placeholder="Nome do solicitante"
                />
              </div>
              <div>
                <Label htmlFor="cancelamentoMotivo">Motivo</Label>
                <Input
                  id="cancelamentoMotivo"
                  name="cancelamentoMotivo"
                  value={formData.cancelamentoMotivo}
                  onChange={handleChange}
                  placeholder="Motivo do cancelamento"
                />
              </div>
            </CardContent>
          </Card>

          {/* 10. Conferência e Assinatura */}
          <Card>
            <CardHeader>
              <CardTitle>10. Conferência e Assinatura</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Responsável pelo Preenchimento</h4>
                  <div>
                    <Label htmlFor="responsavelNome">Nome</Label>
                    <Input
                      id="responsavelNome"
                      name="responsavelNome"
                      value={formData.responsavelNome}
                      onChange={handleChange}
                      placeholder="Nome completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="responsavelMatricula">Matrícula</Label>
                    <Input
                      id="responsavelMatricula"
                      name="responsavelMatricula"
                      value={formData.responsavelMatricula}
                      onChange={handleChange}
                      placeholder="Número da matrícula"
                    />
                  </div>
                  <div>
                    <Label>Assinatura</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500">
                      Campo para assinatura digital
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Representante do Cliente</h4>
                  <div>
                    <Label htmlFor="representanteNome">Nome</Label>
                    <Input
                      id="representanteNome"
                      name="representanteNome"
                      value={formData.representanteNome}
                      onChange={handleChange}
                      placeholder="Nome completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="representanteMatricula">Matrícula</Label>
                    <Input
                      id="representanteMatricula"
                      name="representanteMatricula"
                      value={formData.representanteMatricula}
                      onChange={handleChange}
                      placeholder="Número da matrícula"
                    />
                  </div>
                  <div>
                    <Label>Assinatura</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500">
                      Campo para assinatura digital
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Observações Gerais */}
          <Card>
            <CardHeader>
              <CardTitle>Observações Gerais</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                name="generalObservations"
                value={formData.generalObservations}
                onChange={handleChange}
                placeholder="Observações gerais sobre o atendimento e inspeção..."
                rows={4}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 pt-6">
            <Link href="/app/atendimentos">
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Salvar Atendimento e Inspeção
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
