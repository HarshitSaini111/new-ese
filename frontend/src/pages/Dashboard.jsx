import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {

  const navigate = useNavigate();

  const [complaints, setComplaints] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  // ======================
  // Fetch Complaints
  // ======================

  useEffect(() => {

    const fetchComplaints =
      async () => {

        try {

          const token =
            localStorage.getItem(
              "token"
            );

          const res =
            await fetch(

              "http://localhost:8000/api/complaints",

              {

                headers: {

                  Authorization:
                    `Bearer ${token}`,

                },

              }

            );

          const data =
            await res.json();

          if (res.ok) {

            setComplaints(data);

          } else {

            setError(
              data.message
            );

          }

        } catch (err) {

          setError(
            "Cannot connect to backend."
          );

        } finally {

          setLoading(false);

        }

      };

    fetchComplaints();

  }, []);

  // ======================
  // Stats
  // ======================

  const totalComplaints =
    complaints.length;

  const pendingComplaints =
    complaints.filter(
      (c) =>
        c.status === "Pending"
    ).length;

  const resolvedComplaints =
    complaints.filter(
      (c) =>
        c.status === "Resolved"
    ).length;

  const highPriority =
    complaints.filter(
      (c) =>
        c.priority === "High"
    ).length;

  // ======================
  // Recent Complaints
  // ======================

  const recent =
    complaints
      .slice(-4)
      .reverse();

  return (

    <div>

      {/* Header */}

      <div className="page-header">

        <h1 className="page-title">

          Smart{" "}

          <span className="accent">

            Complaint Dashboard

          </span>

        </h1>

        <p className="page-subtitle">

          Monitor complaints,
          analyse issues,
          and manage complaints
          using AI-powered
          complaint management.

        </p>

      </div>

      {/* Loading */}

      {loading && (

        <div className="empty-state">

          <p>

            Loading dashboard...

          </p>

        </div>

      )}

      {/* Error */}

      {error && (

        <div className="alert alert-error">

          ⚠️ {error}

        </div>

      )}

      {/* Main Content */}

      {!loading && !error && (

        <>

          {/* Stats */}

          <div className="stats-strip">

            <div className="stat-box">

              <div className="stat-box-label">

                Total Complaints

              </div>

              <div className="stat-box-val">

                {totalComplaints}

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

                {pendingComplaints}

              </div>

              <div className="stat-box-sub">

                unresolved issues

              </div>

            </div>

            <div className="stat-box">

              <div className="stat-box-label">

                Resolved

              </div>

              <div className="stat-box-val">

                {resolvedComplaints}

              </div>

              <div className="stat-box-sub">

                completed complaints

              </div>

            </div>

            <div className="stat-box">

              <div className="stat-box-label">

                High Priority

              </div>

              <div className="stat-box-val">

                {highPriority}

              </div>

              <div className="stat-box-sub">

                urgent complaints

              </div>

            </div>

          </div>

          {/* Quick Actions */}

          <div className="card">

            <div className="card-title">

              Quick Actions

            </div>

            <div className="btn-row">

              <button
                className="btn btn-primary"
                onClick={() =>
                  navigate("/add")
                }
              >

                📢 Add Complaint

              </button>

              <button
                className="btn btn-ai"
                onClick={() =>
                  navigate("/ai")
                }
              >

                ⚡ AI Analysis

              </button>

              <button
                className="btn btn-ghost"
                onClick={() =>
                  navigate("/complaints")
                }
              >

                ◈ View Complaints

              </button>

            </div>

          </div>

          {/* Recent Complaints */}

          <div className="card">

            <div className="card-title">

              Recent Complaints

            </div>

            {recent.length === 0 ? (

              <div className="empty-state">

                <div className="empty-icon">

                  ◈

                </div>

                <p>

                  No complaints found.

                </p>

              </div>

            ) : (

              <div className="candidates-grid">

                {recent.map((c) => (

                  <div
                    className="cand-card"
                    key={c._id}
                  >

                    <div className="cand-card-top">

                      <div className="avatar">

                        {c.name
                          ?.charAt(0)
                          ?.toUpperCase()}

                      </div>

                      <div>

                        <div className="cand-name">

                          {c.title}

                        </div>

                        <div className="cand-email">

                          {c.name}

                        </div>

                      </div>

                    </div>

                    <p className="cand-bio">

                      {c.description
                        ?.slice(0, 120)}

                      ...

                    </p>

                    <div className="skill-chips">

                      <span className="chip">

                        {c.category}

                      </span>

                      <span className="chip">

                        {c.priority ||
                          "Normal"}

                      </span>

                      <span className="chip">

                        {c.status ||
                          "Pending"}

                      </span>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </>

      )}

    </div>

  );

}