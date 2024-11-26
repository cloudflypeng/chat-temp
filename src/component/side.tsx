import { motion } from "motion/react"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import useStore from '../store/useStore';

export default function Side() {
  const { sidebarOpen, setSidebarOpen } = useStore()

  return (<motion.div animate={{ width: sidebarOpen ? '300px' : '0px' }}
    initial={{ width: '0px' }}
    transition={{ duration: 0.3 }}
    exit={{ width: '0px' }}
  >
    <div className='h-screen bg-gray-100 px-3'>
      {
        sidebarOpen && (
          <div className='flex justify-between items-center h-[60px]'>
            {/* 关闭侧边栏和新聊天 */}
            <Tooltip title="关闭侧边栏">
              <IconButton onClick={() => setSidebarOpen(!sidebarOpen)}>
                <ViewSidebarOutlinedIcon className='' />
              </IconButton>
            </Tooltip>
            <Tooltip title="新聊天">
              <IconButton>
                <AddCircleOutlineIcon className='' />
              </IconButton>
            </Tooltip>
          </div>
        )}
      {/* 功能区域 */}
      <section className='flex flex-col gap-3 pl-2'>
        <div className='flex items-center gap-2'>
          <span>ChatGPT</span>
        </div>
        <div className='flex items-center gap-2'>
          <span>Logo Creator</span>
        </div>
        <div className='flex items-center gap-2'>
          <span>探索GPT</span>
        </div>
      </section>
    </div>
  </motion.div>
  )
}
