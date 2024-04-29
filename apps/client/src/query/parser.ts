function handleFormatting(text: string) {
  // Replace consecutive quotation marks with a single quotation mark
  text = text.replace(/"(\s*")+/g, '"');

  // Replace consecutive asterisks with a single asterisk
  text = text.replace(/\*(\s*\*)+/g, "*");

  // Replace the remaining quotation marks with appropriate HTML tags or formatting styles
  text = text.replace(/"/g, '<span style="font-style: italic;">');

  // Replace the remaining asterisks with appropriate HTML tags or formatting styles
  text = text.replace(/\*/g, '<span style="font-weight: bold;">');

  // Replace new line characters with HTML line breaks
  text = text.replace(/\n/g, "<br>");

  return text;
}

// Example usage
const formattedText = handleFormatting(
  "I'm sorry if my previous responses were not helpful or if there was a misunderstanding. I'm here to assist you with any questions or information you may need. If you have a specific question or topic you'd like to know more about, please let me know and I'll do my best to provide a helpful and accurate response. If you're not sure what you'd like to ask, here are a few examples of questions you could ask:\n\n* Can you explain how machine learning algorithms work?\n* What are some popular programming languages for web development?\n* How does encryption work to keep data secure?\n* What are some common design principles for user interfaces?\n* Can you explain the basics of quantum computing?\n\nI hope this helps! Let me know if you have any questions or if there's anything else I can help you with."
);

console.log(formattedText);
