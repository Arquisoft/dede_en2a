import * as EmailValidator from "email-validator";

var passwordValidator = require("password-validator");

export const checkEmail = (email: string) => {
  if (EmailValidator.validate(email)) return true;
  else return false;
};

export const checkPasswords = (pass: string, repPass: string) => {
  if (pass === repPass) return true;
  else return false;
};

export const checkPassword = (pass: string) => {
  var validator = new passwordValidator();
  validator.is().min(6).has().uppercase().has().lowercase().has().digits(1);

  if (validator.validate(pass)) return true;
  else return false;
};

export const checkTextField = (text: string) => {
  if (text.trim() !== "") return true;
  else return false;
};
