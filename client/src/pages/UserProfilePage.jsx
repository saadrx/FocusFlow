
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Home, Camera, User } from "lucide-react";

const UserProfilePage = () => {
  const [profile, setProfile] = useState({
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

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    // Backend integration goes here
    console.log('Saved Profile:', profile);
    alert('Profile saved successfully (fake save for now)');
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfilePage;
