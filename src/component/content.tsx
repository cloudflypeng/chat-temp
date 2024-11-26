import AttachmentIcon from '@mui/icons-material/Attachment'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';


import useStore from '../store/useStore';
import { useState, useRef } from 'react'
import cn from 'classnames'
import { ChatOpenAI } from "@langchain/openai"
import { HumanMessage, AIMessage } from "@langchain/core/messages"

const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
const baseUrl = import.meta.env.VITE_OPENROUTER_BASE_URL
const model = import.meta.env.VITE_OPENROUTER_MODEL
const temperature = import.meta.env.VITE_TEMPERATURE

export default function ChatContent() {

  const { sidebarOpen, setSidebarOpen } = useStore()
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<(HumanMessage | AIMessage)[]>([])

  const clickBox = () => {
    inputRef.current?.focus()
  }

  const handleChat = async () => {
    if (!value.trim() || loading) return

    setLoading(true)
    try {
      const humanMessage = new HumanMessage(value);
      setMessages(prev => [...prev, humanMessage])
      setValue('')

      const chat = new ChatOpenAI({
        modelName: model,
        temperature: temperature,
        streaming: true,
        openAIApiKey: apiKey,
      }, {
        basePath: baseUrl + "/api/v1",
        baseOptions: {
          headers: {
            "HTTP-Referer": import.meta.env.VITE_PUBLIC_APP_URL,
            "X-Title": "chattemp",
          },
        },
      });

      const aiMessage = new AIMessage("");
      setMessages(prev => [...prev, aiMessage]);

      const stream = await chat.stream([humanMessage]);

      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk.content;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = new AIMessage(fullText);
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleChat();
  }

  return (

    <div className="w-full h-screen bg-white flex flex-col">
      <header className='w-full h-[60px] flex justify-between items-center'>
        <div>
          {/* header left */}
          {
            !sidebarOpen && (
              <Tooltip title="关闭侧边栏">
                <IconButton onClick={() => setSidebarOpen(!sidebarOpen)}>
                  <ViewSidebarOutlinedIcon className='' />
                </IconButton>
              </Tooltip>
            )}
        </div>
      </header>
      {messages.length == 0 &&
        <section className='w-[50%] mx-auto mt-[50vh] -translate-y-[50%]'>
          {/* 输入框 */}
          <InputBox inputRef={inputRef} value={value} setValue={setValue} handleSubmit={handleSubmit} clickBox={clickBox} loading={loading} />
          <div className='w-full flex mt-2 gap-3'>
            {/* 一堆button按钮 */}
            <ToolButton title='创建图片' color='inherit' />
            <ToolButton title='分析图片' color='inherit' />
            <ToolButton title='帮我写' color='inherit' />
            <ToolButton title='提供建议' color='inherit' />
            <ToolButton title='总结文本' color='inherit' />
            <ToolButton title='更多' color='inherit' />
          </div>
        </section>
      }
      {/* 带上下文 */}
      {
        messages.length > 0 && (
          <div className='w-[50%] h-full mx-auto flex flex-col justify-between py-10'>
            <div className='flex flex-col gap-3 pb-10 overflow-y-auto'>
              {messages.map((message, index) => (
                <div key={index}>
                  {message._getType() === 'human' ? <HumanMessageRender content={message.content} /> : <AIMessageRender content={message.content} />}
                </div>
              ))}
            </div>
            <InputBox inputRef={inputRef} value={value} setValue={setValue} handleSubmit={handleSubmit} clickBox={clickBox} loading={loading} />
          </div>
        )
      }
    </div>
  )
}

const ToolButton = ({
  title,
  color
}: {
  title: string,
  color: string
}) => {
  return (
    <Button variant="text" className='px-2' sx={{ border: '1px solid #e0e0e0', borderRadius: '30px', color }}>
      <div className='px-2'>
        <span>{title}</span>
      </div>
    </Button>
  )
}

const HumanMessageRender = ({
  content
}: {
  content: string | object
}) => {
  const str = typeof content === 'string' ? content : JSON.stringify(content)

  return <div className='human-message flex flex-row-reverse'>
    <span className='bg-gray-100 px-5 py-3 rounded-3xl'>{str}</span>
  </div>
}

const AIMessageRender = ({
  content
}: {
  content: string | object
}) => {
  const str = typeof content === 'string' ? content : JSON.stringify(content)
  return <div className='ai-message flex gap-3'>
    <div className='bg-gray-100 py-3 rounded-full w-10 h-10 flex flex-shrink-0 justify-center items-center'>
      <AutoAwesomeOutlinedIcon />
    </div>
    <span>{str}</span>
  </div>
}

const InputBox = ({
  inputRef,
  value,
  setValue,
  handleSubmit,
  clickBox,
  loading
}: {
  inputRef: React.RefObject<HTMLInputElement>,
  value: string,
  setValue: (value: string) => void,
  handleSubmit: (e: React.FormEvent) => void,
  clickBox: () => void,
  loading: boolean
}) => {
  return (
    <section className='w-full gap-3 bg-gray-100 p-3 rounded-3xl'>
      <input ref={inputRef}
        className='outline-none border-none bg-transparent pl-3'
        placeholder='给AI发送消息'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSubmit(e)
          }
        }}
      />
      <div className='mt-2 flex justify-between' onClick={clickBox}>
        <Tooltip title="上传文件">
          <IconButton className='rounded-md'>
            <AttachmentIcon className='rotate-90 text-gray-800' />
          </IconButton>
        </Tooltip>
        <div
          className={cn('bg-black text-white flex justify-center items-center rounded-full w-10 h-10 cursor-pointer',
            value ? 'opacity-100' : 'opacity-50')}
          onClick={handleSubmit}
        >
          <ArrowUpwardIcon className={loading ? 'animate-spin' : ''} />
        </div>
      </div>
    </section>
  )
}
