import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Check, X, Target } from "lucide-react";
import { useGoals } from "../hooks/useApi";

export default function Goals() {
  const { data: goals, loading, error, createItem: createGoal, updateItem: updateGoal, deleteItem: deleteGoal } = useGoals();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    dueDate: "",
    category: { name: "Work", color: "primary" },
    progress: 0,
    milestones: []
  });
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    category: { name: "Work", color: "primary" }
  });

  const categories = [
    { name: "Work", color: "bg-blue-500" },
    { name: "Personal", color: "bg-green-500" },
    { name: "Health", color: "bg-red-500" },
    { name: "Learning", color: "bg-purple-500" },
    { name: "Finance", color: "bg-yellow-500" },
    { name: "Other", color: "bg-gray-500" }
  ];

  const handleAddGoal = async () => {
    if (newGoal.title.trim()) {
      await createGoal(newGoal);
      setNewGoal({
        title: "",
        description: "",
        dueDate: "",
        category: { name: "Work", color: "primary" },
        progress: 0,
        milestones: []
      });
      setShowAddForm(false);
    }
  };

  const handleEditGoal = async (goalId) => {
    if (editForm.title.trim()) {
      await updateGoal(goalId, editForm);
      setEditingGoal(null);
      setEditForm({
        title: "",
        description: "",
        dueDate: "",
        category: { name: "Work", color: "primary" }
      });
    }
  };

  const startEdit = (goal) => {
    setEditingGoal(goal.id);
    setEditForm({
      title: goal.title,
      description: goal.description || "",
      dueDate: goal.dueDate || "",
      category: goal.category || { name: "Work", color: "primary" }
    });
  };

  const handleDeleteGoal = async (goalId) => {
    await deleteGoal(goalId);
  };

  const updateProgress = async (goalId, newProgress) => {
    await updateGoal(goalId, { progress: Math.max(0, Math.min(100, newProgress)) });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">Loading goals...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-8 text-red-500">Error loading goals: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Goals</h1>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Goal
        </Button>
      </div>

      {showAddForm && (
        <Card className="p-4">
          <div className="space-y-4">
            <Input
              placeholder="Goal title"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            />
            <Textarea
              placeholder="Goal description"
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
            />
            <Input
              type="date"
              value={newGoal.dueDate}
              onChange={(e) => setNewGoal({ ...newGoal, dueDate: e.target.value })}
            />
            <Select value={newGoal.category.name} onValueChange={(value) => {
              const selectedCategory = categories.find(cat => cat.name === value);
              setNewGoal({ ...newGoal, category: selectedCategory });
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button onClick={handleAddGoal} className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Add Goal
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {goals.map((goal) => (
          <Card key={goal.id} className="p-4">
            {editingGoal === goal.id ? (
              <div className="space-y-4">
                <Input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
                <Textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
                <Input
                  type="date"
                  value={editForm.dueDate}
                  onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                />
                <div className="flex gap-2">
                  <Button onClick={() => handleEditGoal(goal.id)} size="sm">
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={() => setEditingGoal(null)} size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{goal.title}</h3>
                    {goal.description && (
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    )}
                    {goal.dueDate && (
                      <p className="text-sm text-gray-500">Due: {new Date(goal.dueDate).toLocaleDateString()}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => startEdit(goal)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteGoal(goal.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-gray-500">{goal.progress || 0}%</span>
                  </div>
                  <Progress value={goal.progress || 0} className="h-2" />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateProgress(goal.id, (goal.progress || 0) + 10)}
                    >
                      +10%
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateProgress(goal.id, (goal.progress || 0) - 10)}
                    >
                      -10%
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No goals yet. Create your first goal to get started!
        </div>
      )}
    </div>
  );
}