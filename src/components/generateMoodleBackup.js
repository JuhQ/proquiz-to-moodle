const fs = require('fs');
const path = require('path');
const xmlbuilder = require('xmlbuilder');
const crypto = require("crypto");

function generateBackupId() {
    const hash = crypto.createHash('md5');
    return hash.update(Date.now().toString()).digest('hex');
}

const backup_id = generateBackupId();
const timestamp = Math.floor(Date.now() / 1000);
const oneYearInSeconds = 365 * 24 * 60 * 60;
const oneYearFromNow = timestamp + oneYearInSeconds;

// Generates moodle_backup.xml file inside 'output' directory
// output\moodle_backup.xml
function generateMoodleBackup(outputDir) {
    const backupXml = xmlbuilder.create('moodle_backup', { encoding: 'UTF-8' })
        .ele('information')
            .ele('name', '.mbz').up()
            .ele('moodle_version', '2022112814.03').up()
            .ele('moodle_release', '4.1.14+ (Build: 20241101)').up()
            .ele('backup_version', '2022112800').up()
            .ele('backup_release', '4.1').up()
            .ele('backup_date', timestamp).up()
            .ele('mnet_remoteusers', '0').up()
            .ele('include_files', '0').up()
            .ele('include_file_references_to_external_content', '0').up()
            .ele('original_wwwroot', 'https://moodle.metropolia.fi').up()
            .ele('original_site_identifier_hash', 'ddc026eaa3a68b0dc3bf0f757a1ba639').up()
            .ele('original_course_id', '').up()
            .ele('original_course_format', 'topics').up()
            .ele('original_course_fullname', '').up()
            .ele('original_course_shortname', '').up()
            .ele('original_course_startdate', timestamp).up()
            .ele('original_course_enddate', oneYearFromNow).up()
            .ele('original_course_contextid', '').up()
            .ele('original_system_contextid', '1').up()
            .ele('details')
                .ele('detail')
                .att('backup_id', backup_id)
                    .ele('type', 'course').up()
                    .ele('format', 'moodle2').up()
                    .ele('interactive', '1').up()
                    .ele('mode', '10').up()
                    .ele('execution', '1').up()
                    .ele('executiontime', '0').up()
                .up()
            .up()
            .ele('contents')
            .up()
            .ele('settings')
                .ele('setting')
                    .ele('level', 'root').up()
                    .ele('name', 'filename').up()
                    .ele('value', '.mbz').up()
                .up()
                .ele('setting')
                    .ele('level', 'root').up()
                    .ele('name', 'imscc11').up()
                    .ele('value', '0').up()
                .up()
                .ele('setting')
                    .ele('level', 'root').up()
                    .ele('name', 'users').up()
                    .ele('value', '0').up()
                .up()
                .ele('setting')
                    .ele('level', 'root').up()
                    .ele('name', 'anonymize').up()
                    .ele('value', '0').up()
                .up()
                .ele('setting')
                    .ele('level', 'root').up()
                    .ele('name', 'role_assignments').up()
                    .ele('value', '0').up()
                .up()
                .ele('setting')
                    .ele('level', 'root').up()
                    .ele('name', 'activities').up()
                    .ele('value', '1').up()
                .up()
                .ele('setting')
                    .ele('level', 'root').up()
                    .ele('name', 'blocks').up()
                    .ele('value', '0').up()
                .up()
                .ele('setting')
                    .ele('level', 'root').up()
                    .ele('name', 'files').up()
                    .ele('value', '0').up()
                .up()
                .ele('setting')
                    .ele('level', 'root').up()
                    .ele('name', 'filters').up()
                    .ele('value', '0').up()
                .up()
                .ele('setting')
                    .ele('level', 'root').up()
                    .ele('name', 'comments').up()
                    .ele('value', '0').up()
                .up()
                .ele('setting')
                    .ele('level', 'root').up()
                    .ele('name', 'badges').up()
                    .ele('value', '0').up()
                .up()
                .ele('setting')
                    .ele('level', 'root').up()
                    .ele('name', 'calendarevents').up()
                    .ele('value', '0').up()
                .up()
                .ele('setting')
                    .ele('level', 'root').up()
                    .ele('name', 'userscompletion').up()
                    .ele('value', '0').up()
                .up()
                .ele('setting')
                    .ele('level', 'root').up()
                    .ele('name', 'logs').up()
                    .ele('value', '0').up()
                .up()
                .ele('setting')
                    .ele('level', 'root').up()
                    .ele('name', 'grade_histories').up()
                    .ele('value', '0').up()
                .up()
                .ele('setting')
                    .ele('level', 'root').up()
                    .ele('name', 'questionbank').up()
                    .ele('value', '0').up()
                .up()
                .ele('setting')
                    .ele('level', 'root').up()
                    .ele('name', 'groups').up()
                    .ele('value', '0').up()
                .up()
                .ele('setting')
                    .ele('level', 'root').up()
                    .ele('name', 'competencies').up()
                    .ele('value', '0').up()
                .up()
                .ele('setting')
                    .ele('level', 'root').up()
                    .ele('name', 'customfield').up()
                    .ele('value', '0').up()
                .up()
                .ele('setting')
                    .ele('level', 'root').up()
                    .ele('name', 'contentbankcontent').up()
                    .ele('value', '0').up()
                .up()
                .ele('setting')
                    .ele('level', 'root').up()
                    .ele('name', 'legacyfiles').up()
                    .ele('value', '0').up()
                .up()
            .up()
        .up()
        .end({ pretty: true });

    fs.writeFileSync(path.join(outputDir, 'moodle_backup.xml'), backupXml);

    return backupXml;
}

module.exports = generateMoodleBackup;