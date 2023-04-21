export const generateRandomNumber = (digits = 8) => {
  const num = 10 ** digits;

  return Math.floor(Math.random() * num);
};

export default { generateRandomNumber };
