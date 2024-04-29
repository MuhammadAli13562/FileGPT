const uuidToNumber = (uuid: string) => {
  // Remove hyphens from the UUID string
  const uuidWithoutHyphens = uuid.replace(/-/g, "");
  // Convert the hexadecimal string to a BigInt
  const bigIntValue = BigInt(`0x${uuidWithoutHyphens}`);
  // Convert the BigInt to a regular number
  return Number(bigIntValue);
};

export default uuidToNumber;
