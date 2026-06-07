import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import API from "../api";
import mlBg from "../assets/ml-bg.jpg";

function Team() {
  const { enqueueSnackbar } = useSnackbar();

  const user = JSON.parse(localStorage.getItem("user"));

  const [teamName, setTeamName] = useState("");
  const [teamLogo, setTeamLogo] = useState("");
  const [teamLogoFile, setTeamLogoFile] = useState(null);
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [showApplications, setShowApplications] = useState(false);

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: "",
    message: "",
    actionText: "",
    actionType: "",
    payload: null,
  });

  const fetchApplications = async (teamId) => {
    try {
      const res = await fetch(`${API}/get_team_applications.php?team_id=${teamId}`);
      const data = await res.json();

      setApplications(data);
    } catch (error) {
      enqueueSnackbar("Failed to load team applications.", {
        variant: "error",
      });
    }
  };

  const fetchMyTeam = async () => {
    try {
      const res = await fetch(`${API}/get_my_team.php?user_id=${user?.id}`);
      const data = await res.json();

      if (data.has_team) {
        setTeam(data.team);
        setMembers(data.members);
        fetchApplications(data.team.id);
      } else {
        setTeam(null);
        setMembers([]);
        setApplications([]);
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
    fetchMyTeam();
  }, []);

  const respondApplication = async (application, status) => {
    try {
      const res = await fetch(`${API}/respond_application.php`, {
        method: "POST",
        headers: {
          // "Content-Type": "application/json",
          "Content-Type": "text/plain",
        },
        body: JSON.stringify({
          application_id: application.id,
          team_id: team.id,
          leader_id: user?.id,
          user_id: application.user_id,
          status,
        }),
      });

      const data = await res.json();

      enqueueSnackbar(data.message, {
        variant: data.success ? "success" : "error",
      });

      if (data.success) {
        fetchMyTeam();
        fetchApplications(team.id);
      }
    } catch (error) {
      enqueueSnackbar("Unable to connect to server.", {
        variant: "error",
      });
    }
  };

  const createTeam = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("team_name", teamName);
      formData.append("team_logo", teamLogo);
      formData.append("leader_id", user?.id);

      if (teamLogoFile) {
        formData.append("team_logo_file", teamLogoFile);
      }

      const res = await fetch(`${API}/create_team.php`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      enqueueSnackbar(
        data.success
          ? "Team created successfully!"
          : data.message || "Failed to create team.",
        {
          variant: data.success ? "success" : "error",
        }
      );

      if (data.success) {
        setTeamName("");
        setTeamLogo("");
        setTeamLogoFile(null);
        fetchMyTeam();
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

  const openLeaveModal = () => {
    const isCurrentUserLeader = Number(team?.leader_id) === Number(user?.id);

    setConfirmModal({
      open: true,
      title: isCurrentUserLeader ? "Delete Team?" : "Leave Team?",
      message: isCurrentUserLeader
        ? "You are the leader. Leaving will delete the whole team. This action cannot be undone."
        : "Are you sure you want to leave this team?",
      actionText: isCurrentUserLeader ? "Delete Team" : "Leave Team",
      actionType: "leave",
      payload: null,
    });
  };

  const openKickModal = (member) => {
    setConfirmModal({
      open: true,
      title: "Kick Member?",
      message: `Are you sure you want to kick ${member.ign} from the team?`,
      actionText: "Kick Member",
      actionType: "kick",
      payload: member,
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      open: false,
      title: "",
      message: "",
      actionText: "",
      actionType: "",
      payload: null,
    });
  };

  const leaveTeam = async () => {
    try {
      const res = await fetch(`${API}/leave_team.php`, {
        method: "POST",
        headers: {
          // "Content-Type": "application/json",
          "Content-Type": "text/plain",
        },
        body: JSON.stringify({
          team_id: team.id,
          user_id: user?.id,
        }),
      });

      const data = await res.json();

      enqueueSnackbar(data.message, {
        variant: data.success ? "success" : "error",
      });

      if (data.success) {
        closeConfirmModal();
        fetchMyTeam();
      }
    } catch (error) {
      enqueueSnackbar("Unable to connect to server.", {
        variant: "error",
      });
    }
  };

  const kickMember = async (memberId) => {
    try {
      const res = await fetch(`${API}/kick_member.php`, {
        method: "POST",
        headers: {
          // "Content-Type": "application/json",
          "Content-Type": "text/plain",
        },
        body: JSON.stringify({
          team_id: team.id,
          leader_id: user?.id,
          member_id: memberId,
        }),
      });

      const data = await res.json();

      enqueueSnackbar(data.message, {
        variant: data.success ? "success" : "error",
      });

      if (data.success) {
        closeConfirmModal();
        fetchMyTeam();
      }
    } catch (error) {
      enqueueSnackbar("Unable to connect to server.", {
        variant: "error",
      });
    }
  };

  const handleConfirmAction = () => {
    if (confirmModal.actionType === "leave") {
      leaveTeam();
    }

    if (confirmModal.actionType === "kick" && confirmModal.payload) {
      kickMember(confirmModal.payload.id);
    }
  };

  const isLeader = Number(team?.leader_id) === Number(user?.id);

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
              My{" "}
              <span className="text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.7)]">
                Team
              </span>
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-10 text-center">
            <p className="text-gray-300 text-lg">Loading team...</p>
          </div>
        ) : team ? (
          <>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="text-left">
                  <p className="text-gray-400 uppercase tracking-widest text-sm">
                    Current Squad
                  </p>

                  <h3 className="text-4xl md:text-5xl font-black text-yellow-400 uppercase mt-2">
                    {team.team_name}
                  </h3>

                  <p className="text-gray-300 mt-2">
                    Members: {members.length}/7
                  </p>

                  {isLeader && (
                    <p className="text-yellow-400 mt-2 font-semibold">👑</p>
                  )}
                </div>

                <div className="flex flex-col items-start md:items-end gap-4 w-full md:w-56">
                  {team.team_logo && (
                    <img
                      src={getLogoUrl(team.team_logo)}
                      alt="Team Logo"
                      className="w-28 h-28 rounded-2xl object-cover border-2 border-yellow-400 shadow-lg"
                    />
                  )}

                  {isLeader && (
                    <button
                      onClick={() => setShowApplications(true)}
                      className="relative w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 transition"
                    >
                      Applications

                      {applications.length > 0 && (
                        <span className="absolute -top-2 -right-2 min-w-6 h-6 px-2 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {applications.length}
                        </span>
                      )}
                    </button>
                  )}

                  <a
                    href="/search"
                    className="w-full text-center py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl transition"
                  >
                    Invite Players
                  </a>

                  <button
                    onClick={openLeaveModal}
                    className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition"
                  >
                    Leave Team
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-yellow-400 mb-6">
                Team Members
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/20 text-gray-300">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">IGN</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">UID</th>
                      <th className="py-3 px-4">Server</th>
                      {isLeader && <th className="py-3 px-4">Action</th>}
                    </tr>
                  </thead>

                  <tbody>
                    {members.map((member) => {
                      const isSelf = Number(member.id) === Number(user?.id);

                      return (
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
                            {member.role1}
                          </td>

                          <td className="py-4 px-4 text-white">
                            {member.uid}
                          </td>

                          <td className="py-4 px-4 text-white">
                            {member.server}
                          </td>

                          {isLeader && (
                            <td className="py-4 px-4">
                              {!isSelf ? (
                                <button
                                  onClick={() => openKickModal(member)}
                                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition"
                                >
                                  Kick
                                </button>
                              ) : (
                                <span className="text-gray-400">Leader</span>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
            <h3 className="text-3xl font-black text-yellow-400 uppercase mb-2">
              Create Your Team
            </h3>

            <p className="text-gray-300 mb-6">
              You do not have a team yet. Create one and become the team leader.
            </p>

            <form onSubmit={createTeam} className="space-y-5">
              <input
                type="text"
                placeholder="Team Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:border-yellow-400"
              />

              <input
                type="text"
                placeholder="Team Logo Link optional"
                value={teamLogo}
                onChange={(e) => setTeamLogo(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:border-yellow-400"
              />

              <div>
                <label className="block text-gray-300 mb-2">
                  Or upload team logo
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setTeamLogoFile(e.target.files[0])}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-500 file:text-black file:font-bold hover:file:bg-yellow-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition"
              >
                Create Team
              </button>
            </form>
          </div>
        )}
      </div>

      {showApplications && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4">
          <div className="w-full max-w-3xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-yellow-400">
                Team Applications
              </h3>

              <button
                onClick={() => setShowApplications(false)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg"
              >
                Close
              </button>
            </div>

            {applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white/10 border border-white/20 rounded-xl p-5"
                  >
                    <h4 className="text-xl font-bold text-yellow-400">
                      {app.ign}
                    </h4>

                    <p className="text-gray-300">
                      {app.first_name} {app.last_name}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                      <div>
                        <p className="text-gray-400">UID</p>
                        <p className="text-white font-semibold">{app.uid}</p>
                      </div>

                      <div>
                        <p className="text-gray-400">Server</p>
                        <p className="text-white font-semibold">
                          {app.server}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400">Role</p>
                        <p className="text-white font-semibold">
                          {app.role1}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-5">
                      <button
                        onClick={() => respondApplication(app, "accepted")}
                        className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() => respondApplication(app, "declined")}
                        className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-300 text-center py-8">
                No pending applications.
              </p>
            )}
          </div>
        </div>
      )}

      {confirmModal.open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-yellow-400 mb-3">
              {confirmModal.title}
            </h3>

            <p className="text-gray-300 mb-6">
              {confirmModal.message}
            </p>

            <div className="flex gap-4">
              <button
                onClick={closeConfirmModal}
                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg border border-white/20 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmAction}
                className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition"
              >
                {confirmModal.actionText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Team;