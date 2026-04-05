import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";

export default function DashboardPage() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (
		<div className="min-h-screen bg-gray-100 p-6">
			<div className="mx-auto flex max-w-4xl flex-col gap-6 rounded-lg bg-white p-6 shadow md:flex-row md:items-start md:justify-between">
				<div>
					<h1 className="text-3xl font-bold">Dashboard</h1>
					<p className="mt-2 text-gray-600">
						Welcome{user?.name ? `, ${user.name}` : ""}.
					</p>
					<div className="mt-4 space-y-1 text-sm text-gray-700">
						<p>
							<span className="font-semibold">Email:</span>{" "}
							{user?.email || "Not available"}
						</p>
						<p>
							<span className="font-semibold">Role:</span>{" "}
							{user?.role || "Not available"}
						</p>
					</div>
				</div>

				<div className="flex flex-col items-stretch gap-3 sm:flex-row md:flex-col md:items-end">
					<Link
						to="/tax"
						className="rounded bg-blue-600 px-4 py-2 text-center font-medium text-white transition hover:bg-blue-700"
					>
						Go to Tax Contributions
					</Link>
					<button
						type="button"
						onClick={handleLogout}
						className="rounded bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
					>
						Logout
					</button>
				</div>
			</div>
		</div>
	);
}