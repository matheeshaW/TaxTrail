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
      available: true,
      color: "from-teal-600 to-sky-500",
    },
    {
      title: "Regional Development",
      description: "Monitor inequality and regional development signals",
      link: "/regional-development",
      available: true,
      color: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-sky-600">
              TaxTrail Overview
            </p>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Welcome{user?.name ? `, ${user.name}` : ""}
            </h1>
            <p className="mt-3 text-gray-600">
              TaxTrail helps you explore how public money moves across tax collections,
              spending priorities, welfare programs, and regional development. Use this
              dashboard to move between modules, compare trends, and understand where the
              data is telling a story.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
                Role: {user?.role || "Not available"}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700">
                Email: {user?.email || "Not available"}
              </span>
              <span className="rounded-full bg-sky-50 px-3 py-1 font-medium text-sky-700">
                Built for transparency and SDG 10 analysis
              </span>
            </div>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-2 lg:max-w-md lg:grid-cols-1">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Start here
              </p>
              <p className="mt-1 text-sm text-slate-700">
                Open Tax Contributions to review revenue, filters, and summary charts.
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                For analysis
              </p>
              <p className="mt-1 text-sm text-slate-700">
                Compare Budget, Programs, and Regional Development to understand public impact.
              </p>
            </div>
          </div>
        </div>
      </section>

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

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="max-w-3xl">
          <h2 className="text-lg font-semibold text-gray-900">How to use TaxTrail</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            This dashboard is designed to guide you through public finance data in a simple flow.
            Start with a module card above, then use filters, summaries, and record views to drill down.
            If you are looking for revenue information, begin with Tax Contributions. If you want to
            understand spending priorities, switch to Budget Allocations. Social Programs and Regional
            Development show how public support and regional progress are distributed.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-900">1. Choose a module</p>
            <p className="mt-1 text-sm text-gray-600">Open the area you want to inspect from the module cards.</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-900">2. Filter and compare</p>
            <p className="mt-1 text-sm text-gray-600">Use filters, pagination, and charts to narrow the data.</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-900">3. Review insights</p>
            <p className="mt-1 text-sm text-gray-600">Use summary views to spot trends and regional disparities.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
