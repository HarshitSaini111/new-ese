import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

const API = "https://new-ese.onrender.com/api";

export default function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    if (!form.email || !form.password) {

      return setError(
        "Please enter email and password."
      );

    }

    setLoading(true);

    try {

      const res = await fetch(

        `${API}/login`,

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
          "Login failed"

        );

      }

      // Save Token

      localStorage.setItem(
        "token",
        data.token
      );

      // Redirect

      navigate("/dashboard");

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="auth-page">

      {/* LEFT */}

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

          Welcome <br />

          <em>Back.</em>

        </h1>

        <p className="auth-sub">

          Login to access the
          AI-powered Complaint
          Management System.

        </p>

      </div>

      {/* RIGHT */}

      <div className="auth-right">

        <div className="auth-card">

          <p className="auth-card-title">

            Login

          </p>

          <p className="auth-card-subtitle">

            Enter your credentials
            to continue.

          </p>

          {error && (

            <div className="alert alert-error">

              ⚠️ {error}

            </div>

          )}

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}

            <div className="form-group">

              <label className="form-label">

                Email Address

              </label>

              <input
                className="form-control"
                type="email"
                name="email"
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
                type="password"
                name="password"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
              />

            </div>

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >

              {loading
                ? "Loading..."
                : "Login →"}

            </button>

          </form>

          <p className="auth-link-text">

            Don&apos;t have an account?{" "}

            <Link to="/signup">

              Register here

            </Link>

          </p>

        </div>

      </div>

    </div>

  );

}