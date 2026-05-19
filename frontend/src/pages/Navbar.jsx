import {
  useNavigate,
  useLocation,
} from "react-router-dom";

export default function Navbar() {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const links = [

    {
      path: "/dashboard",
      icon: "📊",
      label: "Dashboard",
    },

    {
      path: "/add",
      icon: "📢",
      label: "Add Complaint",
    },

    {
      path: "/complaints",
      icon: "◈",
      label: "All Complaints",
    },

    {
      path: "/ai",
      icon: "⚡",
      label: "AI Analysis",
    },

  ];

  // ======================
  // Logout
  // ======================

  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    navigate("/login");

  };

  return (

    <nav className="navbar">

      {/* Brand */}

      <div
        className="navbar-brand"
        onClick={() =>
          navigate("/dashboard")
        }
        style={{
          cursor: "pointer",
        }}
      >

        <div className="navbar-logo-mark">

          S

        </div>

        <span className="navbar-name">

          Smart
          <span>
            ComplaintAI
          </span>

        </span>

      </div>

      {/* Links */}

      <div className="navbar-nav">

        {links.map((l) => (

          <button

            key={l.path}

            onClick={() =>
              navigate(l.path)
            }

            className={

              `nav-btn ${
                location.pathname ===
                l.path
                  ? "active"
                  : ""
              }`

            }

          >

            <span className="nav-icon">

              {l.icon}

            </span>

            {l.label}

          </button>

        ))}

      </div>

      {/* Logout */}

      <button
        className="nav-btn"
        onClick={handleLogout}
      >

        Logout

      </button>

    </nav>

  );

}