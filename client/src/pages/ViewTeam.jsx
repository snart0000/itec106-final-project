import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import API from "../api";
import mlBg from "../assets/ml-bg.jpg";

function ViewTeam() {
  const { teamId } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const user = JSON.parse(localStorage.getItem("user"));

  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [memberCount, setMemberCount] = useState(0);
  const [hasPendingApplication, setHasPendingApplication] = useState(false);
  const [hasTeam, setHasTeam] = useState(false);
  const [loading, setLoading] = useState(true);

  const getLogoUrl = (logo) => {
    if (!logo) return "";
    return logo.startsWith("http")
      ? logo
      : `${API}/${logo}`;
  };

  const fetchTeam = async () => {
    try {
      const res = await fetch(
        `${API}get_public_team.php?team_id=${teamId}&user_id=${user?.id}`
      );

      const data = await res.json();

      if (data.success) {
        setTeam(data.team);
        setMembers(data.members);
        setMemberCount(Number(data.member_count));
        setHasPendingApplication(data.has_pending_application);
        setHasTeam(data.has_team);
      }

      setLoading(false);
    } catch (error) {
      enqueueSnackbar("Failed to load team.", {
        variant: "error",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const submitApplication = async () => {
    try {
      const res = await fetch(`${API}submit_application.php`, {
        method: "POST",
        headers: {
          // "Content-Type": "application/json",
          "Content-Type": "text/plain",
        },
        body: JSON.stringify({
          team_id: teamId,
          user_id: user?.id,
        }),
      });

      const data = await res.json();

      enqueueSnackbar(data.message, {
        variant: data.success ? "success" : "error",
      });

      if (data.success) {
        fetchTeam();
      }
    } catch (error) {
      enqueueSnackbar("Unable to connect to server.", {
        variant: "error",
      });
    }
  };

  const isFull = memberCount >= 7;
  const disableApplication =
    isFull || hasTeam || hasPendingApplication;

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
              href="/search"
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl transition"
            >
              Back
            </a>
          </div>

          <div className="mt-10 text-left">
            <h2 className="text-5xl md:text-7xl font-black uppercase text-white">
              View{" "}
              <span className="text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.7)]">
                Team
              </span>
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-10 text-center">
            <p className="text-gray-300">Loading team...</p>
          </div>
        ) : team ? (
          <>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="text-left">
                  <p className="text-gray-400 uppercase tracking-widest text-sm">
                    Team Name
                  </p>

                  <h3 className="text-4xl md:text-5xl font-black text-yellow-400 uppercase mt-2">
                    {team.team_name}
                  </h3>

                  <p className="text-gray-300 mt-2">
                    Team Count: {memberCount}/7
                  </p>
                </div>

                <div className="flex flex-col items-start md:items-end gap-4">
                  {team.team_logo && (
                    <img
                      src={getLogoUrl(team.team_logo)}
                      alt="Team Logo"
                      className="w-28 h-28 rounded-2xl object-cover border-2 border-yellow-400 shadow-lg"
                    />
                  )}

                  <button
                    disabled={disableApplication}
                    onClick={submitApplication}
                    className={`px-6 py-3 font-bold rounded-xl transition ${
                      disableApplication
                        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                        : "bg-yellow-500 hover:bg-yellow-600 text-black"
                    }`}
                  >
                    {isFull
                      ? "Team Full"
                      : hasTeam
                      ? "Already in a Team"
                      : hasPendingApplication
                      ? "Application Sent"
                      : "Submit Application"}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-yellow-400 mb-6">
                Players
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/20 text-gray-300">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">IGN</th>
                      <th className="py-3 px-4">UID</th>
                    </tr>
                  </thead>

                  <tbody>
                    {members.map((member) => (
                      <tr
                        key={member.id}
                        className="border-b border-white/10 hover:bg-white/10 transition"
                      >
                        <td className="py-4 px-4 text-white font-semibold">
                          {member.first_name} {member.last_name}
                        </td>

                        <td className="py-4 px-4 text-yellow-400 font-bold">
                          {member.ign}
                        </td>

                        <td className="py-4 px-4 text-white">
                          {member.uid}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-10 text-center">
            <p className="text-gray-300">Team not found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewTeam;