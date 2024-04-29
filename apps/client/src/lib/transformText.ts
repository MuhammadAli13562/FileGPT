function transformText(inputText: string): string {
  // Remove empty quotes
  let cleanedText = inputText.replace(/""/g, "");

  // Replace "\n" with newline character
  cleanedText = cleanedText.replace(/\\"/g, "");
  cleanedText = cleanedText.replace(/\\n/g, "\n");

  return cleanedText;
}
export default transformText;
