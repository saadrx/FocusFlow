
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Check, X, Target } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function Goals() {
  // Normalize goals data to ensure all required properties exist
  const normalizeGoals = (goalsList) => {
    return goalsList.map(goal => ({
      ...goal,
      category: goal.category || { name: "Work", color: "primary" },
      milestones: goal.milestones || [],
      progress: goal.progress || 0
    }));
  };

  const [rawGoals, setRawGoals] = useLocalStorage("focusflow-goals", []);
  const goals = normalizeGoals(rawGoals);
  const setGoals = (newGoals) => setRawGoals(normalizeGoals(newGoals));

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
    { name: "Work", color: "primary" },
    { name: "Education", color: "secondary" },
    { name: "Personal", color: "accent" },
    { name: "Health", color: "green" },
    { name: "Finance", color: "blue" }
  ];

  const addGoal = () => {
    if (newGoal.title.trim()) {
      const goal = {
        ...newGoal,
        id: Date.now().toString(),
        milestones: []
      };
      setGoals([...goals, goal]);
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

  const updateGoal = (id, updates) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, ...updates } : goal
    ));
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const updateProgress = (id, newProgress) => {
    updateGoal(id, { progress: Math.max(0, Math.min(100, newProgress)) });
  };

  const startEditingGoal = (goal) => {
    setEditingGoal(goal.id);
    setEditForm({
      title: goal.title,
      description: goal.description,
      dueDate: goal.dueDate,
      category: goal.category
    });
  };

  const saveEditedGoal = () => {
    updateGoal(editingGoal, editForm);
    setEditingGoal(null);
    setEditForm({
      title: "",
      description: "",
      dueDate: "",
      category: { name: "Work", color: "primary" }
    });
  };

  const cancelEdit = () => {
    setEditingGoal(null);
    setEditForm({
      title: "",
      description: "",
      dueDate: "",
      category: { name: "Work", color: "primary" }
    });
  };

  const addMilestone = (goalId, milestoneText) => {
    if (milestoneText.trim()) {
      const goal = goals.find(g => g.id === goalId);
      const newMilestone = {
        id: `${goalId}-${Date.now()}`,
        text: milestoneText.trim(),
        completed: false
      };
      updateGoal(goalId, {
        milestones: [...(goal.milestones || []), newMilestone]
      });
    }
  };

  const toggleMilestone = (goalId, milestoneId) => {
    const goal = goals.find(g => g.id === goalId);
    const updatedMilestones = goal.milestones.map(m =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    const completedCount = updatedMilestones.filter(m => m.completed).length;
    const newProgress = updatedMilestones.length > 0 
      ? Math.round((completedCount / updatedMilestones.length) * 100)
      : goal.progress;
    
    updateGoal(goalId, { 
      milestones: updatedMilestones,
      progress: newProgress
    });
  };

  const getDueDateText = (dueDate) => {
    if (dueDate === "ongoing") return "Ongoing";
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    return `Due in ${diffDays} days`;
  };

  const completedGoals = goals.filter(g => g.progress === 100).length;
  const averageProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
    : 0;

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Goals & Tracking</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Track your progress and stay motivated</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-md hover:bg-primary-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Goal
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Active Goals</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{goals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Check className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{completedGoals}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm font-bold">{averageProgress}%</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Average Progress</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{averageProgress}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Goal Form */}
        {showAddForm && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Add New Goal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  placeholder="Goal title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                />
                <Input
                  type="date"
                  value={newGoal.dueDate}
                  onChange={(e) => setNewGoal({...newGoal, dueDate: e.target.value})}
                />
              </div>
              <Textarea
                placeholder="Goal description"
                value={newGoal.description}
                onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                className="mb-4"
              />
              <div className="flex items-center space-x-4">
                <Select value={newGoal.category.name} onValueChange={(value) => {
                  const category = categories.find(c => c.name === value);
                  setNewGoal({...newGoal, category});
                }}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={addGoal}>Add Goal</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <Card key={goal.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}>
                    {goal.category?.name || 'Uncategorized'}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEditingGoal(goal)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteGoal(goal.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {editingGoal === goal.id ? (
                  <div className="space-y-3 mb-4">
                    <Input
                      value={editForm.title}
                      onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                      className="text-lg font-semibold"
                    />
                    <Textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      placeholder="Goal description"
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={editForm.dueDate}
                        onChange={(e) => setEditForm({...editForm, dueDate: e.target.value})}
                        className="flex-1"
                      />
                      <Select value={editForm.category.name} onValueChange={(value) => {
                        const category = categories.find(c => c.name === value);
                        setEditForm({...editForm, category});
                      }}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveEditedGoal}>
                        <Check className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        <X className="h-3 w-3 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{goal.title}</h3>
                    {goal.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{goal.description}</p>
                    )}
                  </>
                )}
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="w-full" />
                  <div className="flex justify-between mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateProgress(goal.id, goal.progress - 10)}
                      disabled={goal.progress === 0}
                    >
                      -10%
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateProgress(goal.id, goal.progress + 10)}
                      disabled={goal.progress === 100}
                    >
                      +10%
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {getDueDateText(goal.dueDate)}
                </p>

                {/* Milestones */}
                {goal.milestones && goal.milestones.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Milestones</h4>
                    {goal.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleMilestone(goal.id, milestone.id)}
                          className={`w-4 h-4 rounded border-2 ${
                            milestone.completed 
                              ? 'bg-green-500 border-green-500' 
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                        >
                          {milestone.completed && <Check className="w-3 h-3 text-white" />}
                        </button>
                        <span className={`text-sm ${
                          milestone.completed 
                            ? 'line-through text-gray-500' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {milestone.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add milestone input */}
                <div className="mt-4">
                  <Input
                    placeholder="Add milestone..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        addMilestone(goal.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add Goal Card */}
          <Card 
            className="bg-gray-50 dark:bg-gray-900/30 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 cursor-pointer hover:border-gray-400"
            onClick={() => setShowAddForm(true)}
          >
            <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
              <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3">
                <Plus className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">Add new goal</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Set targets and track your progress</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
