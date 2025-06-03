'use client'

import { usePathname } from 'next/navigation'
import { 
  HomeIcon, 
  StrategiesIcon, 
  InvoicesIcon, 
  DiscoverIcon, 
  SettingsIcon, 
  NotificationsIcon, 
  LogoIcon 
} from './icons'

interface NavigationItem {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  path: string
  disabled?: boolean
}

const navigationItems: NavigationItem[] = [
  { id: 'dashboard', name: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
  { id: 'strategies', name: 'Strategies', icon: StrategiesIcon, path: '/strategies', disabled: true },
  { id: 'invoices', name: 'Invoices', icon: InvoicesIcon, path: '/invoices', disabled: true },
  { id: 'apr', name: 'APR Analysis', icon: DiscoverIcon, path: '/apr', disabled: true },
  { id: 'settings', name: 'Settings', icon: SettingsIcon, path: '/settings', disabled: true },
]

export default function Sidebar() {
  const pathname = usePathname()

  const getActiveItem = () => {
    const activeItem = navigationItems.find(item => item.path === pathname)
    return activeItem?.id || 'dashboard'
  }

  return (
    <div className="h-full w-[63px] pt-5 pb-5 flex flex-col justify-between bg-white border-r border-gray-200">
      {/* Logo Section */}
      <div className="mb-[54px]">
        <div className="flex justify-center">
          <LogoIcon className="text-[#2E71F0]" width={25} height={25} />
        </div>
      </div>

      {/* Navigation Section */}
      <div className="flex-1">
        <div className="flex flex-col gap-5">
          {navigationItems.map((item) => {
            const IconComponent = item.icon
            return (
              <div key={item.id} className="flex justify-center">
                {item.disabled ? (
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center cursor-not-allowed"
                    title={`${item.name} (Disabled)`}
                  >
                    <IconComponent className="text-gray-400" />
                  </div>
                ) : (
                  <button
                    onClick={() => window.location.href = item.path}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      getActiveItem() === item.id 
                        ? 'bg-blue-100' 
                        : 'hover:bg-gray-100'
                    }`}
                    title={item.name}
                  >
                    <IconComponent 
                      className={getActiveItem() === item.id ? 'text-[#2E71F0]' : 'text-gray-600'} 
                    />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-5 items-center">
        <div className="w-10 h-10 flex items-center justify-center cursor-not-allowed">
          <NotificationsIcon className="text-gray-400" width={20} height={20} />
        </div>
        <div className="w-8 h-8 bg-[#23366E] rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-medium">MC</span>
        </div>
      </div>
    </div>
  )
} 