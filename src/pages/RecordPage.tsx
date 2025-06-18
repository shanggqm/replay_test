import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { record } from "rrweb"
import type { eventWithTime } from "@rrweb/types"

interface RecordData {
  id: string
  name: string
  date: string
  events: eventWithTime[]
}

const STORAGE_KEY = 'recordings'

function loadRecordings(): RecordData[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as RecordData[]
  } catch {
    return []
  }
}

function saveRecordings(recs: RecordData[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recs))
}

export default function RecordPage() {
  const recorderRef = useRef<ReturnType<typeof record> | null>(null)
  const eventsRef = useRef<eventWithTime[]>([])
  const [recording, setRecording] = useState(false)
  const [name, setName] = useState('')

  useEffect(() => {
    return () => {
      recorderRef.current?.()
    }
  }, [])

  function start() {
    eventsRef.current = []
    setRecording(true)
    recorderRef.current = record({ emit: (e: eventWithTime) => eventsRef.current.push(e) })
  }

  function stop() {
    recorderRef.current?.()
    setRecording(false)
  }

  function save() {
    const recs = loadRecordings()
    recs.push({ id: crypto.randomUUID(), name: name || new Date().toISOString(), date: new Date().toISOString(), events: eventsRef.current })
    saveRecordings(recs)
    setName('')
    eventsRef.current = []
    alert('saved')
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Record Page</h1>
      <nav>
        <Link to="/">Chat</Link> | <Link to="/recordings">Recordings</Link>
      </nav>
      <div style={{ marginTop: 20 }}>
        {recording ? (
          <button onClick={stop}>Stop Recording</button>
        ) : (
          <button onClick={start}>Start Recording</button>
        )}
        {!recording && eventsRef.current.length > 0 && (
          <div>
            <input placeholder="name" value={name} onChange={(e) => setName((e.target as HTMLInputElement).value)} />
            <button onClick={save}>Save</button>
          </div>
        )}
      </div>
    </div>
  )
}
