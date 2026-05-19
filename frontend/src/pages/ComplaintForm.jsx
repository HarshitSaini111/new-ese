import { useState } from "react";

const INIT = {
  name: "",
  email: "",
  title: "",
  description: "",
  category: "",
  location: "",
};

export default function ComplaintForm() {

  const [form, setForm] = useState(INIT);

  const [status, setStatus] = useState(null);

  const [loading, setLoading] = useState(false);

  const set = (k, v) =>

    setForm((f) => ({
      ...f,
      [k]: v,
    }));

  const handleSubmit = async () => {

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.title.trim() ||
      !form.description.trim()
    ) {

      setStatus({
        type: "error",
        msg: "Please fill all required fields.",
      });

      return;

    }

    setLoading(true);

    setStatus(null);

    try {

      const token =
        localStorage.getItem("token");

      const res = await fetch(

        "http://localhost:8000/api/complaints",

        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,

          },

          body: JSON.stringify(form),

        }
      );

      const data = await res.json();

      if (res.ok) {

        setStatus({

          type: "success",

          msg:
            `✓ Complaint "${data.complaint.title}" submitted successfully!`,

        });

        setForm(INIT);

      } else {

        setStatus({

          type: "error",

          msg: data.message,

        });

      }

    } catch {

      setStatus({

        type: "error",

        msg: "Cannot connect to backend.",

      });

    }

    setLoading(false);

  };

  return (

    <div>

      {/* Header */}

      <div className="page-header">

        <h1 className="page-title">

          Register{" "}

          <span className="accent">
            Complaint
          </span>

        </h1>

        <p className="page-subtitle">

          Submit complaints using the
          AI-powered Smart Complaint
          Management System.

        </p>

      </div>

      {/* Form Card */}

      <div className="card">

        <div className="card-title">
          Complaint Details
        </div>

        <div className="form-grid">

          {/* Name */}

          <div className="form-group">

            <label className="form-label">
              Full Name
            </label>

            <input
              className="form-input"
              placeholder="Rahul Kumar"
              value={form.name}
              onChange={(e) =>
                set("name", e.target.value)
              }
            />

          </div>

          {/* Email */}

          <div className="form-group">

            <label className="form-label">
              Email Address
            </label>

            <input
              className="form-input"
              type="email"
              placeholder="rahul@gmail.com"
              value={form.email}
              onChange={(e) =>
                set("email", e.target.value)
              }
            />

          </div>

          {/* Title */}

          <div className="form-group">

            <label className="form-label">
              Complaint Title
            </label>

            <input
              className="form-input"
              placeholder="Water Leakage Issue"
              value={form.title}
              onChange={(e) =>
                set("title", e.target.value)
              }
            />

          </div>

          {/* Category */}

          <div className="form-group">

            <label className="form-label">
              Complaint Category
            </label>

            <select
              className="form-input"
              value={form.category}
              onChange={(e) =>
                set("category", e.target.value)
              }
            >

              <option value="">
                Select Category
              </option>

              <option value="Water Supply">
                Water Supply
              </option>

              <option value="Electricity">
                Electricity
              </option>

              <option value="Garbage">
                Garbage
              </option>

              <option value="Road Damage">
                Road Damage
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>

          {/* Location */}

          <div className="form-group span-2">

            <label className="form-label">
              Location
            </label>

            <input
              className="form-input"
              placeholder="Ghaziabad"
              value={form.location}
              onChange={(e) =>
                set("location", e.target.value)
              }
            />

          </div>

          {/* Description */}

          <div className="form-group span-2">

            <label className="form-label">
              Complaint Description
            </label>

            <textarea
              className="form-textarea"
              placeholder="Describe your complaint here..."
              value={form.description}
              onChange={(e) =>
                set(
                  "description",
                  e.target.value
                )
              }
            />

          </div>

        </div>

        {/* Status */}

        {status && (

          <div
            className={`alert alert-${status.type}`}
          >

            {status.msg}

          </div>

        )}

        {/* Buttons */}

        <div className="btn-row">

          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >

            {loading ? (

              <span className="spinner" />

            ) : (

              "📢"
            )}

            {loading
              ? "Submitting..."
              : "Submit Complaint"}

          </button>

          <button
            className="btn btn-ghost"
            onClick={() => setForm(INIT)}
            disabled={loading}
          >

            Clear Form

          </button>

        </div>

      </div>

    </div>

  );

}