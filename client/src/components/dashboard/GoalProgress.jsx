
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Plus, Target, X } from "lucide-react";
import { useApi } from "../../hooks/useApi";

export default function GoalProgress() {
  const { data: goals, loading, error, createItem: createGoal, updateItem: updateGoal, deleteItem: deleteGoal } = useApi('/api/goals');
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");

  const handleAddGoal = async () => {
    if (newGoalTitle.trim()) {
      await createGoal({
        title: newGoalTitle.trim(),
        description: newGoalDescription.trim(),
        progress: 0,
        target_date: null
      });
      setNewGoalTitle("");
      setNewGoalDescription("");
      setShowAddGoal(false);
    }
  };

  const updateProgress = async (goalId, newProgress) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      await updateGoal(goalId, {
        ...goal,
        progress: Math.max(0, Math.min(100, newProgress))
      });
    }
  };

  const displayGoals = goals || [];

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading goals...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="h-5 w-5" />
          Goals
        </CardTitle>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowAddGoal(!showAddGoal)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddGoal && (
          <div className="space-y-2 p-3 border rounded-lg">
            <Input
              placeholder="Goal title"
              value={newGoalTitle}
              onChange={(e) => setNewGoalTitle(e.target.value)}
            />
            <Input
              placeholder="Description (optional)"
              value={newGoalDescription}
              onChange={(e) => setNewGoalDescription(e.target.value)}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddGoal}>
                Add Goal
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowAddGoal(false);
                  setNewGoalTitle("");
                  setNewGoalDescription("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4 max-h-64 overflow-y-auto">
          {displayGoals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">{goal.title}</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteGoal(goal.id)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              {goal.description && (
                <p className="text-xs text-muted-foreground">{goal.description}</p>
              )}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>Progress</span>
                  <span>{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateProgress(goal.id, goal.progress - 10)}
                    className="h-6 text-xs"
                  >
                    -10%
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateProgress(goal.id, goal.progress + 10)}
                    className="h-6 text-xs"
                  >
                    +10%
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {displayGoals.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No goals yet. Set one to start tracking your progress!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
