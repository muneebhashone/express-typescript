import bcrypt from "bcrypt";

export const comparePassword = async function (
  candidatePassword,
  hashedPassword
) {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};
