import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Package, 
  FileTerminal, 
  HelpCircle, 
  Settings,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react'

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showText, setShowText] = useState(true)
  const location = useLocation()

  useEffect(() => {
    if (!isCollapsed) {
      setTimeout(() => setShowText(true), 200)
    } else {
      setShowText(false)
    }
  }, [isCollapsed])
  
  const mainMenuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: FileText, label: 'Invoices', path: '/invoices' },
    { icon: Users, label: 'Clients', path: '/clients' },
    { icon: Package, label: 'Products', path: '/products' },
  ]

  const otherMenuItems = [
    { icon: FileTerminal, label: 'Templates', path: '/templates' },
    { icon: HelpCircle, label: 'Help & Support', path: '/help' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ]
  
  return (
    <div className={`${isCollapsed ? 'w-18' : 'w-64'} bg-black text-white h-[98%] flex flex-col rounded-[20px] self-center transition-all duration-500 ease-in-out`}>
     
      <div className={`${isCollapsed ? 'p-3 justify-center' : 'p-5 justify-between '} flex items-center border-b border-gray-800 relative transition-all duration-500 ease-in-out`}>
        <div className="flex items-center gap-2">
          {!isCollapsed && <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">I</span>
          </div>}
          {showText && !isCollapsed && <span className="font-semibold">Veinvo</span>}
        </div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {isCollapsed ? <div className='w-10 h-10 rounded-full bg-purple-600 flex justify-center items-center'><ChevronsRight className="w-4 h-4 text-white"/></div> : <ChevronsLeft className="w-5 h-5 text-white" />}
        </button>
      </div>

      <div className={`flex-1 ${isCollapsed ? 'px-2 py-4' : 'px-5 py-6'} transition-all duration-500 ease-in-out`}>
        <div className="mb-8">
          {showText && !isCollapsed && (
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              MAIN
            </h3>
          )}
          <nav className="space-y-2">
            {mainMenuItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'} rounded-full transition-colors ${
                    isActive 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {showText && !isCollapsed && <span>{item.label}</span>}
                </Link>
              )
            })}
          </nav>
        </div>

        <div>
          {showText && !isCollapsed && (
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              OTHERS
            </h3>
          )}
          <nav className="space-y-2">
            {otherMenuItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                key={item.path}
                to={item.path}
                className={`flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'} rounded-full transition-colors ${
                  isActive 
                  ? 'bg-purple-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                      title={isCollapsed ? item.label : undefined}
                      >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {showText && !isCollapsed && <span>{item.label}</span>}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}
