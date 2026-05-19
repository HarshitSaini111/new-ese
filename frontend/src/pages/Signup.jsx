import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

const API = "http://localhost:8000/api";

export default function Signup() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.name ||
      !form.email ||
      !form.password
    ) {

      return setError(
        "Please fill all fields."
      );

    }

    if (form.password.length < 6) {

      return setError(
        "Password must be at least 6 characters."
      );

    }

    setLoading(true);

    try {

      const res = await fetch(
        `${API}/signup`,
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(form),

        }
      );

      const data = await res.json();

      if (!res.ok) {

        throw new Error(
          data.message ||
          "Registration failed"
        );

      }

      setSuccess(
        "Account created successfully!"
      );

      setTimeout(() => {

        navigate("/login");

      }, 1500);

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="auth-page">

      {/* LEFT PANEL */}

      <div className="auth-left">

        <div className="auth-brand">

          <div className="auth-brand-icon">
            📢
          </div>

          <div className="auth-brand-name">
            Smart<span>ComplaintAI</span>
          </div>

        </div>

        <h1 className="auth-headline">

          Build your <br />

          <em>Complaint System.</em>

        </h1>

        <p className="auth-sub">

          Create your account and access
          the AI-powered Smart Complaint
          Management System for complaint
          registration, tracking, and
          intelligent AI analysis.

        </p>

        <div className="auth-features">

          {[
            "AI-powered complaint analysis",
            "Complaint tracking system",
            "Department recommendation",
            "Secure JWT authentication",
          ].map((f) => (

            <div
              className="auth-feature-item"
              key={f}
            >

              <div className="auth-feature-dot" />

              {f}

            </div>

          ))}

        </div>

      </div>

      {/* RIGHT PANEL */}

      <div className="auth-right">

        <div className="auth-card">

          <p className="auth-card-title">
            Create Account
          </p>

          <p className="auth-card-subtitle">

            Register to continue using
            SmartComplaintAI.

          </p>

          {error && (

            <div className="alert alert-error">

              ⚠️ {error}

            </div>

          )}

          {success && (

            <div className="alert alert-success">

              ✅ {success}

            </div>

          )}

          <form
            onSubmit={handleSubmit}
            autoComplete="off"
          >

            {/* NAME */}

            <div className="form-group">

              <label className="form-label">
                Full Name
              </label>

              <input
                className="form-control"
                name="name"
                placeholder="Rahul Sharma"
                value={form.name}
                onChange={handleChange}
              />

            </div>

            {/* EMAIL */}

            <div className="form-group">

              <label className="form-label">
                Email Address
              </label>

              <input
                className="form-control"
                name="email"
                type="email"
                placeholder="user@gmail.com"
                value={form.email}
                onChange={handleChange}
              />

            </div>

            {/* PASSWORD */}

            <div className="form-group">

              <label className="form-label">
                Password
              </label>

              <input
                className="form-control"
                name="password"
                type="password"
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={handleChange}
              />

            </div>

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >

              {loading ? (

                <span className="spinner" />

              ) : (

                "Create Account →"

              )}

            </button>

          </form>

          <p className="auth-link-text">

            Already have an account?{" "}

            <Link to="/login">
              Login here
            </Link>

          </p>

        </div>

      </div>

    </div>

  );

}