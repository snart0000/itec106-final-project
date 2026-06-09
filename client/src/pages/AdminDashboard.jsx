import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import API from "../api";
import mlBg from "../assets/ml-bg.jpg";

function AdminDashboard() {
  const { enqueueSnackbar } = useSnackbar();

  const user = JSON.parse(localStorage.getItem("user"));

  const [activeTab, setActiveTab] = useState("tournaments");

  const [tournaments, setTournaments] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showTeamModal, setShowTeamModal] = useState(false);

  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState("");
  const [playerPage, setPlayerPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      window.location.href = "/";
      return;
    }

    fetchTournaments();
    fetchPlayers();
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [playerPage]);

  const logout = () => {
    enqueueSnackbar("Logged out successfully.", {
      variant: "success",
    });

    setTimeout(() => {
      localStorage.removeItem("user");
      window.location.href = "/";
    }, 500);
  };

  const fetchTournaments = async () => {
    try {
      const res = await fetch(`${API}/admin_get_tournaments.php`);
      const data = await res.json();

      if (data.success) {
        setTournaments(data.tournaments);
      }
    } catch (error) {
      enqueueSnackbar("Failed to load tournaments.", {
        variant: "error",
      });
    }
  };

  const fetchPlayers = async () => {
    try {
      const res = await fetch(
        `${API}/admin_get_players.php?search=${encodeURIComponent(
          search
        )}&page=${playerPage}`
      );

      const data = await res.json();

      if (data.success) {
        setPlayers(data.players);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      enqueueSnackbar("Failed to load players.", {
        variant: "error",
      });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPlayerPage(1);
    fetchPlayers();
  };

  const viewTeams = async (tournament) => {
    try {
      const res = await fetch(
        `${API}/admin_get_tournament_teams.php?tournament_id=${tournament.id}`
      );

      const data = await res.json();

      if (data.success) {
        setSelectedTournament(tournament);
        setSelectedTeams(data.teams);
        setShowTeamModal(true);
      }
    } catch (error) {
      enqueueSnackbar("Failed to load teams.", {
        variant: "error",
      });
    }
  };

  const tabStyle = (tab) =>
    activeTab === tab
      ? "bg-yellow-500 text-black"
      : "bg-white/10 text-white hover:bg-white/20";

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${mlBg})` }}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm"></div>

      <div className="relative z-10 container mx-auto px-4 py-8 text-white">
        <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-6 mb-8 overflow-hidden min-h-70">
          <div className="flex justify-between items-start">
            <h2 className="text-1xl md:text-2xl font-extrabold text-white uppercase tracking-wide">
              MLBB Admin Hub
            </h2>

            <button
              onClick={logout}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition"
            >
              Logout
            </button>
          </div>

          <div className="absolute left-4 md:left-6 bottom-8">
            <h1 className="text-5xl md:text-8xl font-black uppercase leading-none">
              <span className="text-white">Admin</span>{" "}
              <span className="text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.7)]">
                Dashboard
              </span>
            </h1>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab("tournaments")}
              className={`px-5 py-3 rounded-xl font-bold transition ${tabStyle(
                "tournaments"
              )}`}
            >
              Tournaments
            </button>

            <button
              onClick={() => setActiveTab("players")}
              className={`px-5 py-3 rounded-xl font-bold transition ${tabStyle(
                "players"
              )}`}
            >
              Players
            </button>
          </div>

          <div className="flex gap-3">
            <a
              href="/admin/create-tournament"
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-3 rounded-xl font-bold transition"
            >
              Create Tournament
            </a>

            <a
              href="/admin/create-admin"
              className="bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-3 rounded-xl font-bold transition"
            >
              Create Admin
            </a>
          </div>
        </div>

        {activeTab === "tournaments" && (
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-md">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
              Tournament List
            </h2>

            <div className="space-y-4">
              {tournaments.length === 0 && (
                <p className="text-gray-300">No tournaments found.</p>
              )}

              {tournaments.map((tournament) => (
                <div
                  key={tournament.id}
                  className="bg-black/30 p-5 rounded-xl flex flex-col md:flex-row justify-between md:items-center gap-4 border border-white/10"
                >
                  <div>
                    <h3 className="text-xl font-bold text-yellow-400">
                      {tournament.title}
                    </h3>
                    <p className="text-gray-300">
                      Date: {tournament.tournament_date}
                    </p>
                    <p className="text-gray-300">
                      Venue: {tournament.venue || "N/A"}
                    </p>
                    <p className="text-gray-300">
                      Teams Joined: {tournament.total_teams}
                    </p>
                    <p className="text-gray-300">
                      Status: {tournament.status}
                    </p>
                  </div>

                  <button
                    onClick={() => viewTeams(tournament)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-3 rounded-xl font-bold transition"
                  >
                    View Teams
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "players" && (
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-5">
              <div>
                <h2 className="text-2xl font-bold text-yellow-400">
                  Registered Players
                </h2>
                <p className="text-gray-300">
                  View and search player accounts.
                </p>
              </div>

              <form onSubmit={handleSearch} className="flex gap-3">
                <input
                  placeholder="Search player..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:border-yellow-400"
                />

                <button
                  type="submit"
                  className="px-5 py-3 bg-yellow-500 hover:bg-yellow-600 text-black rounded-xl font-bold transition"
                >
                  Search
                </button>
              </form>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-black/40 text-yellow-400">
                  <tr>
                    <th className="p-4 rounded-l-xl">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">IGN</th>
                    <th className="p-4">UID</th>
                    <th className="p-4">Server</th>
                    <th className="p-4 rounded-r-xl">Roles</th>
                  </tr>
                </thead>

                <tbody>
                  {players.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-5 text-center text-gray-300">
                        No players found.
                      </td>
                    </tr>
                  )}

                  {players.map((player) => (
                    <tr
                      key={player.id}
                      className="border-b border-white/10 hover:bg-white/5"
                    >
                      <td className="p-4">
                        {player.first_name}{" "}
                        {player.middle_initial
                          ? `${player.middle_initial}.`
                          : ""}{" "}
                        {player.last_name}
                      </td>
                      <td className="p-4">{player.email}</td>
                      <td className="p-4 text-yellow-400 font-bold">
                        {player.ign}
                      </td>
                      <td className="p-4">{player.uid}</td>
                      <td className="p-4">{player.server}</td>
                      <td className="p-4">
                        {player.role1} / {player.role2}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center items-center gap-3 mt-6">
              <button
                disabled={playerPage === 1}
                onClick={() => setPlayerPage(playerPage - 1)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-gray-300">
                Page {playerPage} of {totalPages}
              </span>

              <button
                disabled={playerPage === totalPages}
                onClick={() => setPlayerPage(playerPage + 1)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {showTeamModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-3xl bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-md text-white max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-black text-yellow-400">
                  Joined Teams
                </h2>
                <p className="text-gray-300">
                  {selectedTournament?.title}
                </p>
              </div>

              <button
                onClick={() => setShowTeamModal(false)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl font-bold"
              >
                Close
              </button>
            </div>

            {selectedTeams.length === 0 && (
              <p className="text-gray-300">No teams joined yet.</p>
            )}

            <div className="space-y-4">
              {selectedTeams.map((team) => (
                <div
                  key={team.team_id}
                  className="bg-black/30 border border-white/10 p-5 rounded-xl"
                >
                  <h3 className="text-yellow-400 text-xl font-bold mb-3">
                    {team.team_name}
                  </h3>

                  {team.members.length === 0 ? (
                    <p className="text-gray-300">No members found.</p>
                  ) : (
                    <ul className="space-y-2">
                      {team.members.map((member, index) => (
                        <li
                          key={index}
                          className="flex justify-between bg-white/5 px-4 py-2 rounded-lg"
                        >
                          <span>{member.name}</span>
                          <span className="text-yellow-400 font-bold">
                            {member.ign}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;