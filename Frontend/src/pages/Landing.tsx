// src/pages/LandingPage.jsx
import React from 'react';
import Spline from '@splinetool/react-spline';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/registry/ui/button"; // Adjust path as needed

export default function LandingPage() {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/signup'); // Redirects to /signup
  };

  return (
    <main style={{ margin: 0, padding: 0 }}>
      <div
        style={{
          position: 'fixed',
          margin: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Spline
          scene="https://prod.spline.design/sK8lvA2fYylsiu43/scene.splinecode"
          style={{
            position: 'absolute',
            top: -20,
            left: -70,
            width: '110%',
            height: '110%',
          }}
        />

        {/* Button container positioned at top right */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 10,
          }}
        >
          <Button
            onClick={handleSignUp}
            className="bg-[#374151] hover:bg-[#4b5563] text-white"
          >
            Get Started
          </Button>
        </div>
      </div>
    </main>
  );
}
