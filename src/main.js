// main.js

'use strict';
window.addEventListener('load', () => {
    setTimeout( function(){
        checkVersionUpdate();
        addDiv('ADP', 'prepend', 'white');
        addDiv('Timesheet', 'append', '#EBEBEB');
        addButton('Copy', customContent.whiteCopyOutline, copyTimesheetToClipboard);
        addButton('CSV', customContent.whiteDownloadSheetOutline, downloadTimesheet);
        addDiv('Script', 'append', '#EBEBEB');
        addButton('Force update', customContent.whiteUpdateOutline, updateScript);
        addButton('Help', customContent.whiteHelpOutLine, redirectGithubIssues);
        addButton('GitHub', customContent.whiteGithubFill, redirectGithub);
    }, 2500)
})