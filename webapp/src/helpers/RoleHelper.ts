export function isRenderForModeratorAtLeast(role: string) {
  // TODO: make this a type
  return role === "admin" || role === "moderator";
}

export function isRenderForAdminOnly(role: string) {
  // TODO: make this a type
  return role === "admin";
}
