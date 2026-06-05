function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div>
      <h1>Home Page</h1>
      <h2>Welcome, {user?.ign}</h2>

      <nav>
        <a href="/search">Search Player</a>
        <br />
        <a href="/team">Create Team</a>
        <br />
        <a href="/invites">Team Invites</a>
        <br />
        <a href="/profile">View Profile</a>
      </nav>

      <br />

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;