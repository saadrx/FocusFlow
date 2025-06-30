
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plus } from "lucide-react";

export default function Goals() {
  const [goals] = useState([
    {
      id: "1",
      title: "Complete Project Proposal",
      dueText: "Due in 5 days",
      category: { name: "Work", color: "primary" },
      progress: 75,
      milestones: [
        { id: "1-1", text: "Research market trends", completed: true },
        { id: "1-2", text: "Draft executive summary", completed: true },
        { id: "1-3", text: "Create financial projections", completed: true },
        { id: "1-4", text: "Complete implementation timeline", completed: false },
      ],
    },
    {
      id: "2",
      title: "Study 10 Hours This Week",
      dueText: "3 days left",
      category: { name: "Education", color: "secondary" },
      progress: 40,
      progressText: "4/10 hours",
      statusItems: [
        { title: "Monday", value: "1.5 hours" },
        { title: "Tuesday", value: "2 hours" },
        { title: "Wednesday", value: "0.5 hours" },
      ],
    },
    {
      id: "3",
      title: "Write Daily Journal",
      dueText: "Ongoing",
      category: { name: "Personal", color: "accent" },
      progress: 90,
      statusItems: [
        { title: "This Month", value: "27/30 days" },
        { title: "Current Streak", value: "14 days" },
      ],
    },
  ]);

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Goals & Tracking</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {/* Goals toolbar */}
          <div className="flex items-center justify-between pb-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Active Goals</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Track your progress and stay motivated</p>
            </div>
            <Button className="px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-md hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800">
              Add New Goal
            </Button>
          </div>
          
          {/* Goals grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <Card key={goal.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${goal.category.color}-100 text-${goal.category.color}-800 dark:bg-${goal.category.color}-900 dark:text-${goal.category.color}-200`}>
                      {goal.category.name}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{goal.dueText}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">{goal.title}</h3>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="w-full" />
                  </div>
                  {goal.progressText && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{goal.progressText}</p>
                  )}
                  {goal.milestones && (
                    <div className="space-y-2">
                      {goal.milestones.map((milestone) => (
                        <div key={milestone.id} className="flex items-center space-x-2">
                          <div className={`w-4 h-4 rounded border-2 ${milestone.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600'}`}>
                            {milestone.completed && <div className="w-2 h-2 bg-white rounded-sm m-0.5"></div>}
                          </div>
                          <span className={`text-sm ${milestone.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                            {milestone.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            
            {/* Add Goal Card */}
            <Card className="bg-gray-50 dark:bg-gray-900/30 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3">
                  <Plus className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">Add new goal</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Set targets and track your progress</p>
                <Button className="mt-6 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800">
                  Create Goal
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Analytics section */}
          <div className="mt-10">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">Goal Analytics</h2>
            <Card className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Goal Completion Rate</h3>
                    <div className="mt-2 flex items-baseline">
                      <span className="text-3xl font-semibold text-gray-900 dark:text-gray-100">82%</span>
                      <span className="ml-2 text-sm text-green-600 dark:text-green-400">↑ 8%</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">from last month</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Goals</h3>
                    <div className="mt-2 flex items-baseline">
                      <span className="text-3xl font-semibold text-gray-900 dark:text-gray-100">7</span>
                      <span className="ml-2 text-sm text-green-600 dark:text-green-400">↑ 2</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">from last month</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed Goals</h3>
                    <div className="mt-2 flex items-baseline">
                      <span className="text-3xl font-semibold text-gray-900 dark:text-gray-100">12</span>
                      <span className="ml-2 text-sm text-green-600 dark:text-green-400">↑ 3</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">from last month</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Goal Categories</h3>
                  <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full mb-6">
                    <div className="absolute top-0 left-0 h-4 bg-primary-500 dark:bg-primary-600 rounded-l-full" style={{ width: "45%" }}></div>
                    <div className="absolute top-0 left-[45%] h-4 bg-secondary-500 dark:bg-secondary-600" style={{ width: "30%" }}></div>
                    <div className="absolute top-0 left-[75%] h-4 bg-accent-500 dark:bg-accent-600 rounded-r-full" style={{ width: "25%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-primary-500 dark:bg-primary-600 rounded-full mr-1"></span>
                      <span className="dark:text-gray-300">Work (45%)</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-secondary-500 dark:bg-secondary-600 rounded-full mr-1"></span>
                      <span className="dark:text-gray-300">Education (30%)</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-accent-500 dark:bg-accent-600 rounded-full mr-1"></span>
                      <span className="dark:text-gray-300">Personal (25%)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
