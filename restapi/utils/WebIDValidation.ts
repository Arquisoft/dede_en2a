import { userModel } from "../users/User";

export const verifyWebID = async (webId: String) => {
  const userFound = await userModel.find({ webId: webId });
  if (userFound.length >= 1) return true;
  else return false;
};
