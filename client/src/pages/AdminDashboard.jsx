import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import API from "../api";
import mlBg from "../assets/ml-bg.jpg";

function AdminDashboard() {
  const { enqueueSnackbar } = useSnackbar();

  const [tournaments, setTournaments] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.role !== "admin") {
      window.location.href = "/";
      return;
    }

    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    const res = await fetch(`${API}/admin_get_tournaments.php`);
    const data = await res.json();

    if (data.success) {
      setTournaments(data.tournaments);
    }
  };

  const viewTeams = async (id) => {
    const res = await fetch(
      `${API}/admin_get_tournament_teams.php?tournament_id=${id}`
    );

    const data = await res.json();

    if (data.success) {
      setSelectedTeams(data.teams);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative p-6"
      style={{ backgroundImage: `url(${mlBg})` }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-6xl mx-auto text-white">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-400">
            Admin Dashboard
          </h1>

          <div className="space-x-3">
            <a
              href="/admin/create-tournament"
              className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold"
            >
              Create Tournament
            </a>

            <a
              href="/admin/create-admin"
              className="bg-white/20 px-4 py-2 rounded-lg"
            >
              Create Admin
            </a>
          </div>
        </div>

        <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-md">
          <h2 className="text-2xl font-bold mb-4">Tournaments</h2>

          <div className="space-y-4">
            {tournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="bg-black/30 p-4 rounded-xl flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-bold text-yellow-400">
                    {tournament.title}
                  </h3>
                  <p>Date: {tournament.tournament_date}</p>
                  <p>Teams Joined: {tournament.total_teams}</p>
                  <p>Status: {tournament.status}</p>
                </div>

                <button
                  onClick={() => viewTeams(tournament.id)}
                  className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold"
                >
                  View Teams
                </button>
              </div>
            ))}
          </div>
        </div>

        {selectedTeams.length > 0 && (
          <div className="mt-8 bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-md">
            <h2 className="text-2xl font-bold mb-4">Joined Teams</h2>

            {selectedTeams.map((team) => (
              <div key={team.team_id} className="mb-6 bg-black/30 p-4 rounded-xl">
                <h3 className="text-yellow-400 text-xl font-bold">
                  {team.team_name}
                </h3>

                <ul className="mt-3 list-disc list-inside">
                  {team.members.map((member, index) => (
                    <li key={index}>
                      {member.name} - {member.ign}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;