import Notepad from "@/components/dashboard/Notepad";
import MiniCalendar from "@/components/dashboard/MiniCalendar";
import TodoList from "@/components/dashboard/TodoList";
import GoalProgress from "@/components/dashboard/GoalProgress";
import HabitTracker from "@/components/dashboard/HabitTracker";
import RecentFiles from "@/components/dashboard/RecentFiles";
import WhiteboardPopup from "@/components/dashboard/WhiteboardPopup";

export default function Dashboard() {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Dashboard</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left section - Notes (takes up 2 columns) */}
            <div className="lg:col-span-2">
              <Notepad />
            </div>

            {/* Right section - Calendar and Tasks (each takes 1 column) */}
            <div className="lg:col-span-1">
              <MiniCalendar />
            </div>
            <div className="lg:col-span-1">
              <TodoList />
            </div>
          </div>

          {/* Second row - Goals, Habits, and Files */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GoalProgress />
            <HabitTracker />
            <RecentFiles />
          </div>

          {/* Third row - Whiteboard (full width) */}
          <div className="mt-6">
            <WhiteboardPopup />
          </div>
        </div>
      </div>
    </div>
  );
}