const fs = require("fs");
const { write } = require("./utils");

const generateTodoMarkdown = () => {
  if (!fs.existsSync("../../output/todo.json")) {
    return "";
  }

  // TODO: file path might need to be updated in the future
  const todo = fs.readFileSync("../../output/todo.json", "utf8");

  let markdown = "";
  for (const [title, warnings] of Object.entries(todo)) {
    markdown += `- [ ] Title: ${title}\n`;
    for (const [type, messages] of Object.entries(warnings)) {
      messages.forEach((message) => {
        markdown += `  - [ ] ${message}\n`;
      });
    }
  }

  return markdown;
};

const generateTodoMarkdownFile = () => {
  const markdown = generateTodoMarkdown();
  write("output", "output/todo.md", markdown);
};

module.exports = {
  generateTodoMarkdownFile,
};
