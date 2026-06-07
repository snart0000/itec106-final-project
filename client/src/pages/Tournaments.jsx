import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import API from "../api";
import mlBg from "../assets/ml-bg.jpg";

function Tournaments() {
  const { enqueueSnackbar } = useSnackbar();

  const user = JSON.parse(localStorage.getItem("user"));

  const [tournaments, setTournaments] = useState([]);
  const [teamId, setTeamId] = useState(0);
  const [memberCount, setMemberCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    if (!dateString) return "";

    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const fetchTournaments = async () => {
    try {
      const res = await fetch(`${API}/get_tournaments.php?user_id=${user?.id}`);
      const data = await res.json();

      setTeamId(Number(data.team_id));
      setMemberCount(Number(data.member_count));
      setTournaments(data.tournaments);
      setLoading(false);
    } catch (error) {
      enqueueSnackbar("Failed to load tournaments.", {
        variant: "error",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const joinTournament = async (tournamentId) => {
    try {
      const res = await fetch(`${API}/join_tournament.php`, {
        method: "POST",
        headers: {
          // "Content-Type": "application/json",
          "Content-Type": "text/plain",
        },
        body: JSON.stringify({
          user_id: user?.id,
          tournament_id: tournamentId,
        }),
      });

      const data = await res.json();

      enqueueSnackbar(data.message, {
        variant: data.success ? "success" : "error",
      });

      if (data.success) {
        fetchTournaments();
      }
    } catch (error) {
      enqueueSnackbar("Unable to connect to server.", {
        variant: "error",
      });
    }
  };

  const getStatusStyle = (status) => {
    if (status === "open")
      return "bg-green-500/20 text-green-400 border-green-400";

    if (status === "closed")
      return "bg-red-500/20 text-red-400 border-red-400";

    return "bg-yellow-500/20 text-yellow-400 border-yellow-400";
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${mlBg})` }}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-start">
            <h2 className="text-xl md:text-2xl font-extrabold text-white uppercase tracking-wide">
              MLBB Community Hub
            </h2>

            <a
              href="/dashboard"
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl transition"
            >
              Back
            </a>
          </div>

          <div className="mt-10 text-left">
            <h2 className="text-5xl md:text-7xl font-black uppercase text-white">
              MLBB{" "}
              <span className="text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.7)]">
                Tournaments
              </span>
            </h2>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8">
          <h3 className="text-2xl font-bold text-yellow-400 mb-2">
            Registration Requirement
          </h3>

          <p className="text-gray-300">
            Your team must have at least{" "}
            <span className="text-yellow-400 font-bold">
              5 accepted members
            </span>{" "}
            to join a tournament.
          </p>

          <p className="text-gray-300 mt-2">
            Current team members:{" "}
            <span className="text-white font-bold">{memberCount}/7</span>
          </p>
        </div>

        {loading ? (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-10 text-center">
            <p className="text-gray-300">Loading tournaments...</p>
          </div>
        ) : tournaments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tournaments.map((tournament) => {
              const isRegistered = tournament.registration_id !== null;
              const isOpen = tournament.tournament_status === "open";
              const canJoin =
                teamId && memberCount >= 5 && isOpen && !isRegistered;

              return (
                <div
                  key={tournament.id}
                  className="flex flex-col h-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:border-yellow-400 transition"
                >
                  <div className="flex justify-between items-start gap-4 mb-5">
                    <h3 className="flex-1 text-left text-1xl md:text-2xl font-black text-yellow-400 uppercase leading-tight">
                      {tournament.title}
                    </h3>

                    <span
                      className={`shrink-0 px-4 py-1 border rounded-full text-sm font-bold uppercase ${getStatusStyle(
                        tournament.tournament_status
                      )}`}
                    >
                      {tournament.tournament_status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Tournament Date</p>
                      <p className="text-white font-semibold">
                        {formatDate(tournament.tournament_date)}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400">Venue</p>
                      <p className="text-white font-semibold">
                        {tournament.venue}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400">Prize Pool</p>
                      <p className="text-white font-semibold">
                        {tournament.prize_pool}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400">Organizer</p>
                      <p className="text-white font-semibold">
                        {tournament.organizer}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400">Registration Deadline</p>
                      <p className="text-white font-semibold">
                        {formatDate(tournament.registration_deadline)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto pt-6">
                    <button
                      disabled={!canJoin}
                      onClick={() => joinTournament(tournament.id)}
                      className={`w-full py-3 font-bold rounded-xl transition ${
                        isRegistered
                          ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                          : !isOpen
                          ? "bg-red-700 text-gray-200 cursor-not-allowed"
                          : !teamId
                          ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                          : memberCount < 5
                          ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                          : "bg-yellow-500 hover:bg-yellow-600 text-black"
                      }`}
                    >
                      {isRegistered
                        ? "Registered"
                        : !isOpen
                        ? "Registration Closed"
                        : !teamId
                        ? "Create Team First"
                        : memberCount < 5
                        ? "Need 5 Members"
                        : "Join Tournament"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-10 text-center">
            <p className="text-gray-300">No available tournaments.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tournaments;