import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Home, Camera, User, Trophy, Zap, Target, Calendar } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const UserProfilePage = () => {
  const [profile, setProfile] = useLocalStorage("focusflow-profile", {
    name: '',
    profession: '',
    age: '',
    education: '',
    location: '',
    bio: '',
    goals: '',
    motivations: '',
    concerns: '',
  });

  const [photo, setPhoto] = useLocalStorage("focusflow-profile-photo", null);
  const [photoPreview, setPhotoPreview] = useLocalStorage("focusflow-profile-photo-preview", null);

  // Get data from localStorage for achievements
  const [tasks] = useLocalStorage("focusflow-tasks", []);
  const [goals] = useLocalStorage("focusflow-goals", []);
  const [habits] = useLocalStorage("focusflow-habits", []);
  const [notes] = useLocalStorage("focusflow-notes", []);

  // Calculate achievements
  const completedTasks = tasks.filter(task => task.completed).length;
  const completedGoals = goals.filter(goal => goal.progress === 100).length;
  const totalNotes = notes.length;

  // Calculate streak (simplified - based on habits completion)
  const currentStreak = habits.reduce((maxStreak, habit) => {
    const consecutiveDays = habit.days?.reduce((streak, day, index) => {
      if (day.completed) return streak + 1;
      return 0;
    }, 0) || 0;
    return Math.max(maxStreak, consecutiveDays);
  }, 0);

  const achievements = [
    {
      id: 1,
      title: "Task Master",
      description: "Complete 10 tasks",
      icon: Target,
      unlocked: completedTasks >= 10,
      progress: Math.min(completedTasks, 10),
      total: 10,
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "Goal Achiever",
      description: "Complete 3 goals",
      icon: Trophy,
      unlocked: completedGoals >= 3,
      progress: Math.min(completedGoals, 3),
      total: 3,
      color: "bg-yellow-500"
    },
    {
      id: 3,
      title: "Streak Master",
      description: "Maintain a 7-day habit streak",
      icon: Zap,
      unlocked: currentStreak >= 7,
      progress: Math.min(currentStreak, 7),
      total: 7,
      color: "bg-orange-500"
    },
    {
      id: 4,
      title: "Note Taker",
      description: "Create 20 notes",
      icon: Calendar,
      unlocked: totalNotes >= 20,
      progress: Math.min(totalNotes, 20),
      total: 20,
      color: "bg-green-500"
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        setPhoto(file.name);
        setPhotoPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    // Profile data is automatically saved to localStorage via useLocalStorage hook
    console.log('Saved Profile:', profile);
    alert('Profile saved successfully to local storage!');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* Navigation */}
        <nav className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => (window.location.href = "/")}
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
        </nav>

        {/* Main Content */}
        <Card className="backdrop-blur-sm bg-card/95 border shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                User Profile
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Profile Photo and Basic Info */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <label htmlFor="photo-upload" className="cursor-pointer group">
                        <div className="w-32 h-32 rounded-full border-2 border-primary/20 overflow-hidden bg-muted flex items-center justify-center group-hover:border-primary/40 transition-colors">
                          {photoPreview ? (
                            <img
                              src={photoPreview}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Camera className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoUpload}
                        />
                      </label>
                    </div>

                    <div className="w-full space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={profile.name}
                          onChange={handleChange}
                          className="text-center"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="profession">Profession</Label>
                        <Input
                          id="profession"
                          name="profession"
                          value={profile.profession}
                          onChange={handleChange}
                          className="text-center"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="age">Age</Label>
                          <Input
                            id="age"
                            name="age"
                            value={profile.age}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="education">Education</Label>
                          <Input
                            id="education"
                            name="education"
                            value={profile.education}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            name="location"
                            value={profile.location}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Information */}
                  <div className="grid grid-cols-1 gap-4">
                    {['bio', 'goals', 'motivations', 'concerns'].map((field) => (
                      <Card key={field} className="bg-muted/50">
                        <CardContent className="p-4">
                          <Label htmlFor={field} className="text-sm font-medium capitalize mb-2 block">
                            {field}
                          </Label>
                          <Textarea
                            id={field}
                            name={field}
                            value={profile[field]}
                            onChange={handleChange}
                            className="min-h-[80px] resize-none"
                            placeholder={`Enter your ${field}...`}
                          />
                        </CardContent>
                      </Card>
                    ))}

                    <Button
                      onClick={handleSubmit}
                      className="w-full mt-4 bg-primary hover:bg-primary/90"
                      size="lg"
                    >
                      Save Profile
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="achievements" className="mt-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Your Achievements</h3>
                    <p className="text-sm text-muted-foreground">Track your progress and unlock new achievements</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement) => {
                      const IconComponent = achievement.icon;
                      return (
                        <Card key={achievement.id} className={`border-2 transition-all ${achievement.unlocked ? 'border-primary bg-primary/5' : 'border-muted'}`}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${achievement.unlocked ? achievement.color : 'bg-muted'}`}>
                                <IconComponent className={`h-5 w-5 ${achievement.unlocked ? 'text-white' : 'text-muted-foreground'}`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-foreground">{achievement.title}</h4>
                                  {achievement.unlocked && (
                                    <Badge variant="secondary" className="text-xs">
                                      Unlocked
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 bg-muted rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full transition-all ${achievement.unlocked ? achievement.color : 'bg-muted-foreground'}`}
                                      style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {achievement.progress}/{achievement.total}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  <div className="text-center">
                    <Card className="bg-muted/50 inline-block">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-primary" />
                          <span className="font-medium text-foreground">
                            {achievements.filter(a => a.unlocked).length} of {achievements.length} achievements unlocked
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfilePage;
