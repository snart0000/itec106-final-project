import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import API from "../api";
import mlBg from "../assets/ml-bg.jpg";

function Search() {
  const { enqueueSnackbar } = useSnackbar();

  const user = JSON.parse(localStorage.getItem("user"));
  const WAITING_HOURS = import.meta.env.VITE_INVITE_WAITING_HOURS || 24;

  const [q, setQ] = useState("");
  const [players, setPlayers] = useState([]);
  const [myTeam, setMyTeam] = useState(null);

  const getMyTeam = async () => {
    try {
      const res = await fetch(`${API}/get_my_team.php?user_id=${user?.id}`);
      const data = await res.json();

      if (data.has_team) {
        setMyTeam(data.team);
      }
    } catch (error) {
      enqueueSnackbar("Failed to load your team.", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    getMyTeam();
  }, []);

  const searchPlayers = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${API}/search_user.php?q=${encodeURIComponent(q)}&my_team_id=${
          myTeam?.id || 0
        }&waiting_hours=${WAITING_HOURS}`
      );

      const data = await res.json();
      setPlayers(data);

      if (data.length === 0) {
        enqueueSnackbar("No players found.", {
          variant: "info",
        });
      }
    } catch (error) {
      enqueueSnackbar("Failed to search players.", {
        variant: "error",
      });
    }
  };

  const invitePlayer = async (playerId) => {
    if (!myTeam) {
      enqueueSnackbar("You need to create a team first before inviting players.", {
        variant: "warning",
      });
      return;
    }

    try {
      const res = await fetch(`${API}/invite_user.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          team_id: myTeam.id,
          user_id: playerId,
          invited_by: user?.id,
          waiting_hours: WAITING_HOURS,
        }),
      });

      const data = await res.json();

      enqueueSnackbar(data.message, {
        variant: data.success ? "success" : "error",
      });

      if (data.success) {
        setPlayers((prev) =>
          prev.map((player) =>
            Number(player.id) === Number(playerId)
              ? { ...player, has_pending_invite: 1 }
              : player
          )
        );
      }
    } catch (error) {
      enqueueSnackbar("Unable to connect to server.", {
        variant: "error",
      });
    }
  };

  const getLogoUrl = (logo) => {
    if (!logo) return "";

    return logo.startsWith("http") ? logo : `${API}/${logo}`;
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${mlBg})` }}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-white uppercase tracking-wide">
                MLBB Community Hub
              </h2>

              <div className="w-full text-left mt-10">
                <h2 className="text-5xl md:text-7xl font-black uppercase text-white">
                  Search{" "}
                  <span className="text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.7)]">
                    Players
                  </span>
                </h2>
              </div>
            </div>

            <a
              href="/dashboard"
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl transition"
            >
              Back
            </a>
          </div>

          <form
            onSubmit={searchPlayers}
            className="flex flex-col md:flex-row gap-4"
          >
            <input
              type="text"
              placeholder="Search by IGN, UID, name, role, or team name..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:border-yellow-400"
            />

            <button
              type="submit"
              className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition"
            >
              Search
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {players.length > 0 ? (
            players.map((player) => {
              const hasTeam = player.team_id !== null;
              const hasPendingInvite = Number(player.has_pending_invite) === 1;
              const isMe = Number(player.id) === Number(user?.id);
              const disableInvite = hasTeam || hasPendingInvite || isMe || !myTeam;

              return (
                <div
                  key={player.id}
                  className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:border-yellow-400 transition-all duration-300"
                >
                  {player.team_logo && (
                    <img
                      src={getLogoUrl(player.team_logo)}
                      alt="Team Logo"
                      className="absolute top-5 right-5 w-16 h-16 rounded-xl object-cover border border-yellow-400 z-20"
                    />
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-3xl font-black text-yellow-400 uppercase mb-2">
                      {player.ign}
                    </h3>

                    <p className="text-gray-300">
                      {player.first_name} {player.last_name}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">UID</p>
                      <p className="text-white font-semibold">{player.uid}</p>
                    </div>

                    <div>
                      <p className="text-gray-400">Server</p>
                      <p className="text-white font-semibold">
                        {player.server}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400">Primary Role</p>
                      <p className="text-white font-semibold">
                        {player.role1}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400">Secondary Role</p>
                      <p className="text-white font-semibold">
                        {player.role2}
                      </p>
                    </div>

                    <div className="col-span-2">
                      <p className="text-gray-400">Squad / Team</p>
                      <p
                        className={`font-semibold ${
                          hasTeam ? "text-yellow-400" : "text-green-400"
                        }`}
                      >
                        {hasTeam ? player.team_name : "No Team"}
                      </p>
                    </div>
                  </div>

                  <button
                    disabled={disableInvite}
                    onClick={() => invitePlayer(player.id)}
                    className={`mt-6 w-full py-3 font-bold rounded-lg transition ${
                      disableInvite
                        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                        : "bg-yellow-500 hover:bg-yellow-600 text-black"
                    }`}
                  >
                    {isMe
                      ? "You"
                      : hasTeam
                      ? "Already in a Team"
                      : hasPendingInvite
                      ? "Waiting for Response"
                      : !myTeam
                      ? "Create Team First"
                      : "Invite Player"}
                  </button>

                  {hasTeam && (
                    <a
                      href={`/view-team/${player.team_id}`}
                      className="mt-4 block w-full text-center py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg border border-white/20 transition"
                    >
                      View Team
                    </a>
                  )}
                </div>
              );
            })
          ) : (
            <div className="md:col-span-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-10 text-center">
              <p className="text-gray-300 text-lg">
                Search for players by IGN, UID, name, role, or team name.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;