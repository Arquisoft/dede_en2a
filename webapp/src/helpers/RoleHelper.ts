export function isRenderForModeratorAtLeast() {
  const role = localStorage.getItem("user.role");
  console.log(role);
  return role === "admin" || role === "moderator";
}

export function isRenderForAdminOnly() {
  const role = localStorage.getItem("user.role");
  console.log(role);
  return role === "admin";
}
