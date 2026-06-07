import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import API from "../api";
import mlBg from "../assets/ml-bg.jpg";

function Dashboard() {
  const { enqueueSnackbar } = useSnackbar();

  const user = JSON.parse(localStorage.getItem("user"));
  const [inviteCount, setInviteCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);

  const logout = () => {
    enqueueSnackbar("Logged out successfully.", {
      variant: "success",
    });

    setTimeout(() => {
      localStorage.removeItem("user");
      window.location.href = "/";
    }, 500);
  };

  const getInvites = async () => {
    try {
      const res = await fetch(
        `${API}/get_invites.php?user_id=${user?.id}`
      );

      const data = await res.json();
      setInviteCount(data.length);
    } catch (error) {
      enqueueSnackbar("Failed to load team invites.", {
        variant: "error",
      });
    }
  };

  const getNotificationCount = async () => {
    try {
      const res = await fetch(
        `${API}/get_notification_count.php?user_id=${user?.id}`
      );

      const data = await res.json();
      setNotificationCount(Number(data.count));
    } catch (error) {
      enqueueSnackbar("Failed to load notifications.", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    getInvites();
    getNotificationCount();
  }, []);

  const menus = [
    {
      title: "Search Players",
      description: "Find teammates based on role and rank.",
      link: "/search",
      icon: "🔍",
    },
    {
      title: "My Team",
      description: "Build your squad and conquer the Land of Dawn.",
      link: "/team",
      icon: "👥",
    },
    {
      title: "Team Invites",
      description: "Accept or decline team invitations.",
      link: "/invites",
      icon: "📩",
      badge: inviteCount,
    },
    {
      title: "Tournaments",
      description: "Browse upcoming matches and MLBB tournaments.",
      link: "/tournaments",
      icon: "🏆",
    },
    {
      title: "Notifications",
      description: "View system alerts and important updates.",
      link: "/notifications",
      icon: "🔔",
      badge: notificationCount,
    },
    {
      title: "View Profile",
      description: "Manage your ML Player profile.",
      link: "/profile",
      icon: "🎮",
    },
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${mlBg})` }}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-6 mb-8 overflow-hidden min-h-70">
          <div className="flex justify-between items-start">
            <h2 className="text-1xl md:text-2xl font-extrabold text-white uppercase tracking-wide">
              MLBB Community Hub
            </h2>

            <button
              onClick={logout}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition"
            >
              Logout
            </button>
          </div>

          <div className="absolute left-4 md:left-6 bottom-8">
            <h2 className="text-6xl md:text-9xl font-black uppercase leading-none">
              <span className="text-6xl text-white">
                Welcome Back,
              </span>{" "}
              <span className="text-6xl text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.7)]">
                {user?.ign?.toUpperCase()}!
              </span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
          {menus.map((menu) => (
            <a
              key={menu.title}
              href={menu.link}
              className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:border-yellow-400 hover:scale-[1.02] transition-all duration-300"
            >
              {menu.badge > 0 && (
                <span className="absolute top-4 right-4 min-w-8 h-8 px-2 bg-red-600 text-white text-sm font-bold rounded-full flex items-center justify-center">
                  {menu.badge}
                </span>
              )}

              <div className="text-5xl mb-4">
                {menu.icon}
              </div>

              <h2 className="text-2xl font-bold text-yellow-400 mb-2">
                {menu.title}
              </h2>

              <p className="text-gray-300">
                {menu.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;