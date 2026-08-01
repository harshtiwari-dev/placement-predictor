import { Link } from "react-router-dom";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Welcome, {user?.name}</h2>
        <Link
          to="/predict"
          className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold hover:opacity-90 transition"
        >
          Get Your Placement Prediction
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;