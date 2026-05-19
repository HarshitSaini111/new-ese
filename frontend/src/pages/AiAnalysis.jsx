import { useState } from "react";

const API_URL =
  "http://localhost:8000";

export default function AIAnalysis() {

  const [complaint, setComplaint] =
    useState("");

  const [aiText, setAiText] =
    useState(null);

  const [loadingAI, setLoadingAI] =
    useState(false);

  const [error, setError] =
    useState(null);

  // ======================
  // Run AI Analysis
  // ======================

  const runAI = async () => {

    if (!complaint.trim()) {

      setError(
        "Please enter complaint text."
      );

      return;

    }

    setLoadingAI(true);

    setAiText(null);

    setError(null);

    try {

      const token =
        localStorage.getItem("token");

      const res = await fetch(

        `${API_URL}/api/ai/analyze`,

        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,

          },

          body: JSON.stringify({
            complaint,
          }),

        }
      );

      const data =
        await res.json();

      if (data.success) {

        setAiText(
          data.aiResponse
        );

      } else {

        setError(
          data.message
        );

      }

    } catch {

      setError(
        "Cannot connect to AI backend."
      );

    }

    setLoadingAI(false);

  };

  return (

    <div>

      {/* Header */}

      <div className="page-header">

        <h1 className="page-title">

          AI{" "}

          <span className="accent-cyan">
            Complaint Analysis
          </span>

        </h1>

        <p className="page-subtitle">

          Analyse complaints using
          AI-powered priority detection,
          department recommendation,
          complaint summary, and
          automatic response generation.

        </p>

      </div>

      {/* Input Card */}

      <div className="card">

        <div className="card-title">

          Complaint Input

        </div>

        <div className="form-group">

          <label className="form-label">

            Complaint Description

          </label>

          <textarea
            className="form-textarea"
            placeholder="Example: Electricity issue in whole colony from 2 days..."
            value={complaint}
            onChange={(e) =>
              setComplaint(
                e.target.value
              )
            }
          />

        </div>

        {/* Buttons */}

        <div className="btn-row">

          {!loadingAI && (

            <button
              className="btn btn-ai"
              onClick={runAI}
            >

              ⚡ Run AI Analysis

            </button>

          )}

          {loadingAI && (

            <button
              className="btn btn-ai"
              disabled
            >

              <span className="spinner" />

              Analysing...

            </button>

          )}

          <button
            className="btn btn-ghost"
            onClick={() => {

              setComplaint("");

              setAiText(null);

              setError(null);

            }}
          >

            Clear

          </button>

        </div>

      </div>

      {/* Error */}

      {error && (

        <div className="alert alert-error">

          {error}

        </div>

      )}

      {/* AI Panel */}

      {(loadingAI || aiText) && (

        <div className="ai-panel">

          <div className="ai-panel-header">

            <div className="ai-dot" />

            <span className="ai-label">

              AI Analysis

            </span>

            <span className="ai-model-tag">

              OpenRouter · gpt-4o-mini

            </span>

          </div>

          {/* Loading */}

          {loadingAI && !aiText && (

            <div className="ai-loading">

              <div
                className="ai-loading-bar"
                style={{
                  width: "90%"
                }}
              />

              <div
                className="ai-loading-bar"
                style={{
                  width: "75%"
                }}
              />

              <div
                className="ai-loading-bar"
                style={{
                  width: "85%"
                }}
              />

              <div
                className="ai-loading-bar"
                style={{
                  width: "60%"
                }}
              />

            </div>

          )}

          {/* AI Result */}

          {aiText && (

            <pre className="ai-text">

              {aiText}

            </pre>

          )}

        </div>

      )}

    </div>

  );

}