import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface LLMConfig {
  id: string
  name: string
  baseUrl: string
  apiKey: string
  model: string
}

const STORAGE_KEY = 'llm-configs'

function loadConfigs(): LLMConfig[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as LLMConfig[]
  } catch {
    return []
  }
}

function saveConfigs(configs: LLMConfig[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(configs))
}

export default function ChatPage() {
  const [configs, setConfigs] = useState<LLMConfig[]>(loadConfigs())
  const [currentId, setCurrentId] = useState<string>(configs[0]?.id || '')
  const [newConfig, setNewConfig] = useState<LLMConfig>({
    id: crypto.randomUUID(),
    name: '',
    baseUrl: '',
    apiKey: '',
    model: 'gpt-3.5-turbo',
  })
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const current = configs.find((c) => c.id === currentId)

  useEffect(() => {
    saveConfigs(configs)
    if (!currentId && configs[0]) setCurrentId(configs[0].id)
  }, [configs, currentId])

  async function sendMessage() {
    if (!input.trim() || !current) return
    const userMessage: Message = { role: 'user', content: input }
    const updated = [...messages, userMessage]
    setMessages(updated)
    setInput('')
    try {
      const resp = await fetch(`${current.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${current.apiKey}`,
        },
        body: JSON.stringify({
          model: current.model,
          messages: updated,
        }),
      })
      const data = await resp.json()
      const assistant: Message = {
        role: 'assistant',
        content: data.choices?.[0]?.message?.content || 'Error',
      }
      setMessages((m) => [...m, assistant])
    } catch {
      const assistant: Message = {
        role: 'assistant',
        content: 'Request failed',
      }
      setMessages((m) => [...m, assistant])
    }
  }

  function addConfig() {
    setConfigs((c) => [...c, newConfig])
    setNewConfig({ id: crypto.randomUUID(), name: '', baseUrl: '', apiKey: '', model: 'gpt-3.5-turbo' })
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>AI Chat</h1>
      <nav>
        <Link to="/record">Record</Link> | <Link to="/recordings">Recordings</Link>
      </nav>
      <h2>API Config</h2>
      <select value={currentId} onChange={(e) => setCurrentId(e.target.value)}>
        {configs.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <div style={{ marginTop: 10 }}>
        <input
          placeholder="Name"
          value={newConfig.name}
          onChange={(e) => setNewConfig({ ...newConfig, name: e.target.value })}
        />
        <input
          placeholder="Base URL"
          value={newConfig.baseUrl}
          onChange={(e) => setNewConfig({ ...newConfig, baseUrl: e.target.value })}
        />
        <input
          placeholder="API Key"
          value={newConfig.apiKey}
          onChange={(e) => setNewConfig({ ...newConfig, apiKey: e.target.value })}
        />
        <input
          placeholder="Model"
          value={newConfig.model}
          onChange={(e) => setNewConfig({ ...newConfig, model: e.target.value })}
        />
        <button onClick={addConfig}>Add</button>
      </div>

      <div style={{ marginTop: 20 }}>
        <div style={{ height: 300, overflowY: 'auto', border: '1px solid #ccc', padding: 10 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ textAlign: m.role === 'user' ? 'right' : 'left' }}>
              <b>{m.role}: </b>
              {m.content}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10 }}>
          <input
            style={{ width: '80%' }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  )
}

