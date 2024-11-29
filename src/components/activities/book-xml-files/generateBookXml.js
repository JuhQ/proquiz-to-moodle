const fs = require("fs");
const path = require("path");
const xmlbuilder = require('xmlbuilder');

function generateBookXml(outputDir) {

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const bookXml = xmlbuilder.create('activity', { encoding: 'UTF-8' })
        .att('id', '565')
        .att('moduleid', '477439')
        .att('modulename', 'book')
        .att('contextid', '1298932')
        .ele('book', { id: '565' })
            .ele('name', 'Lessons book chapters').up()
            .ele('intro', '').up()
            .ele('introformat', '1').up()
            .ele('numbering', '1').up()
            .ele('navstyle', '1').up()
            .ele('customtitles', '0').up()
            .ele('timecreated', '1732695651').up()
            .ele('timemodified', '1732695651').up()
            .ele('chapters')
                .ele('chapter', { id: '3879' })
                    .ele('pagenum', '1').up()
                    .ele('subchapter', '0').up()
                    .ele('title', 'Hiilineutraaliustavoitteet ja vähähiilinen rakennusteollisuus 2035').up()
                    .ele('content', '&lt;p dir="ltr" style="text-align: left;"&gt;Test content&amp;nbsp;&lt;br&gt;&lt;/p&gt;').up()
                    .ele('contentformat', '1').up()
                    .ele('hidden', '0').up()
                    .ele('timemodified', '1732695701').up()
                    .ele('importsrc', '').up()
                .up()
                .ele('chapter', { id: '3880' })
                    .ele('pagenum', '2').up()
                    .ele('subchapter', '0').up()
                    .ele('title', 'Jätelainsäädäntö').up()
                    .ele('content', '&lt;p dir="ltr" style="text-align: left;"&gt;test content&amp;nbsp;Jätelainsäädäntö&lt;/p&gt;').up()
                    .ele('contentformat', '1').up()
                    .ele('hidden', '0').up()
                    .ele('timemodified', '1732695741').up()
                    .ele('importsrc', '').up()
                .up()
                .ele('chapter', { id: '3881' })
                    .ele('pagenum', '3').up()
                    .ele('subchapter', '0').up()
                    .ele('title', 'Rakentamisen toimitusketjun erilliskeräysvelvoitteet ja kierrätystavoitteet').up()
                    .ele('content', '&lt;p dir="ltr" style="text-align: left;"&gt;Test content Rakentamisen toimitusketjun erilliskeräysvelvoitteet ja kierrätystavoitteet&lt;br&gt;&lt;/p&gt;').up()
                    .ele('contentformat', '1').up()
                    .ele('hidden', '0').up()
                    .ele('timemodified', '1732695794').up()
                    .ele('importsrc', '').up()
                .up()
            .up()
            .ele('chaptertags', '').up()
        .up()
    .end({ pretty: true });
    fs.writeFileSync(path.join(outputDir, 'book.xml'), bookXml);

    return bookXml;
}

module.exports = generateBookXml;
