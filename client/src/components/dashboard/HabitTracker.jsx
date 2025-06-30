
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RotateCcw, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";

export default function HabitTracker() {
  const [habits, setHabits] = useLocalStorage("focusflow-habits", [
    {
      id: "1",
      name: "Exercise",
      days: [
        { letter: "M", completed: true },
        { letter: "T", completed: true },
        { letter: "W", completed: false },
        { letter: "Th", completed: true },
        { letter: "F", completed: false },
        { letter: "Sa", completed: true },
        { letter: "Su", completed: false },
      ],
      color: "bg-green-500"
    },
    {
      id: "2",
      name: "Reading",
      days: [
        { letter: "M", completed: true },
        { letter: "T", completed: false },
        { letter: "W", completed: true },
        { letter: "Th", completed: true },
        { letter: "F", completed: true },
        { letter: "Sa", completed: false },
        { letter: "Su", completed: true },
      ],
      color: "bg-blue-500"
    },
    {
      id: "3",
      name: "Meditation",
      days: [
        { letter: "M", completed: false },
        { letter: "T", completed: true },
        { letter: "W", completed: true },
        { letter: "Th", completed: false },
        { letter: "F", completed: true },
        { letter: "Sa", completed: true },
        { letter: "Su", completed: true },
      ],
      color: "bg-purple-500"
    },
  ]);
  const [newHabitName, setNewHabitName] = useState("");

  const colors = ["bg-green-500", "bg-blue-500", "bg-purple-500", "bg-orange-500", "bg-red-500", "bg-pink-500"];

  const addHabit = () => {
    if (newHabitName.trim()) {
      const newHabit = {
        id: Date.now().toString(),
        name: newHabitName.trim(),
        days: [
          { letter: "M", completed: false },
          { letter: "T", completed: false },
          { letter: "W", completed: false },
          { letter: "Th", completed: false },
          { letter: "F", completed: false },
          { letter: "Sa", completed: false },
          { letter: "Su", completed: false },
        ],
        color: colors[Math.floor(Math.random() * colors.length)]
      };
      setHabits([...habits, newHabit]);
      setNewHabitName("");
    }
  };

  const toggleDay = (habitId, dayIndex) => {
    setHabits(habits.map(habit => 
      habit.id === habitId 
        ? {
            ...habit,
            days: habit.days.map((day, index) => 
              index === dayIndex ? { ...day, completed: !day.completed } : day
            )
          }
        : habit
    ));
  };

  const deleteHabit = (habitId) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <RotateCcw className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Habit Tracker</h3>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex space-x-2">
          <Input
            placeholder="Add a new habit..."
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addHabit()}
            className="flex-1"
          />
          <Button onClick={addHabit} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {habits.map((habit) => (
            <div key={habit.id} className="group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{habit.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {habit.days.filter(d => d.completed).length}/7
                  </span>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div className="flex space-x-1">
                {habit.days.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => toggleDay(habit.id, index)}
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all hover:scale-110
                      ${day.completed 
                        ? `${habit.color} text-white` 
                        : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                      }
                    `}
                  >
                    {day.letter}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
