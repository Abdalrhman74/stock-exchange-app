export function getUsernameFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // decode JWT payload
    return payload.sub || null; // 'sub' contains the username
  } catch (err) {
    console.error("Failed to parse token:", err);
    return null;
  }
}
