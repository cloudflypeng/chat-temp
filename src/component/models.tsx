// 获取模型列表

import { useState, useEffect } from 'react'

const baseUrl = import.meta.env.OPENROUTER_BASE_URL
export default function Models() {

  const [models, setModels] = useState<string[]>([])

  useEffect(() => {
    const fetchModels = async () => {
      const response = await fetch(`${baseUrl}/api/v1/models`)
      const data = await response.json()
      setModels(data)
    }
    fetchModels()
  }, [])

  return <div>
    {models.map((model) => (
      <div key={model}>{model}</div>
    ))}
  </div>
}
