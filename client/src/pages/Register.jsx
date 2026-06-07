import { useState } from "react";
import { useSnackbar } from "notistack";
import API from "../api";
import mlBg from "../assets/ml-bg.jpg";
import { validateRegister } from "../schemas/registerSchema";

function Register() {
  const { enqueueSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    first_name: "",
    middle_initial: "",
    last_name: "",
    email: "",
    ign: "",
    uid: "",
    server: "",
    role1: "",
    role2: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const roles = ["Mid", "Roam", "Jungler", "Exp", "Gold"];

  const handleChange = (field, value) => {
    if (field === "role1") {
      setForm({
        ...form,
        role1: value,
        role2: form.role2 === value ? "" : form.role2,
      });
    } else {
      setForm({ ...form, [field]: value });
    }

    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const register = async (e) => {
    e.preventDefault();

    const validationErrors = validateRegister(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      enqueueSnackbar("Please complete all required fields correctly.", {
        variant: "error",
      });
      return;
    }

    try {
      const res = await fetch(`${API}/register.php`, {
        method: "POST",
        headers: {
          // "Content-Type": "application/json",
          "Content-Type": "text/plain",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        enqueueSnackbar(data.message || "Registration successful!", {
          variant: "success",
        });

        setTimeout(() => {
          window.location.href = "/";
        }, 1200);
      } else {
        enqueueSnackbar(data.message || "Registration failed.", {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar("Something went wrong. Please try again.", {
        variant: "error",
      });
    }
  };

  const inputStyle =
    "w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:border-yellow-400";

  const errorStyle = "text-red-400 text-sm mt-1";

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-4 py-10"
      style={{
        backgroundImage: `url(${mlBg})`,
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-3xl px-8 py-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-400">
            Register ML Player
          </h1>
          <p className="text-gray-300 mt-2">
            Create your player profile and join the battlefield
          </p>
        </div>

        <form
          onSubmit={register}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <div>
            <input
              placeholder="First Name"
              value={form.first_name}
              className={inputStyle}
              onChange={(e) => handleChange("first_name", e.target.value)}
            />
            {errors.first_name && (
              <p className={errorStyle}>{errors.first_name}</p>
            )}
          </div>

          <div>
            <input
              placeholder="Middle Initial (optional)"
              value={form.middle_initial}
              className={inputStyle}
              onChange={(e) =>
                handleChange("middle_initial", e.target.value)
              }
            />
          </div>

          <div>
            <input
              placeholder="Last Name"
              value={form.last_name}
              className={inputStyle}
              onChange={(e) => handleChange("last_name", e.target.value)}
            />
            {errors.last_name && (
              <p className={errorStyle}>{errors.last_name}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              className={inputStyle}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            {errors.email && <p className={errorStyle}>{errors.email}</p>}
          </div>

          <div>
            <input
              placeholder="IGN"
              value={form.ign}
              className={inputStyle}
              onChange={(e) => handleChange("ign", e.target.value)}
            />
            {errors.ign && <p className={errorStyle}>{errors.ign}</p>}
          </div>

          <div>
            <input
              placeholder="UID"
              value={form.uid}
              className={inputStyle}
              onChange={(e) => handleChange("uid", e.target.value)}
            />
            {errors.uid && <p className={errorStyle}>{errors.uid}</p>}
          </div>

          <div>
            <input
              placeholder="Server"
              value={form.server}
              className={inputStyle}
              onChange={(e) => handleChange("server", e.target.value)}
            />
            {errors.server && <p className={errorStyle}>{errors.server}</p>}
          </div>

          <div>
            <select
              value={form.role1}
              className={inputStyle}
              onChange={(e) => handleChange("role1", e.target.value)}
            >
              <option value="" className="text-black">
                Select Role 1
              </option>

              {roles.map((role) => (
                <option key={role} value={role} className="text-black">
                  {role}
                </option>
              ))}
            </select>

            {errors.role1 && <p className={errorStyle}>{errors.role1}</p>}
          </div>

          <div>
            <select
              value={form.role2}
              className={inputStyle}
              onChange={(e) => handleChange("role2", e.target.value)}
            >
              <option value="" className="text-black">
                Select Role 2
              </option>

              {roles
                .filter((role) => role !== form.role1)
                .map((role) => (
                  <option key={role} value={role} className="text-black">
                    {role}
                  </option>
                ))}
            </select>

            {errors.role2 && <p className={errorStyle}>{errors.role2}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              className={inputStyle}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            {errors.password && (
              <p className={errorStyle}>{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="md:col-span-2 w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition duration-300"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-300 mt-6">
          Already have an account?{" "}
          <a
            href="/"
            className="text-yellow-400 hover:text-yellow-300 font-semibold"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;