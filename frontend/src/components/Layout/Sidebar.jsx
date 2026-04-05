import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/dashboard", enabled: true },
    { label: "Tax Contributions", path: "/tax", enabled: true },
    { label: "Budget", path: "/budget", enabled: false },
    { label: "Programs", path: "/programs", enabled: false },
    { label: "Development", path: "/development", enabled: false },
  ];

  const linkClass = (path) =>
    `block rounded-lg px-4 py-2.5 transition ${
      location.pathname === path
        ? "bg-blue-600 text-white shadow"
        : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
    }`;

  return (
    <aside className="w-64 border-r border-gray-200 bg-white p-4">
      <h2 className="mb-1 text-xl font-bold text-gray-900">TaxTrail</h2>
      <p className="mb-6 text-xs text-gray-500">Transparency in public finance</p>

      <nav className="space-y-2">
        {navItems.map((item) =>
          item.enabled ? (
            <Link key={item.path} to={item.path} className={linkClass(item.path)}>
              {item.label}
            </Link>
          ) : (
            <div
              key={item.path}
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