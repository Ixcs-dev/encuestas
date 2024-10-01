"use client"

import React, { useReducer, useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Checkbox } from "../components/ui/checkbox"
import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { useRouter } from 'next/navigation'
import { submitEncuesta } from '@/app/action/encuestas'

type Respuestas = {
  rol: string;
  rolOtro: string;
  perteneceSemillero: string;
  tiempoSemillero: string;
  gestionProyectos: string[];
  gestionProyectosOtro: string;
  satisfaccion: string;
  problemas: string[];
  problemasOtro: string;
  caracteristicas: string[];
  caracteristicasOtro: string;
  metodologiasAgiles: string;
  disposicionSoftware: string;
  probabilidadRecomendacion: string;
  funcionalidadesAdicionales: string;
  expectativas: string;
  comentarios: string;
}

type Action =
  | { type: 'SET_FIELD'; field: keyof Respuestas; value: string | string[] }
  | { type: 'SET_CHECKBOX'; field: keyof Respuestas; value: string; checked: boolean }
  | { type: 'SET_PASO'; paso: number }
  | { type: 'LOAD_SAVED_RESPONSES'; respuestas: Respuestas }

const initialState: Respuestas & { paso: number } = {
  rol: '',
  rolOtro: '',
  perteneceSemillero: '',
  tiempoSemillero: '',
  gestionProyectos: [],
  gestionProyectosOtro: '',
  satisfaccion: '',
  problemas: [],
  problemasOtro: '',
  caracteristicas: [],
  caracteristicasOtro: '',
  metodologiasAgiles: '',
  disposicionSoftware: '',
  probabilidadRecomendacion: '',
  funcionalidadesAdicionales: '',
  expectativas: '',
  comentarios: '',
  paso: 1
}

function reducer(state: typeof initialState, action: Action): typeof initialState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }
    case 'SET_CHECKBOX':
      if (Array.isArray(state[action.field])) {
        const newArray = action.checked
          ? [...state[action.field] as string[], action.value]
          : (state[action.field] as string[]).filter(item => item !== action.value)
        return { ...state, [action.field]: newArray }
      }
      return state
    case 'SET_PASO':
      return { ...state, paso: action.paso }
    case 'LOAD_SAVED_RESPONSES':
      return { ...state, ...action.respuestas }
    default:
      return state
  }
}

const Toast: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void }> = ({ message, type, onClose }) => (
  <div className={`fixed bottom-4 right-4 p-4 rounded-md ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
    {message}
    <button onClick={onClose} className="ml-2 font-bold">&times;</button>
  </div>
)

export default function EncuestaInvestigacion() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const router = useRouter()
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const savedResponses = localStorage.getItem('encuestaEnProgreso')
    if (savedResponses) {
      dispatch({ type: 'LOAD_SAVED_RESPONSES', respuestas: JSON.parse(savedResponses) })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('encuestaEnProgreso', JSON.stringify(state))
  }, [state])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    dispatch({ type: 'SET_FIELD', field: name as keyof Respuestas, value })
  }

  const handleCheckboxChange = (name: keyof Respuestas, value: string, checked: boolean) => {
    dispatch({ type: 'SET_CHECKBOX', field: name, value, checked })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateAllResponses()) {
      setToast({ message: "Por favor, responda todas las preguntas obligatorias.", type: "error" })
      return
    }

    setIsSubmitting(true)
    try {
      const result = await submitEncuesta(state)
      if (result.success) {
        localStorage.removeItem('encuestaEnProgreso')
        router.push('/dashboard/agradecimiento')
      } else {
        throw new Error(result.error || 'Error desconocido al enviar la encuesta')
      }
    } catch (error) {
      console.error("Error al enviar la encuesta", error)
      setToast({ 
        message: error instanceof Error ? error.message : "No se pudo enviar la encuesta. Por favor, intente nuevamente.", 
        type: "error" 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateAllResponses = () => {
    return (
      validatePaso1() &&
      validatePaso2() &&
      validatePaso3() &&
      validatePaso4()
    )
  }

  const validatePaso1 = () => {
    if (!state.rol) return false
    if (state.rol === 'Otro' && !state.rolOtro) return false
    if (!state.perteneceSemillero) return false
    if (state.perteneceSemillero === 'Sí' && !state.tiempoSemillero) return false
    return true
  }

  const validatePaso2 = () => {
    if (state.gestionProyectos.length === 0) return false
    if (state.gestionProyectos.includes('Otro') && !state.gestionProyectosOtro) return false
    if (!state.satisfaccion) return false
    return true
  }

  const validatePaso3 = () => {
    if (state.problemas.length === 0) return false
    if (state.problemas.includes('Otro') && !state.problemasOtro) return false
    if (state.caracteristicas.length === 0) return false
    if (state.caracteristicas.includes('Otro') && !state.caracteristicasOtro) return false
    return true
  }

  const validatePaso4 = () => {
    if (!state.metodologiasAgiles) return false
    if (!state.disposicionSoftware) return false
    if (!state.probabilidadRecomendacion) return false
    return true
  }

  const renderPaso1 = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label htmlFor="rol">1. ¿Cuál es su rol en la Universidad de Sincelejo? *</Label>
          <RadioGroup
            value={state.rol}
            onValueChange={(value) => dispatch({ type: 'SET_FIELD', field: 'rol', value })}
            aria-labelledby="rol"
          >
            {['Estudiante', 'Profesor/Investigador', 'Administrador', 'Otro'].map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`rol-${option}`} />
                <Label htmlFor={`rol-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
          {state.rol === 'Otro' && (
            <Input 
              name="rolOtro" 
              value={state.rolOtro} 
              onChange={handleInputChange} 
              placeholder="Especifique su rol"
              className="mt-2"
              required
              aria-label="Especifique su rol"
            />
          )}
        </div>

        <div>
          <Label htmlFor="perteneceSemillero">2. ¿Pertenece actualmente a un semillero de investigación? *</Label>
          <RadioGroup
            value={state.perteneceSemillero}
            onValueChange={(value) => dispatch({ type: 'SET_FIELD', field: 'perteneceSemillero', value })}
            aria-labelledby="perteneceSemillero"
          >
            {['Sí', 'No'].map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`semillero-${option}`} />
                <Label htmlFor={`semillero-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {state.perteneceSemillero === 'Sí' && (
          <div>
            <Label htmlFor="tiempoSemillero">3. ¿Cuántos años lleva participando en semilleros de investigación? *</Label>
            <RadioGroup
              value={state.tiempoSemillero}
              onValueChange={(value) => dispatch({ type: 'SET_FIELD', field: 'tiempoSemillero', value })}
              aria-labelledby="tiempoSemillero"
            >
              {['Menos de 1 año', '1-2 años', 'Más de 2 años'].map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`tiempo-${option}`} />
                  <Label htmlFor={`tiempo-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}
      </div>
      <Button onClick={() => dispatch({ type: 'SET_PASO', paso: 2 })} className="mt-4" disabled={!validatePaso1()}>Siguiente</Button>
    </>
  )

  const renderPaso2 = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label htmlFor="gestionProyectos">4. ¿Cómo gestionan actualmente los proyectos en su semillero de investigación? (Puede seleccionar más de una opción) *</Label>
          {[
            'Hojas de cálculo (Excel, Google Sheets)',
            'Herramientas de gestión de proyectos genéricas (Trello, Asana, etc.)',
            'Herramientas proporcionadas por la universidad',
            'No utilizamos ninguna herramienta específica',
            'Otro'
          ].map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox 
                id={`gestion-${option}`} 
                checked={state.gestionProyectos.includes(option)}
                onCheckedChange={(checked) => handleCheckboxChange('gestionProyectos', option, checked as boolean)}
                aria-labelledby={`gestion-${option}-label`}
              />
              <Label htmlFor={`gestion-${option}`} id={`gestion-${option}-label`}>{option}</Label>
            </div>
          ))}
          {state.gestionProyectos.includes('Otro') && (
            <Input 
              name="gestionProyectosOtro" 
              value={state.gestionProyectosOtro} 
              onChange={handleInputChange} 
              placeholder="Especifique otra forma de gestión"
              className="mt-2"
              required
              aria-label="Especifique otra forma de gestión"
            />
          )}
        </div>

        <div>
          <Label htmlFor="satisfaccion">5. ¿Qué tan satisfecho está con el método actual de gestión de proyectos en su semillero? *</Label>
          <RadioGroup
            value={state.satisfaccion}
            onValueChange={(value) => dispatch({ type: 'SET_FIELD', field: 'satisfaccion', value })}
            aria-labelledby="satisfaccion"
          >
            {['Muy satisfecho', 'Satisfecho', 'Neutral', 'Insatisfecho', 'Muy insatisfecho'].map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`satisfaccion-${option}`} />
                <Label htmlFor={`satisfaccion-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <Button onClick={() => dispatch({ type: 'SET_PASO', paso: 1 })}>Anterior</Button>
        <Button onClick={() => dispatch({ type: 'SET_PASO', paso: 3 })} disabled={!validatePaso2()}>Siguiente</Button>
      </div>
    </>
  )

  const renderPaso3 = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label htmlFor="problemas">6. ¿Cuáles son los principales problemas que enfrenta al gestionar proyectos de investigación? (Puede seleccionar más de una opción) *</Label>
          {[
            'Falta de seguimiento de tareas',
            'Problemas de comunicación entre miembros del semillero',
            'Dificultad para asignar responsabilidades',
            'No hay una plataforma centralizada para el control de proyectos',
            'Otro'
          ].map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox 
                id={`problemas-${option}`} 
                checked={state.problemas.includes(option)}
                onCheckedChange={(checked) => handleCheckboxChange('problemas', option, checked as boolean)}
                aria-labelledby={`problemas-${option}-label`}
              />
              <Label htmlFor={`problemas-${option}`} id={`problemas-${option}-label`}>{option}</Label>
            </div>
          ))}
          {state.problemas.includes('Otro') && (
            <Input 
              name="problemasOtro" 
              value={state.problemasOtro} 
              onChange={handleInputChange} 
              placeholder="Especifique otro problema"
              className="mt-2"
              required
              aria-label="Especifique otro problema"
            />
          )}
        </div>

        <div>
          <Label htmlFor="caracteristicas">7. ¿Qué características consideraría más útiles en una herramienta de gestión de proyectos para semilleros de investigación? (Seleccione hasta 3) *</Label>
          {[
            'Gestión de tareas y asignación de responsabilidades',
            'Seguimiento de progreso en tiempo real',
            'Herramientas de comunicación integradas (chat, foros)',
            'Reportes automáticos de avances',
            'Integración con calendarios y recordatorios',
            'Otro'
          ].map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox 
                id={`caracteristicas-${option}`} 
                checked={state.caracteristicas.includes(option)}
                onCheckedChange={(checked) => handleCheckboxChange('caracteristicas', option, checked as boolean)}
                disabled={state.caracteristicas.length >= 3 && !state.caracteristicas.includes(option)}
                aria-labelledby={`caracteristicas-${option}-label`}
              />
              <Label htmlFor={`caracteristicas-${option}`} id={`caracteristicas-${option}-label`}>{option}</Label>
            </div>
          ))}
          {state.caracteristicas.includes('Otro') && (
            <Input 
              name="caracteristicasOtro" 
              value={state.caracteristicasOtro} 
              onChange={handleInputChange} 
              placeholder="Especifique otra característica"
              className="mt-2"
              required
              aria-label="Especifique otra característica"
            />
          )}
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <Button onClick={() => dispatch({ type: 'SET_PASO', paso: 2 })}>Anterior</Button>
        <Button onClick={() => dispatch({ type: 'SET_PASO', paso: 4 })} disabled={!validatePaso3()}>Siguiente</Button>
      </div>
    </>
  )

  const renderPaso4 = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label htmlFor="metodologiasAgiles">8. ¿Considera que el uso de metodologías ágiles (Scrum, Kanban, etc.) podría mejorar la gestión de los proyectos en los semilleros? *</Label>
          <RadioGroup
            value={state.metodologiasAgiles}
            onValueChange={(value) => dispatch({ type: 'SET_FIELD', field: 'metodologiasAgiles', value })}
            aria-labelledby="metodologiasAgiles"
          >
            {['Sí', 'No', 'No estoy familiarizado con estas metodologías'].map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`metodologias-${option}`} />
                <Label htmlFor={`metodologias-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="disposicionSoftware">9. ¿Estaría dispuesto a utilizar un software especializado en la gestión de proyectos de semilleros de investigación? *</Label>
          <RadioGroup
            value={state.disposicionSoftware}
            onValueChange={(value) => dispatch({ type: 'SET_FIELD', field: 'disposicionSoftware', value })}
            aria-labelledby="disposicionSoftware"
          >
            {['Sí', 'No', 'Tal vez'].map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`disposicion-${option}`} />
                <Label htmlFor={`disposicion-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="probabilidadRecomendacion">10. Si existiera una herramienta desarrollada específicamente para gestionar los semilleros de investigación, ¿qué tan probable sería que la recomendara a otros? *</Label>
          <RadioGroup
            value={state.probabilidadRecomendacion}
            onValueChange={(value) => dispatch({ type: 'SET_FIELD', field: 'probabilidadRecomendacion', value })}
            aria-labelledby="probabilidadRecomendacion"
          >
            {['Muy probable', 'Probable', 'Neutral', 'Poco probable', 'Muy poco probable'].map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`recomendacion-${option}`} />
                <Label htmlFor={`recomendacion-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <Button onClick={() => dispatch({ type: 'SET_PASO', paso: 3 })}>Anterior</Button>
        <Button onClick={() => dispatch({ type: 'SET_PASO', paso: 5 })} disabled={!validatePaso4()}>Siguiente</Button>
      </div>
    </>
  )

  const renderPaso5 = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label htmlFor="funcionalidades">11. ¿Qué otras funcionalidades le gustarían que incluyera el software para facilitar la gestión de los proyectos?</Label>
          <Textarea 
            id="funcionalidades"
            name="funcionalidadesAdicionales" 
            value={state.funcionalidadesAdicionales} 
            onChange={handleInputChange} 
            placeholder="Escriba aquí sus sugerencias"
            className="mt-2"
            aria-label="Funcionalidades adicionales"
          />
        </div>

        <div>
          <Label htmlFor="expectativas">12. ¿Qué expectativas tiene con respecto a la implementación de un software de gestión de proyectos de investigación en la universidad?</Label>
          <Textarea 
            id="expectativas"
            name="expectativas" 
            value={state.expectativas} 
            onChange={handleInputChange} 
            placeholder="Escriba aquí sus expectativas"
            className="mt-2"
            aria-label="Expectativas"
          />
        </div>

        <div>
          <Label htmlFor="comentarios">13. Comentarios adicionales:</Label>
          <Textarea 
            id="comentarios"
            name="comentarios" 
            value={state.comentarios} 
            onChange={handleInputChange} 
            placeholder="Escriba aquí sus comentarios adicionales"
            className="mt-2"
            aria-label="Comentarios adicionales"
          />
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <Button onClick={() => dispatch({ type: 'SET_PASO', paso: 4 })}>Anterior</Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar Encuesta'}
        </Button>
      </div>
    </>
  )

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Encuesta de Investigación</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {state.paso === 1 && renderPaso1()}
          {state.paso === 2 && renderPaso2()}
          {state.paso === 3 && renderPaso3()}
          {state.paso === 4 && renderPaso4()}
          {state.paso === 5 && renderPaso5()}
        </form>
      </CardContent>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </Card>
  )
}