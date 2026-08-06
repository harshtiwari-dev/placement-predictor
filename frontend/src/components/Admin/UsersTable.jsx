import { motion } from "framer-motion";

function UsersTable({ users }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-x-auto"
    >
      <h2 className="text-xl font-semibold text-white mb-6">
        Registered Users
      </h2>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/10 text-slate-400">
            <th className="pb-3">Name</th>
            <th className="pb-3">Email</th>
            <th className="pb-3">Role</th>
            <th className="pb-3">Joined</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              className="border-b border-white/5 hover:bg-white/5 transition"
            >
              <td className="py-4 text-white">{user.name}</td>

              <td className="py-4 text-slate-300">
                {user.email}
              </td>

              <td className="py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === "admin"
                      ? "bg-purple-500/20 text-purple-300"
                      : "bg-cyan-500/20 text-cyan-300"
                  }`}
                >
                  {user.role}
                </span>
              </td>

              <td className="py-4 text-slate-400">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

export default UsersTable;