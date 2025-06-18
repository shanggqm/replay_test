import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Player from 'rrweb-player'
import type { eventWithTime } from '@rrweb/types'
import 'rrweb-player/dist/style.css'

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

export default function RecordListPage() {
  const [records, setRecords] = useState<RecordData[]>([])
  const [current, setCurrent] = useState<RecordData | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setRecords(loadRecordings())
  }, [])

  useEffect(() => {
    if (current && containerRef.current) {
      containerRef.current.innerHTML = ''
      // eslint-disable-next-line no-new
      new Player({ target: containerRef.current, props: { events: current.events } })
    }
  }, [current])

  return (
    <div style={{ padding: 20 }}>
      <h1>Recordings</h1>
      <nav>
        <Link to="/">Chat</Link> | <Link to="/record">Record</Link>
      </nav>
      <div style={{ display: 'flex', marginTop: 20 }}>
        <ul style={{ width: 200 }}>
          {records.map((r) => (
            <li key={r.id}>
              <button onClick={() => setCurrent(r)}>{r.name}</button>
            </li>
          ))}
        </ul>
        <div style={{ flex: 1 }} ref={containerRef} />
      </div>
    </div>
  )
}
