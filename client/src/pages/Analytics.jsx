
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart,
  ResponsiveContainer,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { Calendar, ChevronDown } from "lucide-react";

// Sample data for charts
const productivityData = [
  { name: "Mon", tasks: 4, hours: 6 },
  { name: "Tue", tasks: 7, hours: 7 },
  { name: "Wed", tasks: 5, hours: 5 },
  { name: "Thu", tasks: 6, hours: 8 },
  { name: "Fri", tasks: 8, hours: 9 },
  { name: "Sat", tasks: 3, hours: 4 },
  { name: "Sun", tasks: 2, hours: 3 },
];

const goalData = [
  { name: "Work", value: 40 },
  { name: "Personal", value: 30 },
  { name: "Education", value: 20 },
  { name: "Health", value: 10 },
];

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"];

const monthlyTrendData = [
  { name: "Jan", tasks: 42, goals: 2 },
  { name: "Feb", tasks: 55, goals: 3 },
  { name: "Mar", tasks: 67, goals: 5 },
  { name: "Apr", tasks: 73, goals: 4 },
  { name: "May", tasks: 78, goals: 6 },
  { name: "Jun", tasks: 62, goals: 3 },
];

export default function Analytics() {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Analytics</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="flex items-center space-x-1">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Last 7 days</span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
            <Button>Export Report</Button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tasks Completed</span>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-3xl font-semibold text-gray-900 dark:text-gray-100">35</span>
                    <span className="ml-2 text-sm text-green-600 dark:text-green-400">↑ 12%</span>
                  </div>
                  <span className="mt-1 text-sm text-gray-500 dark:text-gray-400">from last week</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Hours Productive</span>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-3xl font-semibold text-gray-900 dark:text-gray-100">42</span>
                    <span className="ml-2 text-sm text-green-600 dark:text-green-400">↑ 8%</span>
                  </div>
                  <span className="mt-1 text-sm text-gray-500 dark:text-gray-400">from last week</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Goals Achieved</span>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-3xl font-semibold text-gray-900 dark:text-gray-100">7</span>
                    <span className="ml-2 text-sm text-red-600 dark:text-red-400">↓ 3%</span>
                  </div>
                  <span className="mt-1 text-sm text-gray-500 dark:text-gray-400">from last week</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Efficiency Score</span>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-3xl font-semibold text-gray-900 dark:text-gray-100">82%</span>
                    <span className="ml-2 text-sm text-green-600 dark:text-green-400">↑ 5%</span>
                  </div>
                  <span className="mt-1 text-sm text-gray-500 dark:text-gray-400">from last week</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Analytics Content */}
          <Tabs defaultValue="productivity" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <TabsList>
                <TabsTrigger value="productivity">Productivity</TabsTrigger>
                <TabsTrigger value="goals">Goals</TabsTrigger>
                <TabsTrigger value="habits">Habits</TabsTrigger>
                <TabsTrigger value="time">Time Tracking</TabsTrigger>
              </TabsList>
              
              <Select defaultValue="weekly">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <TabsContent value="productivity" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Productivity Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={productivityData}
                          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="tasks" name="Tasks Completed" fill="#4F46E5" />
                          <Bar dataKey="hours" name="Hours Productive" fill="#10B981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Task Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={goalData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {goalData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={monthlyTrendData}
                          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="tasks" stroke="#4F46E5" name="Tasks" />
                          <Line type="monotone" dataKey="goals" stroke="#F59E0B" name="Goals" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Top Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Work Projects</span>
                          <span className="text-gray-700 dark:text-gray-300">45%</span>
                        </div>
                        <Progress value={45} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Personal Tasks</span>
                          <span className="text-gray-700 dark:text-gray-300">30%</span>
                        </div>
                        <Progress value={30} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Learning</span>
                          <span className="text-gray-700 dark:text-gray-300">20%</span>
                        </div>
                        <Progress value={20} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Health & Fitness</span>
                          <span className="text-gray-700 dark:text-gray-300">15%</span>
                        </div>
                        <Progress value={15} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Social Activities</span>
                          <span className="text-gray-700 dark:text-gray-300">10%</span>
                        </div>
                        <Progress value={10} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Productivity by Time of Day</h3>
                      <div className="grid grid-cols-4 gap-2">
                        <div className="text-center">
                          <div className="h-20 flex items-end justify-center">
                            <div className="w-8 bg-primary-200 dark:bg-primary-900/50" style={{ height: '30%' }}></div>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">Morning</span>
                        </div>
                        <div className="text-center">
                          <div className="h-20 flex items-end justify-center">
                            <div className="w-8 bg-primary-500" style={{ height: '90%' }}></div>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">Noon</span>
                        </div>
                        <div className="text-center">
                          <div className="h-20 flex items-end justify-center">
                            <div className="w-8 bg-primary-700" style={{ height: '75%' }}></div>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">Afternoon</span>
                        </div>
                        <div className="text-center">
                          <div className="h-20 flex items-end justify-center">
                            <div className="w-8 bg-primary-300 dark:bg-primary-800/70" style={{ height: '45%' }}></div>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">Evening</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="goals" className="mt-6">
              <Card>
                <CardContent className="p-12 text-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Goal Analytics Coming Soon</h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    This section will provide detailed analytics about your goals and progress.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="habits" className="mt-6">
              <Card>
                <CardContent className="p-12 text-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Habit Tracking Analytics Coming Soon</h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    This section will provide detailed analytics about your habits and consistency.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="time" className="mt-6">
              <Card>
                <CardContent className="p-12 text-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Time Tracking Analytics Coming Soon</h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    This section will provide detailed analytics about how you spend your time.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
