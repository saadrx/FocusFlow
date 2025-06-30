import Notepad from "@/components/dashboard/Notepad";
import MiniCalendar from "@/components/dashboard/MiniCalendar";
import TodoList from "@/components/dashboard/TodoList";
import GoalProgress from "@/components/dashboard/GoalProgress";
import HabitTracker from "@/components/dashboard/HabitTracker";
import RecentFiles from "@/components/dashboard/RecentFiles";
import WhiteboardPopup from "../components/dashboard/WhiteboardPopup";

export default function Dashboard() {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Dashboard</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Notepad and Whiteboard on the left */}
            <div className="md:col-span-2 space-y-6">
              <Notepad />
              <WhiteboardPopup />
            </div>

            {/* Calendar & Task Overview on the right */}
            <div className="space-y-6">
              <MiniCalendar />
              <TodoList />
            </div>
          </div>

          {/* Goals, Habits, and Files row */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GoalProgress />
            <HabitTracker />
            <RecentFiles />
          </div>
        </div>
      </div>
    </div>
  );
}