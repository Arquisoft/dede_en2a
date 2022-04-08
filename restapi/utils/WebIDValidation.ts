export const verifyWebId = (webId: string) => {
  if (webId != undefined) return true;
  console.log("El usuario no está loggeado :(");
  return false;
};
