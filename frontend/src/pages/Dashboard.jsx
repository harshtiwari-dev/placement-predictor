function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <h2>Welcome, {user?.name}</h2>
      <p>Dashboard coming soon.</p>
    </div>
  );
}

export default Dashboard;