export const validateRegister = (form) => {
  const errors = {};

  if (!form.first_name.trim()) {
    errors.first_name = "First name is required.";
  }

  if (!form.last_name.trim()) {
    errors.last_name = "Last name is required.";
  }

  if (!form.email.trim()) {
    errors.email = "Email is required.";
  }

  if (!form.ign.trim()) {
    errors.ign = "IGN is required.";
  }

  if (!form.uid.trim()) {
    errors.uid = "UID is required.";
  }

  if (!form.server.trim()) {
    errors.server = "Server is required.";
  }

  if (!form.role1.trim()) {
    errors.role1 = "Role 1 is required.";
  }

  if (!form.role2.trim()) {
    errors.role2 = "Role 2 is required.";
  }

  if (!form.password.trim()) {
    errors.password = "Password is required.";
  } else if (form.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]`;']/.test(form.password)) {
    errors.password = "Password must contain at least one special character.";
  }

  return errors;
};