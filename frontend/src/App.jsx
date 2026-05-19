import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./pages/Navbar";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Dashboard from "./pages/Dashboard";

import ComplaintForm from "./pages/ComplaintForm";

import ComplaintList from "./pages/ComplaintList";

import AIAnalysis from "./pages/AiAnalysis";

import "./App.css";

// ======================
// Protected Route
// ======================

function ProtectedRoute({
  children,
}) {

  const token =
    localStorage.getItem(
      "token"
    );

  if (!token) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }

  return children;

}

// ======================
// Layout
// ======================

function Layout({
  children,
}) {

  return (

    <div className="app-root">

      <Navbar />

      <div className="page-wrapper">

        {children}

      </div>

    </div>

  );

}

// ======================
// App
// ======================

export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* DEFAULT */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        {/* LOGIN */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* SIGNUP */}

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={

            <ProtectedRoute>

              <Layout>

                <Dashboard />

              </Layout>

            </ProtectedRoute>

          }
        />

        {/* ADD COMPLAINT */}

        <Route
          path="/add"
          element={

            <ProtectedRoute>

              <Layout>

                <ComplaintForm />

              </Layout>

            </ProtectedRoute>

          }
        />

        {/* ALL COMPLAINTS */}

        <Route
          path="/complaints"
          element={

            <ProtectedRoute>

              <Layout>

                <ComplaintList />

              </Layout>

            </ProtectedRoute>

          }
        />

        {/* AI ANALYSIS */}

        <Route
          path="/ai"
          element={

            <ProtectedRoute>

              <Layout>

                <AIAnalysis />

              </Layout>

            </ProtectedRoute>

          }
        />

        {/* INVALID ROUTE */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>

  );

}