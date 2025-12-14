import crypto from "crypto"

const OTP_SECRET = process.env.OTP_SECRET

export const generateOTP = () => {
  return crypto.randomInt(100000, 1000000).toString()
}

export const hashOtp = (otp: string) => {
  
  if (!OTP_SECRET) {
    console.log("Server Error!!")
    throw new Error('Server Eror: The OTP_SECRET is not defined');
  }
  
  return crypto
    .createHmac('sha256', OTP_SECRET)
    .update(otp)
    .digest('hex')
}
