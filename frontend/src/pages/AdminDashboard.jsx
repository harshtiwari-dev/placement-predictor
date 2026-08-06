import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Shield, GraduationCap, Brain } from "lucide-react";

import Navbar from "../components/Navbar/Navbar";
import StatCard from "../components/Admin/StatCard";
import UsersTable from "../components/Admin/UsersTable";
import PredictionsTable from "../components/Admin/PredictionsTable";

import {
  getAllUsers,
  getAllPredictions,
} from "../services/api";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
const [predictions, setPredictions] = useState([]);
const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
  try {
    const usersRes = await getAllUsers();
    const predictionsRes = await getAllPredictions();

    setUsers(usersRes.data);
    setPredictions(predictionsRes.data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
}

  const adminCount = users.filter(
    (u) => u.role === "admin"
  ).length;

  const studentCount = users.filter(
    (u) => u.role === "student"
  ).length;

  if (loading) {
  return (
    <div className="min-h-screen bg-[#0B1020] flex flex-col items-center justify-center text-white">
  <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
  <p className="text-lg">Loading Admin Dashboard...</p>
</div>
  );
}

  return (
    <div className="min-h-screen bg-[#0B1020] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">

        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-10"
        >
          Admin Dashboard
        </motion.h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          <StatCard
            title="Total Users"
            value={users.length}
            icon={Users}
            color="bg-purple-600"
          />

          <StatCard
            title="Predictions"
            value={predictions.length}
            icon={Brain}
            color="bg-cyan-600"
          />

          <StatCard
            title="Admins"
            value={adminCount}
            icon={Shield}
            color="bg-green-600"
          />

          <StatCard
            title="Students"
            value={studentCount}
            icon={GraduationCap}
            color="bg-orange-500"
          />

        </div>

        <div className="space-y-8">

          <UsersTable users={users} />

          <PredictionsTable predictions={predictions} />

        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;