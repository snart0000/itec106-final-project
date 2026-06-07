import { useEffect, useState } from "react";
import API from "../api";
import mlBg from "../assets/ml-bg.jpg";

function Notifications() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    const res = await fetch(`${API}/get_notifications.php?user_id=${user?.id}`);
    const data = await res.json();

    setNotifications(data);
    setLoading(false);
  };

  const markAsRead = async () => {
    const res = await fetch(`${API}/mark_notifications_read.php`, {
      method: "POST",
      headers: {
        // "Content-Type": "application/json",
        "Content-Type": "text/plain",
      },
      body: JSON.stringify({ user_id: user?.id }),
    });

    const data = await res.json();

    if (data.success) {
      fetchNotifications();
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

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
              Notifications{" "}
              <span className="text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.7)]">
                Center
              </span>
            </h2>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-yellow-400">
              Recent Activities
            </h3>

            <button
              onClick={markAsRead}
              className="px-5 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition"
            >
              Mark all as read
            </button>
          </div>

          {loading ? (
            <p className="text-gray-300">Loading notifications...</p>
          ) : notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`border rounded-xl p-5 ${
                    Number(notif.is_read) === 0
                      ? "bg-yellow-500/10 border-yellow-400"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <h4 className="flex-1 text-left text-yellow-400 font-bold text-lg">
                        {notif.title}
                      </h4>

                      <p className="text-gray-300 mt-1">
                        {notif.message}
                      </p>

                      <p className="text-gray-500 flex-1 text-left text-sm mt-3">
                        {notif.created_at}
                      </p>
                    </div>

                    {Number(notif.is_read) === 0 && (
                      <span className="h-3 w-3 bg-red-500 rounded-full mt-2"></span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-300 text-center py-8">
              No notifications yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;