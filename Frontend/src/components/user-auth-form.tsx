"use client"

import * as React from "react"
import { useState } from "react" // Import useState

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/registry/ui/button"
import { Input } from "@/registry/ui/input"
import { Label } from "@/registry/ui/label"
import { runSignup } from "../contoller/signup" // Import your signup function

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // Add state for username and password
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault(); // Prevent default form submission page reload
        setIsLoading(true);
        // You can perform any synchronous task here
        const processedUsername = username.trim().toLowerCase();
        
        // --- Other Purpose (e.g., calling your backend API) ---
        try {
          
          await runSignup(processedUsername, password); // Call the signup function with processed username and password
          window.Cookies.set("username", processedUsername, { path: "/" }); // Set cookie for username


        } catch (error) {
            console.error("Login API call failed:", error);
            // Handle login error (e.g., show error message to user)
        } finally {
            setIsLoading(false); // Stop loading indicator regardless of success/failure
        }
        // -----------------------------------------------------
    }

    // Remove these lines - we use state now
    // const username = document.getElementById("user") as HTMLInputElement;
    // const password = document.getElementById("password");

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={onSubmit}>
                <div className="grid gap-2">
                    <div className="grid gap-1">
                        {/* Use htmlFor for accessibility */}
                        <Label htmlFor="username-input">Username</Label>
                        <Input
                            id="username-input" // Match htmlFor
                            placeholder="username"
                            type="text" // Use text type
                            autoCapitalize="none"
                            // Use state for value and update state onChange
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username" // Correct autocomplete value
                            autoCorrect="off"
                            disabled={isLoading}
                        />

                        <Label htmlFor="password-input">Password</Label>
                        <Input
                            id="password-input" // Match htmlFor
                            placeholder="password"
                            type="password" // Use password type
                            autoCapitalize="none"
                            // Use state for value and update state onChange
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password" // Correct autocomplete value
                            autoCorrect="off"
                            disabled={isLoading}
                        />
                    </div>
                    <Button type="submit" disabled={isLoading}> {/* Ensure button type is submit */}
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Continue
                    </Button>
                </div>
            </form>
            {/* Rest of the component remains the same... */}
            <div className="relative">
              {/* ... */}
            </div>
            <Button variant="outline" type="button" disabled={isLoading}>
             {/* ... */}
            </Button>
        </div>
    )
}