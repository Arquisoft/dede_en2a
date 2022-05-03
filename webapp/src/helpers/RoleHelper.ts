export function isRenderForModeratorAtLeast(role: string) {
  return role === "admin" || role === "moderator";
}

export function isRenderForAdminOnly(role: string) {
  return role === "admin";
}
