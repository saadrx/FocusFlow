
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Target, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";

export default function GoalProgress() {
  const [goals, setGoals] = useLocalStorage("focusflow-goals", [
    { id: "1", title: "Complete Project Alpha", progress: 75, color: "bg-blue-500" },
    { id: "2", title: "Learn New Technology", progress: 45, color: "bg-green-500" },
    { id: "3", title: "Health & Fitness", progress: 60, color: "bg-purple-500" },
  ]);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [editingGoal, setEditingGoal] = useState(null);

  const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-red-500", "bg-pink-500"];

  const addGoal = () => {
    if (newGoalTitle.trim()) {
      const newGoal = {
        id: Date.now().toString(),
        title: newGoalTitle.trim(),
        progress: 0,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
      setGoals([...goals, newGoal]);
      setNewGoalTitle("");
    }
  };

  const updateProgress = (id, newProgress) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, progress: Math.max(0, Math.min(100, newProgress)) } : goal
    ));
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Goal Progress</h3>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex space-x-2">
          <Input
            placeholder="Add a new goal..."
            value={newGoalTitle}
            onChange={(e) => setNewGoalTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addGoal()}
            className="flex-1"
          />
          <Button onClick={addGoal} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="group">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">{goal.title}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{goal.progress}%</span>
                  <button
                    onClick={() => updateProgress(goal.id, goal.progress + 10)}
                    className="opacity-0 group-hover:opacity-100 text-green-600 hover:text-green-700 text-xs"
                  >
                    +10
                  </button>
                  <button
                    onClick={() => updateProgress(goal.id, goal.progress - 10)}
                    className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 text-xs"
                  >
                    -10
                  </button>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 cursor-pointer">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${goal.color}`}
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
