const fs = require("fs");
const xmlbuilder = require("xmlbuilder");
const { parse } = require("./utils/quiz-parser");
const { writeFileCallback } = require("./utils/utils");

const createQuestion = (root) => (question) => {
  const questionEle = root.ele("question", { type: "truefalse" });
  questionEle.ele("name").ele("text", question.title);
  questionEle.ele("questiontext", { format: "html" }).ele("text", `<![CDATA[${question.question}]]>`);
  questionEle.ele("generalfeedback").ele("text", question.generalfeedback || "");
  questionEle.ele("defaultgrade", question.defaultgrade || 1);
  questionEle.ele("penalty", question.penalty || 0);
  questionEle.ele("hidden", question.hidden || 0);

  // True answer
  const trueAnswer = question.answers.find(answer => answer.answer.toLowerCase() === "true");
  const trueAnswerEle = questionEle.ele("answer", { fraction: trueAnswer ? 100 : 0 });
  trueAnswerEle.ele("text", "true");
  trueAnswerEle.ele("feedback").ele("text", trueAnswer ? trueAnswer.feedback : "");

  // False answer
  const falseAnswer = question.answers.find(answer => answer.answer.toLowerCase() === "false");
  const falseAnswerEle = questionEle.ele("answer", { fraction: falseAnswer ? 100 : 0 });
  falseAnswerEle.ele("text", "false");
  falseAnswerEle.ele("feedback").ele("text", falseAnswer ? falseAnswer.feedback : "");
};

const createQuestions = (questions) => {
  const root = xmlbuilder.create("quiz", { encoding: "UTF-8" });

  questions.forEach(createQuestion(root));

  return root.end({ pretty: true });
};

const writeFile = (filename, content) =>
  fs.writeFile(filename, content, writeFileCallback);

const readFileCallback = (outputPath) => (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  writeFile(outputPath, createQuestions(parse(data)));
};

const main = (path, outputPath) =>
  fs.readFile(path, "utf8", readFileCallback(outputPath));

const inputPath = process.argv[2];
const outputPath = "output/xml/quiz3.xml";

main(inputPath, outputPath);
