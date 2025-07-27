import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Bell, LogOut, Zap, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { authService } from "@/lib/auth";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useState, useMemo, useEffect, useRef } from "react";

export default function Header({ sidebarOpen, setSidebarOpen }) {
  const [, setLocation] = useLocation();
  const user = authService.getUser();
  const [habits] = useLocalStorage("focusflow-habits", []);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);
  const [tasks] = useLocalStorage("focusflow-tasks", []);
  const [goals] = useLocalStorage("focusflow-goals", []);
  const [notes] = useLocalStorage("focusflow-notes", []);

  // Calculate current streak
  const currentStreak = habits.reduce((maxStreak, habit) => {
    const consecutiveDays = habit.days?.reduce((streak, day) => {
      if (day.completed) return streak + 1;
      return 0;
    }, 0) || 0;
    return Math.max(maxStreak, consecutiveDays);
  }, 0);

  const handleLogout = () => {
    authService.logout();
    setLocation("/login");
  };

  // Search functionality
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results = [];

    // Search tasks
    tasks.forEach(task => {
      if (task.title?.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)) {
        results.push({
          type: 'task',
          id: task.id,
          title: task.title,
          description: task.description,
          completed: task.completed,
          path: '/tasks'
        });
      }
    });

    // Search goals
    goals.forEach(goal => {
      if (goal.title?.toLowerCase().includes(query) ||
        goal.description?.toLowerCase().includes(query)) {
        results.push({
          type: 'goal',
          id: goal.id,
          title: goal.title,
          description: goal.description,
          progress: goal.progress,
          path: '/goals'
        });
      }
    });

    // Search notes
    notes.forEach(note => {
      if (note.title?.toLowerCase().includes(query) ||
        note.content?.toLowerCase().includes(query)) {
        results.push({
          type: 'note',
          id: note.id,
          title: note.title,
          content: note.content,
          path: '/notes'
        });
      }
    });

    return results.slice(0, 10); // Limit to 10 results
  }, [searchQuery, tasks, goals, notes]);

  const handleSearchSelect = (result) => {
    setLocation(result.path);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
          {/* Search */}
          <div className="relative w-64" ref={searchRef}>
            <Input
              type="search"
              placeholder="Search tasks, goals, notes..."
              className="w-full pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
            />
            <Search className="absolute right-8 top-2.5 h-4 w-4 text-gray-400" />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setShowSearchResults(false);
                }}
                className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Search Results Dropdown */}
            {showSearchResults && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="p-2">
                    {searchResults.map((result) => (
                      <button
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleSearchSelect(result)}
                        className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {result.type}
                              </Badge>
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                {result.title}
                              </span>
                            </div>
                            {result.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                                {result.description}
                              </p>
                            )}
                            {result.content && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                                {result.content}
                              </p>
                            )}
                          </div>
                          {result.type === 'task' && (
                            <Badge variant={result.completed ? "default" : "secondary"}>
                              {result.completed ? "Completed" : "Pending"}
                            </Badge>
                          )}
                          {result.type === 'goal' && (
                            <Badge variant="outline">
                              {result.progress}%
                            </Badge>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Streak Counter */}
          <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full">
            <Zap className="h-4 w-4 text-orange-500" />
            <Badge variant="secondary" className="bg-transparent border-none text-orange-700 dark:text-orange-300 font-medium">
              {currentStreak} day streak
            </Badge>
          </div>

          <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <Bell className="h-6 w-6" />
          </button>

          <div className="flex items-center space-x-2">
            <Link href="/profile">
              <a className="h-8 w-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center cursor-pointer transition-colors">
                <span className="text-sm text-gray-600 font-medium">
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                </span>
              </a>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}