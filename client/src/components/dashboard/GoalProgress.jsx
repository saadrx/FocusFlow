
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Target, Plus, Trash2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";

export default function GoalProgress() {
  const [goals, setGoals] = useLocalStorage("focusflow-goals", []);
  const [newGoalTitle, setNewGoalTitle] = useState("");

  const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-red-500", "bg-pink-500"];

  // Show only top 3 goals for dashboard
  const dashboardGoals = goals.slice(0, 3);

  const addGoal = () => {
    if (newGoalTitle.trim()) {
      const newGoal = {
        id: Date.now().toString(),
        title: newGoalTitle.trim(),
        description: "",
        dueDate: "",
        category: { name: "Work", color: "primary" },
        progress: 0,
        milestones: []
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

  const getColorForGoal = (index) => {
    return colors[index % colors.length];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Goal Progress</h3>
          </div>
          {goals.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = "/goals"}
              className="text-blue-600 hover:text-blue-700"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
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
          {dashboardGoals.map((goal, index) => (
            <div key={goal.id} className="group">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 truncate pr-2">{goal.title}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{goal.progress}%</span>
                  <button
                    onClick={() => updateProgress(goal.id, goal.progress + 10)}
                    className="opacity-0 group-hover:opacity-100 text-green-600 hover:text-green-700 text-xs"
                    disabled={goal.progress >= 100}
                  >
                    +10
                  </button>
                  <button
                    onClick={() => updateProgress(goal.id, goal.progress - 10)}
                    className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 text-xs"
                    disabled={goal.progress <= 0}
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
                  className={`h-2 rounded-full transition-all duration-300 ${getColorForGoal(index)}`}
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
              {goal.category && (
                <div className="mt-1 flex justify-between items-center">
                  <span className="text-xs text-gray-500">{goal.category.name}</span>
                  {goal.dueDate && goal.dueDate !== "ongoing" && (
                    <span className="text-xs text-gray-400">
                      Due: {new Date(goal.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}

          {dashboardGoals.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <Target className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No goals yet. Add your first goal!</p>
            </div>
          )}
        </div>

        {goals.length > 3 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = "/goals"}
              className="w-full text-blue-600 hover:text-blue-700"
            >
              View all {goals.length} goals
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
