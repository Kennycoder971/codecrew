import crypto from "crypto";

const generatePasswordToken = function () {
  // Generate random string
  const resetToken = crypto.randomBytes(20).toString("hex");
  const passwordTokenExpire = Date.now() + 10 * 60 * 60; // 10 minutes

  return { resetToken, passwordTokenExpire };
};

export default generatePasswordToken;
