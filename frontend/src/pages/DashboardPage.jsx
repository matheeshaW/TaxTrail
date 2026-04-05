import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function DashboardPage() {
  const { user } = useAuth();

  const cards = [
    {
      title: "Tax Contributions",
      description: "View and manage tax records across regions",
      link: "/tax",
      available: true,
      color: "from-blue-600 to-cyan-500",
    },
    {
      title: "Budget Allocations",
      description: "Analyze spending priorities and sector distribution",
      link: "/budget",
      available: true,
      color: "from-emerald-600 to-lime-500",
    },
    {
      title: "Social Programs",
      description: "Track welfare initiatives and beneficiary coverage",
      link: "/programs",
      available: false,
      color: "from-teal-600 to-sky-500",
    },
    {
      title: "Regional Development",
      description: "Monitor inequality and regional development signals",
      link: "/development",
      available: false,
      color: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome{user?.name ? `, ${user.name}` : ""}
        </h1>
        <p className="mt-2 text-gray-600">
          Public Budget Transparency Dashboard
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
            Role: {user?.role || "Not available"}
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700">
            Email: {user?.email || "Not available"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) =>
          card.available ? (
            <Link
              key={card.title}
              to={card.link}
              className={`group rounded-xl bg-gradient-to-br ${card.color} p-5 text-white shadow transition duration-200 hover:-translate-y-0.5 hover:shadow-lg`}
            >
              <h2 className="text-lg font-semibold">{card.title}</h2>
              <p className="mt-2 text-sm text-white/90">{card.description}</p>
              <p className="mt-4 text-xs font-medium text-white/90">
                Open module
              </p>
            </Link>
          ) : (
            <div
              key={card.title}
              className={`rounded-xl bg-gradient-to-br ${card.color} p-5 text-white/95 opacity-80`}
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg font-semibold">{card.title}</h2>
                <span className="rounded bg-white/20 px-2 py-0.5 text-[10px] font-semibold tracking-wide">
                  SOON
                </span>
              </div>
              <p className="mt-2 text-sm text-white/90">{card.description}</p>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
