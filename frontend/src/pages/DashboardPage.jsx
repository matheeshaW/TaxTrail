import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function DashboardPage() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (
		<div className="min-h-screen bg-gray-100 p-6">
			<div className="mx-auto flex max-w-4xl items-start justify-between rounded-lg bg-white p-6 shadow">
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

				<button
					type="button"
					onClick={handleLogout}
					className="rounded bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
				>
					Logout
				</button>
			</div>
		</div>
	);
}