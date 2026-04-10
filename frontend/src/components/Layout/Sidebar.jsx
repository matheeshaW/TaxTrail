import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const navItems = [
    { label: "Dashboard", path: "/dashboard", enabled: true },
    { label: "Tax Contributions", path: "/tax", enabled: true },
    { label: "Budget Allocations", path: "/budget", enabled: true },
    { label: "Social programs", path: "/programs", enabled: true },
    {
      label: "Regional Development",
      path: "/regional-development",
      enabled: true,
    },
  ];

  return (
    <aside className="w-64 border-r border-gray-200 bg-white p-4">
      {/* Logo */}
      <div className="mb-6">
        <div className="flex items-center gap-2 leading-none">
          {/* Badge container */}
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600">
            <svg width="32" height="32" viewBox="0 2 32 34" fill="none">
              {/* Base */}
              <rect x="3" y="27" width="24" height="4" rx="1" fill="white" />
              {/* Pillars */}
              <rect x="5" y="15" width="3" height="13" rx="0.0" fill="white" />
              <rect x="11" y="15" width="3" height="13" rx="0.0" fill="white" />
              <rect x="17" y="15" width="3" height="13" rx="0.0" fill="white" />
              <rect x="23" y="15" width="3" height="13" rx="0.0" fill="white" />
              {/* Entablature */}
              <rect
                x="3"
                y="12.5"
                width="24"
                height="3"
                rx="0.5"
                fill="white"
                opacity="0.75"
              />
              {/* Pediment */}
              <path d="M3 12.5 L15 4 L27 12.5 Z" fill="white" />

              {/* $ circle — overlapping right bottom of building */}

              <circle cx="25" cy="28" r="6.5" fill="white" />
              <text
                x="25"
                y="31"
                textAnchor="middle"
                fontSize="10"
                fontWeight="600"
                fill="#2563EB"
                className="font-mono"
              >
                $
              </text>
            </svg>
          </div>

          {/* Wordmark */}
          <div className="flex items-baseline">
            <span className="text-[22px] font-medium tracking-tight text-blue-600">
              Tax
            </span>
            <span className="text-[22px] font-medium tracking-tight text-blue-600">
              Trail
            </span>
          </div>
        </div>

        {/* Underline */}
        <div className="mt-1 h-0.5 w-full bg-blue-600" />

        <p className="mt-1.5 text-[11px] text-gray-400 tracking-wide">
          Transparency in Public Finance
        </p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) =>
          item.enabled ? (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-2.5 transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                }`
              }
            >
              {item.label}
            </NavLink>
          ) : (
            <div
              key={item.path}
              aria-disabled="true"
              tabIndex={-1}
              className="flex items-center justify-between rounded-lg px-4 py-2.5 text-gray-400"
            >
              <span>{item.label}</span>
              <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                Soon
              </span>
            </div>
          ),
        )}
      </nav>
    </aside>
  );
}
