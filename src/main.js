// main.js

'use strict';
window.addEventListener('load', () => {
    setTimeout( function(){
        addButton('Timesheet copy', customContent.whiteCopyOutline, copyTimesheetToClipboard);
        addButton('Timesheet CSV', customContent.whiteDownloadSheetOutline, downloadTimesheet);
    }, 2500)
})