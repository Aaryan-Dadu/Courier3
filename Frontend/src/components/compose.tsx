"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/registry/ui/button"; // Assuming paths are correct
import { Label } from "@/registry/ui/label";
import { Separator } from "@/registry/ui/separator";
import { Textarea } from "@/registry/ui/textarea";
import { Input } from "@/registry/ui/input";
import { GridDot } from "@/components/GridDot"; // Adjust path if needed
import { runSend } from "@/contoller/send"; // Import your send function
import Cookies from 'js-cookie'; // You correctly imported the library here

export default function ComposeMail() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State for loading
  const [error, setError] = useState<string | null>(null); // State for errors
  const [success, setSuccess] = useState<string | null>(null); // State for success message

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    setIsLoading(true); // Set loading state to true
    setError(null);     // Clear previous errors
    setSuccess(null);   // Clear previous success message

    // --- FIX STARTS HERE ---
    // Get the cookie using the imported 'Cookies' object, not 'window.Cookies'
    const senderUsername = Cookies.get("username");

    console.log("Attempting to send mail:", { senderUsername, to, subject, message }); // Log data being sent

    // Check if the cookie was found AND is not an empty string
    if (!senderUsername) { // This checks for undefined, null, or empty string ""
        console.error("Username cookie not found or is empty.");
        setError("Could not retrieve sender username. Please log in.");
        setIsLoading(false); // Stop loading
        return; // Exit the function early if no valid username
    }
    // --- FIX ENDS HERE ---

    try {
      // Now we know senderUsername is a valid, non-empty string
      // Call runSend with the retrieved username
      await runSend(senderUsername, to, subject, message);

      // Handle successful send
      console.log("Mail sent successfully (runSend completed)");
      setSuccess("Mail sent successfully!");
      // Optional: Clear the form after successful send
      // setTo("");
      // setSubject("");
      // setMessage("");

    } catch (err) {
      // Handle errors from runSend
      console.error("Failed to send mail:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred while sending.");
    } finally {
      setIsLoading(false); // Set loading state back to false regardless of outcome
    }
  };

  return (
    <div className="relative min-h-screen w-full flex justify-center items-center p-4 overflow-hidden">
      {/* Background GridDots */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <GridDot />
      </div>

      {/* Main Compose Card */}
      <div className="relative z-10 w-full max-w-4xl lg:w-4/5 bg-background shadow-md rounded-xl border">
        <div className="flex items-center p-4">
          <div className="text-lg font-semibold">Compose</div>
          {/* Consider making the close button functional (e.g., using react-router or state) */}
          <Button variant="ghost" size="icon" className="ml-auto">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <Separator />
        {/* Use the updated handleSend */}
        <form onSubmit={handleSend} className="flex flex-col gap-4 p-4">
          <div>
            <Label htmlFor="to" className="mb-1 block text-sm font-medium">
              To
            </Label>
            <Input
              id="to"
              type="text" // Use 'email' type for better semantics/validation
              placeholder="Recipient email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
              disabled={isLoading} // Disable input while sending
            />
          </div>
          <div>
            <Label htmlFor="subject" className="mb-1 block text-sm font-medium">
              Subject
            </Label>
            <Input
              id="subject"
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              disabled={isLoading} // Disable input while sending
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="message" className="mb-1 block text-sm font-medium">
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="Write your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-64 p-4 resize-none" // Consider if resize is desired
              required
              disabled={isLoading} // Disable textarea while sending
            />
          </div>

          {/* Display Success or Error Messages */}
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          {success && <p className="text-sm text-green-600 text-center">{success}</p>}

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}> {/* Disable button when loading */}
              {isLoading ? "Sending..." : "Send"} {/* Change button text when loading */}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}