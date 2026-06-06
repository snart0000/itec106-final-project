import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import API from "../api";
import mlBg from "../assets/ml-bg.jpg";

function Invites() {
  const { enqueueSnackbar } = useSnackbar();

  const user = JSON.parse(localStorage.getItem("user"));
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);

  const getLogoUrl = (logo) => {
    if (!logo) return "";
    return logo.startsWith("http") ? logo : `${API}/${logo}`;
  };

  const fetchInvites = async () => {
    try {
      const res = await fetch(`${API}/get_invites.php?user_id=${user?.id}`);
      const data = await res.json();

      setInvites(data);
      setLoading(false);
    } catch (error) {
      enqueueSnackbar("Failed to load team invites.", {
        variant: "error",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  const respondInvite = async (inviteId, status) => {
    try {
      const res = await fetch(`${API}/respond_invite.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invite_id: inviteId,
          user_id: user?.id,
          status,
        }),
      });

      const data = await res.json();

      enqueueSnackbar(data.message, {
        variant: data.success ? "success" : "error",
      });

      if (data.success) {
        fetchInvites();
      }
    } catch (error) {
      enqueueSnackbar("Unable to connect to server.", {
        variant: "error",
      });
    }
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
              Team{" "}
              <span className="text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.7)]">
                Invites
              </span>
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-10 text-center">
            <p className="text-gray-300 text-lg">Loading invites...</p>
          </div>
        ) : invites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {invites.map((invite) => (
              <div
                key={invite.id}
                className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:border-yellow-400 transition"
              >
                {invite.team_logo && (
                  <img
                    src={getLogoUrl(invite.team_logo)}
                    alt="Team Logo"
                    className="absolute top-5 right-5 w-20 h-20 rounded-2xl object-cover border-2 border-yellow-400"
                  />
                )}

                <div className="pr-24">
                  <p className="text-gray-400 uppercase tracking-widest text-sm">
                    Team Invitation
                  </p>

                  <h3 className="text-3xl font-black text-yellow-400 uppercase mt-2">
                    {invite.team_name}
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 mt-6 text-sm">
                  <div>
                    <p className="text-gray-400">Team Leader</p>
                    <p className="text-white font-semibold">
                      {invite.leader_name} ({invite.leader_ign})
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400">Invited By</p>
                    <p className="text-white font-semibold">
                      {invite.inviter_name} ({invite.inviter_ign})
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400">Members</p>
                    <p className="text-white font-semibold">
                      {invite.member_count}/7
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => respondInvite(invite.id, "accepted")}
                    className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => respondInvite(invite.id, "declined")}
                    className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-10 text-center">
            <p className="text-gray-300 text-lg">
              You have no pending team invitations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Invites;