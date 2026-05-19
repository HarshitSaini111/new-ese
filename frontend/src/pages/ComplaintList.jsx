import { useState, useEffect } from "react";

function initials(name = "") {

  return name
    .split(" ")
    .map((w) =>
      w[0]?.toUpperCase() ?? ""
    )
    .slice(0, 2)
    .join("");

}

export default function ComplaintList() {

  const [complaints, setComplaints] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  // ======================
  // Fetch Complaints
  // ======================

  useEffect(() => {

    (async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const res = await fetch(

          "https://new-ese.onrender.com/api/complaints",

          {

            headers: {

              Authorization:
                `Bearer ${token}`,

            },

          }

        );

        const data =
          await res.json();

        if (Array.isArray(data)) {

          setComplaints(data);

        } else {

          setError(
            data.message
          );

        }

      } catch {

        setError(
          "Cannot connect to backend."
        );

      }

      setLoading(false);

    })();

  }, []);

  // ======================
  // Search Filter
  // ======================

  const filtered =
    complaints.filter((c) => {

      const q =
        search.toLowerCase();

      return (

        c.name
          .toLowerCase()
          .includes(q) ||

        c.email
          .toLowerCase()
          .includes(q) ||

        c.title
          .toLowerCase()
          .includes(q) ||

        c.location
          .toLowerCase()
          .includes(q) ||

        c.category
          .toLowerCase()
          .includes(q)

      );

    });

  // ======================
  // Stats
  // ======================

  const pendingCount =
    complaints.filter(
      (c) =>
        c.status === "Pending"
    ).length;

  const resolvedCount =
    complaints.filter(
      (c) =>
        c.status === "Resolved"
    ).length;

  const highPriorityCount =
    complaints.filter(
      (c) =>
        c.priority === "High"
    ).length;

  return (

    <div>

      {/* Header */}

      <div className="page-header">

        <h1 className="page-title">

          All{" "}

          <span className="accent">

            Complaints

          </span>

        </h1>

        <p className="page-subtitle">

          Browse, search, and track
          every registered complaint
          in the system.

        </p>

      </div>

      {/* Stats */}

      <div className="stats-strip">

        <div className="stat-box">

          <div className="stat-box-label">

            Total Complaints

          </div>

          <div className="stat-box-val">

            {complaints.length}

          </div>

          <div className="stat-box-sub">

            registered complaints

          </div>

        </div>

        <div className="stat-box">

          <div className="stat-box-label">

            Pending

          </div>

          <div className="stat-box-val">

            {pendingCount}

          </div>

          <div className="stat-box-sub">

            unresolved complaints

          </div>

        </div>

        <div className="stat-box">

          <div className="stat-box-label">

            High Priority

          </div>

          <div className="stat-box-val">

            {highPriorityCount}

          </div>

          <div className="stat-box-sub">

            urgent issues

          </div>

        </div>

        <div className="stat-box">

          <div className="stat-box-label">

            Resolved

          </div>

          <div className="stat-box-val">

            {resolvedCount}

          </div>

          <div className="stat-box-sub">

            completed complaints

          </div>

        </div>

      </div>

      {/* Search */}

      <div className="search-row">

        <div className="search-wrap">

          <span className="search-icon">

            ⌕

          </span>

          <input
            placeholder="Search by name, title, category or location..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

        <span className="result-count">

          {filtered.length} result
          {filtered.length !== 1
            ? "s"
            : ""}

        </span>

      </div>

      {/* Loading */}

      {loading && (

        <div className="empty-state">

          <span
            className="spinner"
            style={{
              margin: "0 auto",
            }}
          />

          <p
            style={{
              marginTop: 16,
            }}
          >

            Fetching complaints...

          </p>

        </div>

      )}

      {/* Error */}

      {error && (

        <div className="alert alert-error">

          {error}

        </div>

      )}

      {/* Empty */}

      {!loading &&
        !error &&
        filtered.length === 0 && (

          <div className="empty-state">

            <div className="empty-icon">

              ◈

            </div>

            <p>

              {search

                ? "No complaints match your search."

                : "No complaints yet. Add one from the form."}

            </p>

          </div>

        )}

      {/* Grid */}

      <div className="candidates-grid">

        {filtered.map((c, i) => (

          <div
            className="cand-card"
            key={c._id}
            style={{
              animationDelay:
                `${i * 0.05}s`,
            }}
          >

            {/* Top */}

            <div className="cand-card-top">

              <div className="avatar">

                {initials(c.name)}

              </div>

              <div>

                <div className="cand-name">

                  {c.name}

                </div>

                <div className="cand-email">

                  {c.email}

                </div>

                <span className="cand-exp">

                  📍 {c.location}

                </span>

              </div>

            </div>

            {/* Title */}

            <h3
              style={{
                marginTop: "14px",
              }}
            >

              {c.title}

            </h3>

            {/* Description */}

            <p className="cand-bio">

              {c.description?.length > 120

                ? c.description.slice(
                    0,
                    120
                  ) + "..."

                : c.description}

            </p>

            {/* Chips */}

            <div className="skill-chips">

              <span className="chip">

                {c.category}

              </span>

              <span className="chip">

                {c.priority}

              </span>

              <span className="chip">

                {c.department}

              </span>

              <span className="chip">

                {c.status}

              </span>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}