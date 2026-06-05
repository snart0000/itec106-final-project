import { useState } from "react";
import API from "../api";

function Register() {
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

  const roles = ["Mid", "Roam", "Jungler", "Exp", "Gold"];

  const register = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API}/register.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    alert(data.message);

    if (data.success) {
      window.location.href = "/";
    }
  };

  return (
    <div>
      <h1>Register ML Player</h1>

      <form onSubmit={register}>
        <input
          placeholder="First Name"
          onChange={(e) =>
            setForm({ ...form, first_name: e.target.value })
          }
        />

        <input
          placeholder="Middle Initial"
          onChange={(e) =>
            setForm({ ...form, middle_initial: e.target.value })
          }
        />

        <input
          placeholder="Last Name"
          onChange={(e) =>
            setForm({ ...form, last_name: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          placeholder="IGN"
          onChange={(e) =>
            setForm({ ...form, ign: e.target.value })
          }
        />

        <input
          placeholder="UID"
          onChange={(e) =>
            setForm({ ...form, uid: e.target.value })
          }
        />

        <input
          placeholder="Server"
          onChange={(e) =>
            setForm({ ...form, server: e.target.value })
          }
        />

        <select
          onChange={(e) =>
            setForm({ ...form, role1: e.target.value })
          }
        >
          <option value="">Select Role 1</option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        <select
          onChange={(e) =>
            setForm({ ...form, role2: e.target.value })
          }
        >
          <option value="">Select Role 2</option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account? <a href="/">Login</a>
      </p>
    </div>
  );
}

export default Register;