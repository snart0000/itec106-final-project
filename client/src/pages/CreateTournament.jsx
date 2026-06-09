import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import API from "../api";
import mlBg from "../assets/ml-bg.jpg";

function CreateTournament() {
  const { enqueueSnackbar } = useSnackbar();
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    title: "",
    tournament_date: "",
    venue: "",
    prize_pool: "",
    organizer: "",
    registration_deadline: "",
  });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      window.location.href = "/";
    }
  }, []);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const createTournament = async (e) => {
    e.preventDefault();

    if (!form.title || !form.tournament_date || !form.registration_deadline) {
      enqueueSnackbar("Please fill in all required fields.", {
        variant: "warning",
      });
      return;
    }

    try {
      const res = await fetch(`${API}/create_tournament.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        enqueueSnackbar("Tournament created successfully!", {
          variant: "success",
        });

        setTimeout(() => {
          window.location.href = "/admin";
        }, 1000);
      } else {
        enqueueSnackbar(data.message || "Failed to create tournament.", {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar("Unable to connect to server.", {
        variant: "error",
      });
    }
  };

  const inputStyle =
    "w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:border-yellow-400";

  return (
    <div
      className="min-h-screen bg-cover bg-center relative px-4 py-8"
      style={{ backgroundImage: `url(${mlBg})` }}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm"></div>

      <div className="relative z-10 container mx-auto max-w-4xl">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-black text-yellow-400 uppercase">
                Create Tournament
              </h1>
              <p className="text-gray-300 mt-2">
                Add a new MLBB tournament for players to join.
              </p>
            </div>

            <a
              href="/admin"
              className="px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-bold transition"
            >
              Back
            </a>
          </div>

          <form
            onSubmit={createTournament}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <div className="md:col-span-2">
              <input
                placeholder="Tournament Title *"
                value={form.title}
                className={inputStyle}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>

            <input
              type="date"
              value={form.tournament_date}
              className={inputStyle}
              onChange={(e) =>
                handleChange("tournament_date", e.target.value)
              }
            />

            <input
              type="datetime-local"
              value={form.registration_deadline}
              className={inputStyle}
              onChange={(e) =>
                handleChange("registration_deadline", e.target.value)
              }
            />

            <input
              placeholder="Venue"
              value={form.venue}
              className={inputStyle}
              onChange={(e) => handleChange("venue", e.target.value)}
            />

            <input
              placeholder="Prize Pool"
              value={form.prize_pool}
              className={inputStyle}
              onChange={(e) => handleChange("prize_pool", e.target.value)}
            />

            <div className="md:col-span-2">
              <input
                placeholder="Organizer"
                value={form.organizer}
                className={inputStyle}
                onChange={(e) => handleChange("organizer", e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="md:col-span-2 w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl transition"
            >
              Create Tournament
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateTournament;