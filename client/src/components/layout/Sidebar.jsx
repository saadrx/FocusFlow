import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  Home,
  Calendar,
  FileText,
  BarChart3,
  Folder,
  PenTool,
  Settings,
  User,
  Lightbulb,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";

const NavItem = ({ href, icon, children, active }) => {
  return (
    <Link href={href}>
      <a
        className={cn(
          "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
          active
            ? "bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-500"
            : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50"
        )}
      >
        <span
          className={cn(
            "mr-3 h-5 w-5",
            active
              ? "text-primary-500 dark:text-primary-400"
              : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400"
          )}
        >
          {icon}
        </span>
        {children}
      </a>
    </Link>
  );
};

export default function Sidebar({ open }) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  if (!open) return null;

  return (
    <aside className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-64 flex-shrink-0 overflow-y-auto scrollbar-hide">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          <NavItem
            href="/"
            icon={<Home />}
            active={location === "/"}
          >
            Dashboard
          </NavItem>
          <NavItem
            href="/calendar"
            icon={<Calendar />}
            active={location === "/calendar"}
          >
            Calendar
          </NavItem>
          <NavItem
            href="/tasks"
            icon={<FileText />}
            active={location === "/tasks"}
          >
            Tasks
          </NavItem>
          <NavItem
            href="/goals"
            icon={<Lightbulb />}
            active={location === "/goals"}
          >
            Goals
          </NavItem>
          <NavItem
            href="/notes"
            icon={<PenTool />}
            active={location === "/notes"}
          >
            Notes
          </NavItem>
          <NavItem
            href="/files"
            icon={<Folder />}
            active={location === "/files"}
          >
            Files
          </NavItem>
          <NavItem
            href="/analytics"
            icon={<BarChart3 />}
            active={location === "/analytics"}
          >
            Analytics
          </NavItem>
          <NavItem href="/profile" icon={<User />} active={location === "/profile"}>
            Profile
          </NavItem>
          <NavItem href="/settings" icon={<Settings />} active={location === "/settings"}>
            Settings
          </NavItem>
        </div>
      </nav>


      <div className="mt-6 px-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200">
            Theme
          </h3>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={() => setTheme("spring")}
              className={cn(
                "w-6 h-6 bg-gradient-to-r from-green-200 to-green-400 rounded-full focus:outline-none",
                theme === "spring" &&
                  "ring-2 ring-offset-2 ring-green-400"
              )}
              aria-label="Spring theme"
            ></button>
            <button
              onClick={() => setTheme("summer")}
              className={cn(
                "w-6 h-6 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full focus:outline-none",
                theme === "summer" &&
                  "ring-2 ring-offset-2 ring-blue-400"
              )}
              aria-label="Summer theme"
            ></button>
            <button
              onClick={() => setTheme("autumn")}
              className={cn(
                "w-6 h-6 bg-gradient-to-r from-orange-300 to-yellow-200 rounded-full focus:outline-none",
                theme === "autumn" &&
                  "ring-2 ring-offset-2 ring-orange-400"
              )}
              aria-label="Autumn theme"
            ></button>
            <button
              onClick={() => setTheme("winter")}
              className={cn(
                "w-6 h-6 bg-gradient-to-r from-gray-300 to-blue-200 rounded-full focus:outline-none",
                theme === "winter" &&
                  "ring-2 ring-offset-2 ring-gray-400"
              )}
              aria-label="Winter theme"
            ></button>
          </div>
          <div className="mt-2">
            <button
              onClick={() => setTheme("system")}
              className={cn(
                "w-full py-1 px-2 text-xs bg-gray-100 dark:bg-gray-700 rounded focus:outline-none",
                theme === "system" &&
                  "ring-2 ring-offset-2 ring-indigo-500"
              )}
              aria-label="Auto (Seasonal)"
            >
              Auto
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}