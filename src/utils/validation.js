export const validateName = (name, fieldName = "Name") => {
  if (!name.trim()) return `${fieldName} is required.`;
  if (name.length < 2)
    return `${fieldName} must be at least 2 characters long.`;
  if (name.length > 50) return `${fieldName} cannot exceed 50 characters.`;
  return null;
};

export const validateUsername = (username) => {
  if (!username.trim()) return "Username is required.";
  if (username.length < 3)
    return "Username must be at least 3 characters long.";
  if (username.length > 30) return "Username cannot exceed 30 characters.";
  if (!/^[a-zA-Z0-9_]+$/.test(username))
    return "Username can only contain letters, numbers, and underscores.";
  return null;
};

export const validatePassword = (password, isRequired = true) => {
  if (!password && !isRequired) return null; // Not required and empty is valid (for editing if the user doesn't want to change it)
  if (!password && isRequired) return "Password is required.";
  if (password.length < 8)
    return "Password must be at least 8 characters long.";
  if (!/[a-z]/.test(password))
    return "Password must contain a lowercase letter.";
  if (!/[A-Z]/.test(password))
    return "Password must contain an uppercase letter.";
  if (!/[0-9]/.test(password)) return "Password must contain a number.";
  if (!/[^a-zA-Z0-9]/.test(password))
    return "Password must contain a special character.";
  return null;
};
