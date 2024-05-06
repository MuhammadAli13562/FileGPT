const uuidToNumber = (uuid: string) => {
  const uuidWithoutHyphens = uuid.replace(/-/g, "");
  const bigIntValue = BigInt(`0x${uuidWithoutHyphens}`);
  return Number(bigIntValue);
};

export default uuidToNumber;
