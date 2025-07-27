import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { authService } from "@/lib/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.login(email, password);
      // Redirect to dashboard on successful login
      setLocation("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Welcome Back
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Sign in to your account
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                {error && (
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                )}
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
              
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                Don't have an account?{" "}
                <Link href="/signup">
                  <a className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                    Sign up
                  </a>
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
