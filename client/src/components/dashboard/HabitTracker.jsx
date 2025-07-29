import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, Plus, Target } from "lucide-react";
import { useApi } from "@/hooks/useApi";

export default function HabitTracker() {
  const { data: habits, loading, error, updateItem: updateHabit } = useApi('/api/habits');

  const toggleHabitDay = async (habitId, dayIndex) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    try {
      const updatedDays = [...(habit.days || [])];
      if (!updatedDays[dayIndex]) {
        updatedDays[dayIndex] = { completed: false };
      }
      updatedDays[dayIndex] = {
        ...updatedDays[dayIndex],
        completed: !updatedDays[dayIndex].completed
      };

      await updateHabit(habitId, { ...habit, days: updatedDays });
    } catch (error) {
      console.error('Error updating habit:', error);
    }
  };

  const calculateStreak = (days) => {
    if (!days || days.length === 0) return 0;
    let streak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i]?.completed) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const calculateProgress = (days) => {
    if (!days || days.length === 0) return 0;
    const completedDays = days.filter(day => day?.completed).length;
    return Math.round((completedDays / days.length) * 100);
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <h3 className="text-lg font-semibold">Habit Tracker</h3>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">Loading habits...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <h3 className="text-lg font-semibold">Habit Tracker</h3>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500">Error loading habits</div>
        </CardContent>
      </Card>
    );
  }

  const activeHabits = habits ? habits.filter(habit => !habit.completed).slice(0, 3) : [];

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-lg font-semibold">Habit Tracker</h3>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {activeHabits.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            <Target className="mx-auto h-8 w-8 mb-2" />
            <p className="text-sm">No active habits</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeHabits.map((habit) => {
              const streak = calculateStreak(habit.days);
              const progress = calculateProgress(habit.days);
              const last7Days = (habit.days || []).slice(-7);

              return (
                <div key={habit.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{habit.name}</h4>
                    <div className="text-xs text-gray-500">
                      {streak} day streak
                    </div>
                  </div>

                  <Progress value={progress} className="h-2" />

                  <div className="flex space-x-1">
                    {Array.from({ length: 7 }, (_, i) => {
                      const dayData = last7Days[i];
                      const isCompleted = dayData?.completed || false;

                      return (
                        <button
                          key={i}
                          onClick={() => toggleHabitDay(habit.id, (habit.days?.length || 0) - 7 + i)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isCompleted
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-gray-300 hover:border-green-400'
                          }`}
                        >
                          {isCompleted && <Check className="h-3 w-3" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}