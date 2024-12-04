const fs = require("fs");
const path = require("path");
const xmlbuilder = require("xmlbuilder");
const { parse } = require("../../utils/quiz-parser");

const stamp = "moodle.stamp+241010084236+sD8fiO";

// TODO: should not be used in the final product?
const generateRandomNumber = () => parseInt(Math.random() * 1000000000);

// generating random number for now
const ownerid = generateRandomNumber();

const createPointFractions = (points) => {
  return points.toFixed(5);
};

const createAnswer = (answersEle) => (answer, i, allAnswers) => {
  const answerId = generateRandomNumber();
  const answerEle = answersEle.ele("answer", { id: answer.id || answerId });
  answerEle.ele("answertext", answer.answer.trim());
  answerEle.ele("answerformat", 0);

  const totalAnswers = allAnswers.length;
  const correctAnswers = allAnswers.filter((a) => a.correct).length;

  const pointsFromCorrect = createPointFractions(correctAnswers);
  const pointsFromIncorrect = createPointFractions(
    100 / (totalAnswers - correctAnswers) / 100
  );

  // 1 for correct, negative fraction for incorrect
  answerEle.ele(
    "fraction",
    answer.correct ? pointsFromCorrect : `-${pointsFromIncorrect}`
  );
  answerEle.ele("feedback", "");
  answerEle.ele("feedbackformat", 0);
};

const createQuestionBankEntryForMultiChoice =
  (questionBankEntries, category) => (question) => {
    const id = generateRandomNumber();

    const questioncategoryid = category.id;

    const questionBankEntry = questionBankEntries.ele("question_bank_entry", {
      id,
    });

    questionBankEntry.ele("questioncategoryid", questioncategoryid);
    questionBankEntry.ele("idnumber", "$@NULL@$");
    questionBankEntry.ele("ownerid", ownerid);

    const questionVersionId = generateRandomNumber();

    const questionVersion = questionBankEntry.ele("question_version");
    const questionVersions = questionVersion.ele("question_versions", {
      id: questionVersionId,
    });
    questionVersions.ele("version", 1);
    questionVersions.ele("status", "ready");

    const questionId = generateRandomNumber();

    const questionsEle = questionVersions.ele("questions");
    const questionEle = questionsEle.ele("question", {
      id: questionId,
    });
    questionEle.ele("parent", 0);
    questionEle.ele("name", question.title.trim());
    questionEle.ele("questiontext", question.question.trim());
    questionEle.ele("questiontextformat", 1);
    questionEle.ele("generalfeedback", "");
    questionEle.ele("generalfeedbackformat", 1);
    questionEle.ele("defaultmark", "1.0000000");
    questionEle.ele("penalty", "0.3333333");
    questionEle.ele("qtype", "multichoice");
    questionEle.ele("length", 1);
    questionEle.ele("stamp", stamp);
    questionEle.ele("timecreated", +new Date());
    questionEle.ele("timemodified", +new Date());
    questionEle.ele("createdby", ownerid);
    questionEle.ele("modifiedby", ownerid);

    const pluginQtype = questionEle.ele("plugin_qtype_multichoice_question");
    const answersEle = pluginQtype.ele("answers");

    question.answers.forEach(createAnswer(answersEle));

    const multichoiceId = generateRandomNumber();

    const multichoiceEle = pluginQtype.ele("multichoice", {
      id: multichoiceId,
    });
    multichoiceEle.ele("layout", 0);
    multichoiceEle.ele("single", 1);
    multichoiceEle.ele("shuffleanswers", 1);
    multichoiceEle.ele("correctfeedback", "Vastauksesi on oikein.");
    multichoiceEle.ele("correctfeedbackformat", 1);
    multichoiceEle.ele(
      "partiallycorrectfeedback",
      "Vastauksesi on osittain oikein."
    );
    multichoiceEle.ele("partiallycorrectfeedbackformat", 1);
    multichoiceEle.ele("incorrectfeedback", "Vastauksesi on väärin.");
    multichoiceEle.ele("incorrectfeedbackformat", 1);
    multichoiceEle.ele("answernumbering", "none");
    multichoiceEle.ele("shownumcorrect", 1);
    multichoiceEle.ele("showstandardinstruction", 0);

    questionEle.ele("plugin_qbank_comment_question").ele("comments");
    questionEle.ele("plugin_qbank_customfields_question").ele("customfields");
    questionEle.ele("question_hints");
    questionEle.ele("tags");
  };

const generateQuestionCategory = (questionsXml, category) => {
  const questionCategory = questionsXml.ele("question_category");
  questionCategory.att("id", category.id);
  questionCategory.ele("name", category.name.trim());
  questionCategory.ele("contextid", category.contextid);
  questionCategory.ele("contextlevel", category.contextlevel);
  questionCategory.ele("contextinstanceid", category.contextinstanceid);
  questionCategory.ele("info", category.info || "");
  questionCategory.ele("infoformat", category.infoformat || 0);
  questionCategory.ele("stamp", category.stamp);
  questionCategory.ele("parent", category.parent || 0);
  questionCategory.ele("sortorder", category.sortorder || 0);
  questionCategory.ele("idnumber", category.idnumber || "$@NULL@$");
  const questionBankEntries = questionCategory.ele("question_bank_entries");

  return questionBankEntries;
};

function buildQuestionsXml(filePath, outputDir) {
  const file = fs.readFileSync(filePath, "utf8");
  const questions = parse(file);

  const questionsXml = xmlbuilder.create("question_categories", {
    encoding: "UTF-8",
  });

  // TODO: Mock data
  const topLevelCategory = {
    id: "160594",
    name: "top",
    contextid: "1233447",
    contextlevel: "50",
    contextinstanceid: "5412",
    info: "",
    infoformat: "0",
    stamp,
    parent: "0",
    sortorder: "0",
  };

  // first create "empty" top level category
  generateQuestionCategory(questionsXml, topLevelCategory);

  // TODO: Mock data
  // id and contextid are +1 from topLevelCategory
  // parent is topLevelCategory.id
  const category = {
    id: "160595",
    name: "top",
    contextid: "1233448",
    contextlevel: "50",
    contextinstanceid: "5412",
    info: "Questions for the top category",
    infoformat: "0",
    stamp,
    parent: topLevelCategory.id,
    sortorder: "999",
  };

  const questionBankEntries = generateQuestionCategory(questionsXml, category);
  questions.forEach(
    createQuestionBankEntryForMultiChoice(questionBankEntries, category)
  );

  fs.writeFileSync(
    path.join(outputDir, "questions.xml"),
    questionsXml.end({ pretty: true })
  );
}

module.exports = { buildQuestionsXml };
