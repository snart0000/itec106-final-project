import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import API from "../api";
import mlBg from "../assets/ml-bg.jpg";

function Profile() {
  const { enqueueSnackbar } = useSnackbar();

  const user = JSON.parse(localStorage.getItem("user"));

  const roles = [
    "Mid",
    "Roam",
    "Jungler",
    "Exp",
    "Gold",
  ];

  const [profile, setProfile] = useState(null);

  const [editing, setEditing] =
    useState(false);

  const [passwordForm, setPasswordForm] =
    useState({
      old_password: "",
      new_password: "",
      confirm_password: "",
    });

  const getProfile = async () => {
    try {
      const res = await fetch(
        `${API}get_profile.php?user_id=${user.id}`
      );

      const data = await res.json();

      setProfile(data);
    } catch (error) {
      enqueueSnackbar(
        "Failed to load profile.",
        {
          variant: "error",
        }
      );
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const saveProfile = async () => {
    try {
      const res = await fetch(
        `${API}update_profile.php`,
        {
          method: "POST",
          headers: {
            // "Content-Type": "application/json",
            "Content-Type": "text/plain",
          },
          body: JSON.stringify({
            ...profile,
            user_id: user.id,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        enqueueSnackbar(
          "Profile updated successfully.",
          {
            variant: "success",
          }
        );

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            ...profile,
          })
        );

        setEditing(false);
      } else {
        enqueueSnackbar(
          data.message ||
            "Failed to update profile.",
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

  const changePassword = async () => {
    if (
      passwordForm.new_password !==
      passwordForm.confirm_password
    ) {
      enqueueSnackbar(
        "Passwords do not match.",
        {
          variant: "warning",
        }
      );

      return;
    }

    try {
      const res = await fetch(
        `${API}change_password.php`,
        {
          method: "POST",
          headers: {
            // "Content-Type": "application/json",
            "Content-Type": "text/plain",
          },
          body: JSON.stringify({
            user_id: user.id,
            old_password:
              passwordForm.old_password,
            new_password:
              passwordForm.new_password,
          }),
        }
      );

      const data = await res.json();

      enqueueSnackbar(data.message, {
        variant: data.success
          ? "success"
          : "error",
      });

      if (data.success) {
        setPasswordForm({
          old_password: "",
          new_password: "",
          confirm_password: "",
        });
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

  if (!profile) return null;

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${mlBg})`,
      }}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8">
          <div className="flex justify-between">
            <h2 className="text-2xl font-extrabold text-white">
              MLBB Community Hub
            </h2>

            <a
              href="/dashboard"
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl"
            >
              Back
            </a>
          </div>

          <div className="mt-10 text-left">
            <h2 className="text-5xl md:text-7xl font-black uppercase text-white">
              My{" "}
              <span className="text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.7)]">
                Profile
              </span>
            </h2>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-black text-yellow-400">
              Player Information
            </h2>

            <button
              onClick={() =>
                setEditing(!editing)
              }
              className="px-5 py-2 bg-yellow-500 text-black font-bold rounded-lg"
            >
              {editing
                ? "Cancel"
                : "Edit Profile"}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-5">

            {[
              "first_name",
              "middle_initial",
              "last_name",
              "email",
              "ign",
              "uid",
              "server",
            ].map((field) => (
              <div key={field}>
                <p className="text-gray-400 capitalize">
                  {field.replaceAll(
                    "_",
                    " "
                  )}
                </p>

                {editing ? (
                  <input
                    value={profile[field]}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        [field]:
                          e.target.value,
                      })
                    }
                    className="w-full mt-2 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
                  />
                ) : (
                  <p className="text-white font-semibold">
                    {profile[field]}
                  </p>
                )}
              </div>
            ))}

            <div>
              <p className="text-gray-400">
                Primary Role
              </p>

              {editing ? (
                <select
                  value={profile.role1}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      role1:
                        e.target.value,
                      role2:
                        profile.role2 ===
                        e.target.value
                          ? ""
                          : profile.role2,
                    })
                  }
                  className="w-full mt-2 px-4 py-3 rounded-lg bg-black/40 text-white"
                >
                  {roles.map((role) => (
                    <option
                      key={role}
                    >
                      {role}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-white font-semibold">
                  {profile.role1}
                </p>
              )}
            </div>

            <div>
              <p className="text-gray-400">
                Secondary Role
              </p>

              {editing ? (
                <select
                  value={profile.role2}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      role2:
                        e.target.value,
                    })
                  }
                  className="w-full mt-2 px-4 py-3 rounded-lg bg-black/40 text-white"
                >
                  {roles
                    .filter(
                      (role) =>
                        role !==
                        profile.role1
                    )
                    .map((role) => (
                      <option
                        key={role}
                      >
                        {role}
                      </option>
                    ))}
                </select>
              ) : (
                <p className="text-white font-semibold">
                  {profile.role2}
                </p>
              )}
            </div>
          </div>

          {editing && (
            <button
              onClick={saveProfile}
              className="mt-6 px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl"
            >
              Save Changes
            </button>
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">

          <h2 className="text-3xl font-black text-yellow-400 mb-6">
            Security
          </h2>

          <div className="space-y-4">

            <input
              type="password"
              placeholder="Old Password"
              value={
                passwordForm.old_password
              }
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  old_password:
                    e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
            />

            <input
              type="password"
              placeholder="New Password"
              value={
                passwordForm.new_password
              }
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  new_password:
                    e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={
                passwordForm.confirm_password
              }
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirm_password:
                    e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
            />

            <button
              onClick={changePassword}
              className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl"
            >
              Change Password
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;