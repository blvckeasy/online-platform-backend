export async function generateRandomNumber(): Promise<number> {
  const randomNumber: number = Math.floor(Math.random() * 900000) + 100000;
  return randomNumber;
}