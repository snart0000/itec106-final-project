import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import API from "../api";
import mlBg from "../assets/ml-bg.jpg";

function CreateAdmin() {
  const { enqueueSnackbar } = useSnackbar();
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    first_name: "",
    middle_initial: "",
    last_name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      window.location.href = "/";
    }
  }, []);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const createAdmin = async (e) => {
    e.preventDefault();

    if (!form.first_name || !form.last_name || !form.email || !form.password) {
      enqueueSnackbar("Please complete all required fields.", {
        variant: "warning",
      });
      return;
    }

    try {
      const res = await fetch(`${API}/create_admin.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        enqueueSnackbar("Admin account created successfully!", {
          variant: "success",
        });

        setTimeout(() => {
          window.location.href = "/admin";
        }, 1000);
      } else {
        enqueueSnackbar(data.message || "Failed to create admin.", {
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

      <div className="relative z-10 container mx-auto max-w-3xl">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-black text-yellow-400 uppercase">
                Create Admin
              </h1>
              <p className="text-gray-300 mt-2">
                Add another administrator account.
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
            onSubmit={createAdmin}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <input
              placeholder="First Name *"
              value={form.first_name}
              className={inputStyle}
              onChange={(e) => handleChange("first_name", e.target.value)}
            />

            <input
              placeholder="Middle Initial"
              value={form.middle_initial}
              className={inputStyle}
              onChange={(e) =>
                handleChange("middle_initial", e.target.value)
              }
            />

            <input
              placeholder="Last Name *"
              value={form.last_name}
              className={inputStyle}
              onChange={(e) => handleChange("last_name", e.target.value)}
            />

            <input
              type="email"
              placeholder="Email Address *"
              value={form.email}
              className={inputStyle}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            <div className="md:col-span-2">
              <input
                type="password"
                placeholder="Password *"
                value={form.password}
                className={inputStyle}
                onChange={(e) => handleChange("password", e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="md:col-span-2 w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl transition"
            >
              Create Admin Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateAdmin;