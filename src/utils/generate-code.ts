import { OTPService } from "../services/otp.service";

export async function generateRandomNumber(): Promise<number> {
  const codes: number[] = await OTPService.getCodes();
  let randomNumber: number = Math.floor(Math.random() * 900000) + 100000;

  const found = codes.find((num) => num === randomNumber);
  if (!found) return randomNumber;

  return await generateRandomNumber();
}