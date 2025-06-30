
import { Input } from "@/components/ui/input";
import { Bell, Search } from "lucide-react";
import { Link } from "wouter";

export default function Header({ sidebarOpen, setSidebarOpen }) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 z-10">
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-primary">FocusFlow</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative w-64">
            <Input
              type="text"
              placeholder="Search..."
              className="w-full pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <Bell className="h-6 w-6" />
          </button>

          <Link href="/profile">
            <a className="h-8 w-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center cursor-pointer transition-colors">
              <span className="text-sm text-gray-600 font-medium">JS</span>
            </a>
          </Link>
        </div>
      </div>
    </header>
  );
}
