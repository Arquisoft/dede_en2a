import { userModel } from "../users/User";

export const verifyWebID = async (webId: string) => {
  const aux = webId.trim().toString() + "";
  const userFound = await userModel.find({ webId: aux });
  if (userFound.length >= 1) return true;
  else return false;
};
