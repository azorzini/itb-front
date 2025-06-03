import { SearchIcon } from './icons'

interface HeaderProps {
  title: string
}

export default function Header({ title }: HeaderProps) {
  return (
    <div className="h-16 py-3 sm:py-5 px-3 sm:px-4 md:px-10 flex items-center justify-between bg-white border-b border-gray-200">
      <h1 className="font-bold text-lg sm:text-xl text-[#333335] font-[Inter] truncate pr-2">
        {title}
      </h1>
      
      <div className="relative flex-shrink-0">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <SearchIcon className="text-gray-400" width={16} height={16} />
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-[150px] sm:w-[200px] md:w-[300px] lg:w-[350px] text-sm"
        />
      </div>
    </div>
  )
} 