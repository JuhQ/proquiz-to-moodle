const fs = require('fs');
const path = require('path');
const xmlbuilder = require('xmlbuilder');

// Generates course.xml inside 'course'
// course\course.xml
function generateCourseXml(courseDir) {
const courseXml = xmlbuilder.create('course', { encoding: 'UTF-8' })
    .att('id', '').att('contextid', '')
    .ele('shortname', '').up()
    .ele('fullname', '').up()
    .ele('idnumber', '').up()
    .ele('summary', '').up()
    .ele('summaryformat', '').up()
    .ele('format', '').up()
    .ele('showgrades', '').up()
    .ele('newsitems', '').up()
    .ele('startdate', '').up()
    .ele('enddate', '').up()
    .ele('marker', '').up()
    .ele('maxbytes', '').up()
    .ele('legacyfiles', '').up()
    .ele('showreports', '').up()
    .ele('visible', '').up()
    .ele('groupmode', '').up()
    .ele('groupmodeforce', '').up()
    .ele('defaultgroupingid', '').up()
    .ele('lang', '').up()
    .ele('theme', '').up()
    .ele('timecreated', '').up()
    .ele('timemodified', '').up()
    .ele('requested', '').up()
    .ele('enablecompletion', '').up()
    .ele('completionnotify', '').up()
    .ele('numsections', '').up()
    .ele('hiddensections', '').up()
    .ele('coursedisplay', '').up()
    .ele('imagecontaineralignment', '').up()
    .ele('imagecontainerwidth', '').up()
    .ele('imagecontainerratio', '').up()
    .ele('imagesizemethod', '').up()
    .ele('bordercolour', '').up()
    .ele('borderwidth', '').up()
    .ele('borderradius', '').up()
    .ele('imagecontainerbackgroundcolour', '').up()
    .ele('currentselectedsectioncolour', '').up()
    .ele('currentselectedimagecontainertextcolour', '').up()
    .ele('currentselectedimagecontainercolour', '').up()
    .ele('hidesectiontitle', '').up()
    .ele('sectiontitlegridlengthmaxoption', '').up()
    .ele('sectiontitleboxposition', '').up()
    .ele('sectiontitleboxinsideposition', '').up()
    .ele('sectiontitleboxheight', '').up()
    .ele('sectiontitleboxopacity', '').up()
    .ele('sectiontitlefontsize', '').up()
    .ele('sectiontitlealignment', '').up()
    .ele('sectiontitleinsidetitletextcolour', '').up()
    .ele('sectiontitleinsidetitlebackgroundcolour', '').up()
    .ele('showsectiontitlesummary', '').up()
    .ele('setshowsectiontitlesummaryposition', '').up()
    .ele('sectiontitlesummarymaxlength', '').up()
    .ele('sectiontitlesummarytextcolour', '').up()
    .ele('sectiontitlesummarybackgroundcolour', '').up()
    .ele('sectiontitlesummarybackgroundopacity', '').up()
    .ele('newactivity', '').up()
    .ele('singlepagesummaryimage', '').up()
    .ele('fitsectioncontainertowindow', '').up()
    .ele('greyouthidden', '').up()
    .ele('setsection0ownpagenogridonesection', '').up()
    .ele('plugin_format_grid_course')
        .ele('showsummary', '').up()
    .up()
    .ele('category', { id: '' })
        .ele('name', '').up()
        .ele('desciption', '').up()
    .up()
    .ele('tags', '').up()
    .ele('customfields', '').up()
    .ele('courseformatoptions')
        .ele('customformatoption')
            .ele('format', '').up()
            .ele('sectionid', '').up()
            .ele('name', '').up()
            .ele('value', '').up()
    .end({ pretty: true });
    fs.writeFileSync(path.join(courseDir, 'course.xml'), courseXml);

    return courseXml;
}

module.exports = { generateCourseXml };