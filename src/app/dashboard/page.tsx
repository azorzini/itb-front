import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import Dashboard from '@/components/Dashboard'

export default function DashboardPage() {
  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Sidebar - Always visible */}
      <div className="flex-shrink-0 h-full bg-white border-r border-gray-200 overflow-hidden">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Fixed Header */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200">
          <Header title="Dashboard" />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <Dashboard />
        </div>
      </div>
    </div>
  )
} 