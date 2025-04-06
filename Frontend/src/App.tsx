// // src/App.jsx
// import React from 'react';
// import Spline from '@splinetool/react-spline';

// export default function App() {
//   return (
//     <main style={{ margin: 0, padding: 0 }}>
//       <div
//         style={{
//           position: 'fixed',
//           margin: '0',
//           width: '100%',
//           height: '100%',
//           overflow: 'hidden',
//         }}
//       >
//         <Spline
//           scene="https://prod.spline.design/sK8lvA2fYylsiu43/scene.splinecode"
//           style={{
//             position: 'absolute',
//             margin: '0',
//             top: -20,
//             left: -70,
//             width: '110%',
//             height: '110%',
//           }}
//         />
//       </div>
//     </main>
//   );
// }

// import React from 'react';
// import AuthPage from '@/pages/Authentication'; // Adjust path as needed
// import "./App.css"
// // import { Mail } from './components/mail';

// function App() {
//   return (
//     <div className="App">
//       <AuthPage/>
//     </div>
//   );
// }

// export default App;

// import AuthPage from "@/pages/Authentication"
// import "./App.css"
// import Spline from '@splinetool/react-spline';

// function App() {
//   return(
//     <main className="relative z-20 mt-10 h-[500px]">
//   <Spline scene="https://prod.spline.design/4xYDcMRxxiYr6aQu/scene.splinecode" />
// </main>

//   )
// }

// export default App;

// src/App.jsx (or App.tsx)

import { Routes, Route } from 'react-router-dom';

// Import your page components
import AuthenticationPage from '@/pages/Authentication'; // Your signup/initial page
import LoginPage from '@/components/login-form'; // Your new login page
import LandingPage from './pages/Landing';
import Mail from '@/pages/Mail'
// Import other pages as needed (e.g., Dashboard, NotFound)
// import DashboardPage from './pages/DashboardPage';
// import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    

    <Routes> {/* This component wraps all your individual routes */}

      <Route path="/" element={<LandingPage/>} />

      {/* Route for the Login Page */}
      {/* When the URL path is exactly "/login", render the LoginPage component */}
      <Route path="/login" element={<LoginPage />} />

      {/* Route for the Authentication/Sign-up Page */}
      {/* Assuming this is your main page at the root URL "/" */}
      <Route path="/signup" element={<AuthenticationPage />} />

      <Route path="/mail" element={<Mail/>} />

      {/* Add routes for other pages here */}
      {/* Example: <Route path="/dashboard" element={<DashboardPage />} /> */}

      {/* Optional: Catch-all route for 404 Not Found pages */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}

    </Routes>

    // <Footer />
  );
}

export default App;

