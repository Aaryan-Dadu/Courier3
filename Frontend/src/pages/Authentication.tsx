import React from 'react';
import { Link } from 'react-router-dom'; // <--- Import Link
import "@/App.css";
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/registry/ui/button';
import { UserAuthForm } from '@/components/user-auth-form';
import Spline from '@splinetool/react-spline';

export default function AuthenticationPage() {
  return (
    <>
      {/* Mobile preview images - keep these */}
      {/* ... */}

      {/* Desktop layout */}
      <div className="container relative hidden h-screen overflow-hidden flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">

        {/* Top‑right “Login” link */}
        {/* --- Use Link instead of a --- */}
        <Link // <--- Changed from 'a'
          to="/login" // <--- Changed from 'href'
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'absolute right-4 top-4 md:right-8 md:top-8 z-30'
          )}
        >
          Login
        </Link>
        {/* --- End Change --- */}

        {/* Left panel */}
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">

          {/* Spline Scene Background - z-0 */}
          <main className="absolute inset-x-0 top-0 z-0 h-[120%]">
            <Spline
              scene="https://prod.spline.design/4xYDcMRxxiYr6aQu/scene.splinecode"
              style={{ width: '100%', height: '100%' }}
            />
          </main>

          {/* --- NEW TEXT ELEMENT START --- */}
          <div className="absolute inset-0 z-10 flex items-center ml-10 p-10 pointer-events-none">
            <p className=" shine-text text-2xl font-bold text-white-500 z-1">
              Welcome to the Future <br/> of Mailing
            </p>
          </div>
          {/* --- NEW TEXT ELEMENT END --- */}

          {/* Semi-Transparent Overlay */}
          <div className="absolute inset-0 bg-zinc-900/75 z-20" />

          {/* Logo / title */}
          <div className="relative z-30 flex items-center text-lg font-medium mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            <p>Courier-3</p>
          </div>

          {/* Testimonial or footer */}
          <div className="relative z-30 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">“Best mailing system I’ve ever used!”</p>
              <footer className="text-sm">— Luke Skywalker</footer>
            </blockquote>
          </div>
        </div>

        {/* Right panel: sign-up form */}
        <div className="bg-background lg:p-8 h-full flex items-center justify-center">
           <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your username below to create your account
              </p>
            </div>
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{' '}
              {/* Consider changing these to Link as well if they are internal routes */}
              <a
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}