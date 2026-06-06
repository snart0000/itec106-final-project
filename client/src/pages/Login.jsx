import { useState } from "react";
import { useSnackbar } from "notistack";
import API from "../api";
import mlBg from "../assets/ml-bg.jpg";

function Login() {
  const { enqueueSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const login = async (e) => {
    e.preventDefault();

    if (!form.email.trim()) {
      enqueueSnackbar("Email is required.", {
        variant: "warning",
      });
      return;
    }

    if (!form.password.trim()) {
      enqueueSnackbar("Password is required.", {
        variant: "warning",
      });
      return;
    }

    try {
      const res = await fetch(`${API}/login.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        enqueueSnackbar("Login successful!", {
          variant: "success",
        });

        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      } else {
        enqueueSnackbar(
          data.message || "Invalid email or password.",
          {
            variant: "error",
          }
        );
      }
    } catch (error) {
      enqueueSnackbar(
        "Unable to connect to server.",
        {
          variant: "error",
        }
      );
    }
  };

  const inputStyle =
    "w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:border-yellow-400";

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${mlBg})`,
      }}
    >

      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-md px-8 py-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-400">
            ML Player Hub
          </h1>

          <p className="text-gray-300 mt-2">
            Login and find your next teammate
          </p>
        </div>

        <form onSubmit={login} className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            className={inputStyle}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            className={inputStyle}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />

          <button
            type="submit"
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-300 mt-6">
          No account?{" "}
          <a
            href="/register"
            className="text-yellow-400 hover:text-yellow-300 font-semibold"
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;