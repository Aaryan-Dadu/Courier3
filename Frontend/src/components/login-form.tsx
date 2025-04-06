import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom"; // Make sure useNavigate is imported
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { runLogin } from "../contoller/login";
import Cookies from 'js-cookie';
import { hashPassword } from '@/utils';

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function LoginForm({ className, ...props }: LoginFormProps) {
  // --- Call useNavigate at the top level ---
  const navigate = useNavigate(); // Correct placement

  // --- State Initialization ---
  const [username, setUsername] = useState(() => {
    const savedUsername = Cookies.get("username");
    return savedUsername || '';
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- Submit Handler ---
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const processedUsername = username.trim().toLowerCase();
    console.log("Attempting login with:", { processedUsername, password });

    try {
      // Call your login function
      await runLogin(processedUsername, password);

      // Check existing cookie before setting
      const currentCookieValue = Cookies.get("username");
      const currentPass = Cookies.get("password");
      const hashPass = hashPassword(password);
      console.log(hashPass);
      if (currentCookieValue !== processedUsername) {
        console.log(`Setting cookie for ${processedUsername}.`);
        Cookies.set("username", processedUsername, { path: "/", expires: 7 });
      } else {
        console.log(`Username cookie already set correctly for ${processedUsername}.`);
      }
      
      if(currentPass != hashPass) Cookies.set("password", hashPass, { path: "/", expires: 7 });
      console.log("Login successful.");

      // --- Use the navigate function obtained from the hook ---
      navigate('/mail'); // Use the function here for redirection

      // NOTE: Setting state after navigate might cause a warning if component unmounts quickly.
      // It's often better to let the navigation handle the loading state implicitly.

    } catch (err) {
      console.error("Login failed:", err);
      setError(err instanceof Error ? err.message : "An unknown login error occurred.");
      // Only set loading to false on error, as success leads to navigation
      setIsLoading(false);
    }
    // Removed finally block for setIsLoading(false) due to potential unmount on navigation
  };

  // --- JSX ---
  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center bg-gray-550 p-4",
        className
      )}
      {...props}
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your details below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* ... form inputs and buttons ... */}
             <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="your_username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="your_password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                  onClick={() => console.log("Login with Metamask clicked")}
                  disabled={isLoading}
                >
                  Login with Metamask
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="underline underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}