"use client"

import { useState, useEffect } from "react"
import { Bell, BellOff, Clock, BookOpen, Coffee, Utensils, Settings, Plus, Edit, Trash2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeProvider } from "@/components/theme-provider"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface ScheduleItem {
  id: string
  time: string
  activity: string
  type: "study" | "break" | "lunch" | "dinner"
  duration: string
}

interface CustomSchedule {
  id: string
  name: string
  days: number[]
  items: ScheduleItem[]
}

const defaultSchedules = {
  // Segunda, Quarta, Quinta, Sexta
  regular: [
    { id: "1", time: "08:30", activity: "Estudo", type: "study" as const, duration: "2h" },
    { id: "2", time: "10:30", activity: "Pausa", type: "break" as const, duration: "15min" },
    { id: "3", time: "10:45", activity: "Estudo", type: "study" as const, duration: "2h" },
    { id: "4", time: "14:30", activity: "Estudo", type: "study" as const, duration: "2h" },
  ],
  // Terça-feira
  tuesday: [
    { id: "5", time: "08:00", activity: "Estudo", type: "study" as const, duration: "2h" },
    { id: "6", time: "10:00", activity: "Pausa", type: "break" as const, duration: "15min" },
    { id: "7", time: "10:15", activity: "Estudo", type: "study" as const, duration: "2h" },
    { id: "8", time: "12:15", activity: "Almoço e descanso", type: "lunch" as const, duration: "1h45min" },
    { id: "9", time: "14:00", activity: "Estudo", type: "study" as const, duration: "2h" },
    { id: "10", time: "16:00", activity: "Pausa", type: "break" as const, duration: "15min" },
    { id: "11", time: "16:15", activity: "Estudo", type: "study" as const, duration: "2h" },
    { id: "12", time: "18:15", activity: "Pausa", type: "break" as const, duration: "15min" },
    { id: "13", time: "18:30", activity: "Estudo", type: "study" as const, duration: "2h" },
    { id: "14", time: "20:30", activity: "Jantar / descanso", type: "dinner" as const, duration: "1h" },
    { id: "15", time: "21:30", activity: "Estudo", type: "study" as const, duration: "1h" },
  ],
  // Fim de semana (vazio por padrão)
  weekend: [],
}

const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
const dayNamesShort = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

export default function StudyAlarmSystem() {
  const { toast } = useToast()
  const [isActive, setIsActive] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [nextAlarm, setNextAlarm] = useState<ScheduleItem | null>(null)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default")
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [testMode, setTestMode] = useState(false)

  // Estados para cronogramas personalizados
  const [customSchedules, setCustomSchedules] = useState<CustomSchedule[]>([])
  const [editingSchedule, setEditingSchedule] = useState<CustomSchedule | null>(null)
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null)
  const [newItem, setNewItem] = useState<Partial<ScheduleItem>>({
    time: "",
    activity: "",
    type: "study",
    duration: "",
  })

  // Carregar configurações salvas
  useEffect(() => {
    const savedIsActive = localStorage.getItem("alarmSystem:isActive")
    const savedSoundEnabled = localStorage.getItem("alarmSystem:soundEnabled")
    const savedCustomSchedules = localStorage.getItem("alarmSystem:customSchedules")

    if (savedIsActive) setIsActive(savedIsActive === "true")
    if (savedSoundEnabled) setSoundEnabled(savedSoundEnabled === "true")
    if (savedCustomSchedules) {
      try {
        setCustomSchedules(JSON.parse(savedCustomSchedules))
      } catch (error) {
        console.error("Erro ao carregar cronogramas:", error)
      }
    }

    // Verificar permissão de notificação
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission)
    }
  }, [])

  // Salvar configurações quando mudarem
  useEffect(() => {
    localStorage.setItem("alarmSystem:isActive", isActive.toString())
    localStorage.setItem("alarmSystem:soundEnabled", soundEnabled.toString())
    localStorage.setItem("alarmSystem:customSchedules", JSON.stringify(customSchedules))
  }, [isActive, soundEnabled, customSchedules])

  // Atualizar hora atual a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      toast({
        title: "Erro",
        description: "Seu navegador não suporta notificações",
        variant: "destructive",
      })
      return
    }

    try {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)

      if (permission === "granted") {
        toast({
          title: "Notificações ativadas",
          description: "Seu sistema de alarme está pronto para funcionar!",
        })
      } else if (permission === "denied") {
        toast({
          title: "Notificações bloqueadas",
          description: "Verifique as permissões do navegador e tente novamente",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao solicitar permissão:", error)
      toast({
        title: "Erro",
        description: "Não foi possível solicitar permissão para notificações",
        variant: "destructive",
      })
    }
  }

  // Verificar alarmes quando o tempo mudar
  useEffect(() => {
    if (!isActive) return

    const checkAlarms = () => {
      const now = new Date()
      const currentDay = now.getDay()
      const currentTimeStr = now.toTimeString().slice(0, 5)

      // Determinar cronograma baseado no dia
      let todaySchedule: ScheduleItem[] = []

      // Verificar cronogramas personalizados primeiro
      const customSchedule = customSchedules.find((schedule) => schedule.days.includes(currentDay))

      if (customSchedule) {
        todaySchedule = customSchedule.items
      } else {
        // Usar cronogramas padrão
        if (currentDay === 2) {
          // Terça-feira
          todaySchedule = defaultSchedules.tuesday
        } else if ([1, 3, 4, 5].includes(currentDay)) {
          // Segunda, Quarta, Quinta, Sexta
          todaySchedule = defaultSchedules.regular
        } else {
          // Fim de semana
          todaySchedule = defaultSchedules.weekend
        }
      }

      // Verificar se é hora de algum alarme
      const currentAlarm = todaySchedule.find((item) => item.time === currentTimeStr)

      if ((currentAlarm || testMode) && notificationPermission === "granted") {
        const alarmToShow = currentAlarm || {
          id: "test",
          time: currentTimeStr,
          activity: "Teste de Alarme",
          type: "study" as const,
          duration: "1min",
        }

        // Enviar notificação
        const icon =
          alarmToShow.type === "study"
            ? "📚"
            : alarmToShow.type === "break"
              ? "☕"
              : alarmToShow.type === "lunch"
                ? "🍽️"
                : "🍽️"

        new Notification(`${icon} ${alarmToShow.activity}`, {
          body: `Duração: ${alarmToShow.duration}`,
          icon: "/favicon.ico",
        })

        // Tocar som se habilitado
        if (soundEnabled) {
          const audio = new Audio("/notification.mp3")
          audio.play().catch((err) => console.error("Erro ao tocar som:", err))
        }

        // Resetar modo de teste
        if (testMode) setTestMode(false)
      }

      // Encontrar próximo alarme
      const futureAlarms = todaySchedule.filter((item) => item.time > currentTimeStr)
      if (futureAlarms.length > 0) {
        setNextAlarm(futureAlarms[0])
      } else {
        setNextAlarm(null)
      }
    }

    const interval = setInterval(checkAlarms, 1000)
    checkAlarms() // Executar imediatamente

    return () => clearInterval(interval)
  }, [isActive, notificationPermission, testMode, soundEnabled, customSchedules])

  const getCurrentSchedule = () => {
    const currentDay = new Date().getDay()

    // Verificar cronogramas personalizados primeiro
    const customSchedule = customSchedules.find((schedule) => schedule.days.includes(currentDay))

    if (customSchedule) {
      return {
        schedule: customSchedule.items,
        title: `${customSchedule.name} (Personalizado)`,
        isCustom: true,
        customScheduleId: customSchedule.id,
      }
    }

    // Usar cronogramas padrão
    if (currentDay === 2) {
      return { schedule: defaultSchedules.tuesday, title: "Terça-feira (até 12h30min)", isCustom: false }
    } else if ([1, 3, 4, 5].includes(currentDay)) {
      return { schedule: defaultSchedules.regular, title: "Segunda, Quarta, Quinta, Sexta (6h/dia)", isCustom: false }
    }

    return { schedule: defaultSchedules.weekend, title: "Fim de semana (sem cronograma)", isCustom: false }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "study":
        return <BookOpen className="h-4 w-4" />
      case "break":
        return <Coffee className="h-4 w-4" />
      case "lunch":
      case "dinner":
        return <Utensils className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "study":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "break":
        return "bg-green-100 text-green-800 border-green-200"
      case "lunch":
      case "dinner":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const testNotification = () => {
    setTestMode(true)
  }

  // Funções para gerenciar cronogramas personalizados
  const createNewSchedule = () => {
    const newSchedule: CustomSchedule = {
      id: Date.now().toString(),
      name: "Novo Cronograma",
      days: [],
      items: [],
    }
    setEditingSchedule(newSchedule)
    setScheduleDialogOpen(true)
  }

  const editSchedule = (schedule: CustomSchedule) => {
    setEditingSchedule({ ...schedule })
    setScheduleDialogOpen(true)
  }

  const deleteSchedule = (scheduleId: string) => {
    setCustomSchedules((prev) => prev.filter((s) => s.id !== scheduleId))
    toast({
      title: "Cronograma excluído",
      description: "O cronograma foi removido com sucesso",
    })
  }

  const saveSchedule = () => {
    if (!editingSchedule) return

    if (!editingSchedule.name.trim()) {
      toast({
        title: "Erro",
        description: "O nome do cronograma é obrigatório",
        variant: "destructive",
      })
      return
    }

    if (editingSchedule.days.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um dia da semana",
        variant: "destructive",
      })
      return
    }

    const existingIndex = customSchedules.findIndex((s) => s.id === editingSchedule.id)

    if (existingIndex >= 0) {
      // Atualizar cronograma existente
      setCustomSchedules((prev) => prev.map((s) => (s.id === editingSchedule.id ? editingSchedule : s)))
    } else {
      // Adicionar novo cronograma
      setCustomSchedules((prev) => [...prev, editingSchedule])
    }

    setScheduleDialogOpen(false)
    setEditingSchedule(null)

    toast({
      title: "Cronograma salvo",
      description: "Suas alterações foram salvas com sucesso",
    })
  }

  const addItemToSchedule = () => {
    if (!editingSchedule || !newItem.time || !newItem.activity || !newItem.duration) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    const item: ScheduleItem = {
      id: Date.now().toString(),
      time: newItem.time!,
      activity: newItem.activity!,
      type: newItem.type as ScheduleItem["type"],
      duration: newItem.duration!,
    }

    setEditingSchedule((prev) => ({
      ...prev!,
      items: [...prev!.items, item].sort((a, b) => a.time.localeCompare(b.time)),
    }))

    setNewItem({
      time: "",
      activity: "",
      type: "study",
      duration: "",
    })
  }

  const removeItemFromSchedule = (itemId: string) => {
    if (!editingSchedule) return

    setEditingSchedule((prev) => ({
      ...prev!,
      items: prev!.items.filter((item) => item.id !== itemId),
    }))
  }

  const toggleDay = (day: number) => {
    if (!editingSchedule) return

    setEditingSchedule((prev) => ({
      ...prev!,
      days: prev!.days.includes(day) ? prev!.days.filter((d) => d !== day) : [...prev!.days, day].sort(),
    }))
  }

  const { schedule, title, isCustom, customScheduleId } = getCurrentSchedule()

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
                <Bell className="h-8 w-8 text-blue-600" />
                Sistema de Alarme de Estudos
              </CardTitle>
              <CardDescription className="text-lg">
                {dayNames[currentTime.getDay()]} - {currentTime.toLocaleTimeString("pt-BR")}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Controles */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Controles
                </CardTitle>
                <CardDescription>Gerencie os alarmes e notificações</CardDescription>
              </div>
              <Button variant="outline" size="icon" onClick={() => setSettingsOpen(true)}>
                <Settings className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="alarm-toggle" className="text-base font-medium">
                    Ativar Alarmes
                  </Label>
                  <p className="text-sm text-muted-foreground">{isActive ? "Alarmes ativos" : "Alarmes desativados"}</p>
                </div>
                <Switch
                  id="alarm-toggle"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                  disabled={notificationPermission !== "granted"}
                />
              </div>

              {/* Status das notificações */}
              <div className="space-y-3">
                {notificationPermission === "default" && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-blue-800 mb-1">🔔 Ativar Notificações</p>
                        <p className="text-sm text-blue-700">
                          Clique no botão para permitir notificações e ativar os alarmes
                        </p>
                      </div>
                      <Button
                        onClick={requestNotificationPermission}
                        className="bg-blue-600 hover:bg-blue-700"
                        size="sm"
                      >
                        Permitir
                      </Button>
                    </div>
                  </div>
                )}

                {notificationPermission === "denied" && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="font-medium text-red-800 mb-2">❌ Notificações Bloqueadas</p>
                    <p className="text-sm text-red-700 mb-3">Para ativar as notificações:</p>
                    <ol className="text-sm text-red-700 list-decimal list-inside space-y-1">
                      <li>
                        Clique no ícone de <strong>cadeado</strong> na barra de endereços
                      </li>
                      <li>
                        Altere "Notificações" para <strong>"Permitir"</strong>
                      </li>
                      <li>Recarregue esta página</li>
                    </ol>
                    <Button onClick={() => window.location.reload()} variant="outline" size="sm" className="mt-3">
                      Recarregar Página
                    </Button>
                  </div>
                )}

                {notificationPermission === "granted" && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-green-800 mb-1">✅ Notificações Ativas</p>
                        <p className="text-sm text-green-700">Seu sistema está pronto para enviar alarmes!</p>
                      </div>
                      <Button onClick={testNotification} variant="outline" size="sm">
                        Testar
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {nextAlarm && isActive && notificationPermission === "granted" && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 mb-1">⏰ Próximo Alarme:</p>
                  <div className="flex items-center gap-2">
                    {getActivityIcon(nextAlarm.type)}
                    <span className="font-medium">{nextAlarm.time}</span>
                    <span>-</span>
                    <span>{nextAlarm.activity}</span>
                    <Badge variant="outline" className={getActivityColor(nextAlarm.type)}>
                      {nextAlarm.duration}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cronograma */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                  {schedule.length === 0 ? "Nenhum cronograma para hoje" : `${schedule.length} atividades programadas`}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {isCustom && customScheduleId && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const scheduleToEdit = customSchedules.find((s) => s.id === customScheduleId)
                      if (scheduleToEdit) editSchedule(scheduleToEdit)
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={createNewSchedule}>
                  <Plus className="h-4 w-4 mr-1" />
                  Novo Cronograma
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {schedule.length > 0 ? (
                <div className="space-y-3">
                  {schedule.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        {getActivityIcon(item.type)}
                        <div>
                          <div className="font-medium text-gray-900">{item.time}</div>
                          <div className="text-sm text-gray-600">{item.activity}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className={getActivityColor(item.type)}>
                        {item.duration}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BellOff className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Sem atividades programadas para hoje</p>
                  <p className="text-sm">Aproveite para descansar! 😊</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <div className={`text-2xl font-bold ${isActive ? "text-blue-600" : "text-gray-400"}`}>
                    {isActive ? "ATIVO" : "INATIVO"}
                  </div>
                  <div className="text-sm text-gray-600">Status do Sistema</div>
                </div>
                <div className="space-y-1">
                  <div
                    className={`text-2xl font-bold ${notificationPermission === "granted" ? "text-green-600" : "text-red-500"}`}
                  >
                    {notificationPermission === "granted" ? "✓" : "✗"}
                  </div>
                  <div className="text-sm text-gray-600">Notificações</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-purple-600">{schedule.length}</div>
                  <div className="text-sm text-gray-600">Alarmes Hoje</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Configurações */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Configurações</DialogTitle>
            <DialogDescription>Personalize seu sistema de alarme de estudos</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="notifications" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="notifications">Notificações</TabsTrigger>
              <TabsTrigger value="schedules">Cronogramas</TabsTrigger>
              <TabsTrigger value="about">Sobre</TabsTrigger>
            </TabsList>

            <TabsContent value="notifications" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sound-toggle">Som de Notificação</Label>
                  <p className="text-sm text-muted-foreground">Tocar som ao disparar alarmes</p>
                </div>
                <Switch id="sound-toggle" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Testar Notificações</Label>
                <Button onClick={testNotification} variant="outline">
                  Enviar Notificação de Teste
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="schedules" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Cronogramas Personalizados</h3>
                <Button onClick={createNewSchedule} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Novo
                </Button>
              </div>

              {customSchedules.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum cronograma personalizado criado</p>
                  <p className="text-sm">Crie seu primeiro cronograma personalizado!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {customSchedules.map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{schedule.name}</h4>
                        <p className="text-sm text-gray-600">
                          {schedule.days.map((day) => dayNamesShort[day]).join(", ")} • {schedule.items.length}{" "}
                          atividades
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => editSchedule(schedule)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteSchedule(schedule.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="about" className="space-y-4 mt-4">
              <div className="space-y-2">
                <h3 className="font-medium">Sistema de Alarme de Estudos</h3>
                <p className="text-sm text-muted-foreground">Versão 1.2.0</p>
                <p className="text-sm text-muted-foreground mt-4">
                  Este aplicativo ajuda a gerenciar seu tempo de estudo com alarmes programados para diferentes
                  atividades ao longo do dia. Agora com suporte a cronogramas personalizados!
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <CardFooter className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>
              Fechar
            </Button>
          </CardFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Edição de Cronograma */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSchedule?.name === "Novo Cronograma" ? "Criar Cronograma" : "Editar Cronograma"}
            </DialogTitle>
            <DialogDescription>Configure os horários e atividades do seu cronograma personalizado</DialogDescription>
          </DialogHeader>

          {editingSchedule && (
            <div className="space-y-6">
              {/* Nome do cronograma */}
              <div className="space-y-2">
                <Label htmlFor="schedule-name">Nome do Cronograma</Label>
                <Input
                  id="schedule-name"
                  value={editingSchedule.name}
                  onChange={(e) => setEditingSchedule((prev) => ({ ...prev!, name: e.target.value }))}
                  placeholder="Ex: Cronograma de Segunda-feira"
                />
              </div>

              {/* Dias da semana */}
              <div className="space-y-2">
                <Label>Dias da Semana</Label>
                <div className="flex flex-wrap gap-2">
                  {dayNames.map((day, index) => (
                    <Button
                      key={index}
                      variant={editingSchedule.days.includes(index) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleDay(index)}
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Adicionar nova atividade */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium">Adicionar Atividade</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <Label htmlFor="new-time">Horário</Label>
                    <Input
                      id="new-time"
                      type="time"
                      value={newItem.time}
                      onChange={(e) => setNewItem((prev) => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-activity">Atividade</Label>
                    <Input
                      id="new-activity"
                      value={newItem.activity}
                      onChange={(e) => setNewItem((prev) => ({ ...prev, activity: e.target.value }))}
                      placeholder="Ex: Estudo de Matemática"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-type">Tipo</Label>
                    <Select
                      value={newItem.type}
                      onValueChange={(value) =>
                        setNewItem((prev) => ({ ...prev, type: value as ScheduleItem["type"] }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="study">📚 Estudo</SelectItem>
                        <SelectItem value="break">☕ Pausa</SelectItem>
                        <SelectItem value="lunch">🍽️ Almoço</SelectItem>
                        <SelectItem value="dinner">🍽️ Jantar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="new-duration">Duração</Label>
                    <Input
                      id="new-duration"
                      value={newItem.duration}
                      onChange={(e) => setNewItem((prev) => ({ ...prev, duration: e.target.value }))}
                      placeholder="Ex: 2h, 30min"
                    />
                  </div>
                </div>
                <Button onClick={addItemToSchedule} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Atividade
                </Button>
              </div>

              {/* Lista de atividades */}
              <div className="space-y-2">
                <Label>Atividades ({editingSchedule.items.length})</Label>
                {editingSchedule.items.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhuma atividade adicionada</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {editingSchedule.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center gap-3">
                          {getActivityIcon(item.type)}
                          <div>
                            <div className="font-medium">
                              {item.time} - {item.activity}
                            </div>
                            <div className="text-sm text-gray-600">{item.duration}</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => removeItemFromSchedule(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Botões de ação */}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={saveSchedule}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Cronograma
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Toaster />
    </ThemeProvider>
  )
}
