// button-actions.js

async function copyTimesheetToClipboard(customContent) {
    setButtonImageByClass(customContent, 'loading');
    const date = getDate();
    const content = await getContent(date);
    const table = formatTimesheet(content, tableDelimiterTypes.clipboard);
    copyToClipBoard(table);
    setButtonImageByClass(customContent, 'default');
}

async function downloadTimesheet(customContent){
    setButtonImageByClass(customContent, 'loading');
    const date = getDate();
    const content = await getContent(date);
    const table = formatTimesheet(content, tableDelimiterTypes.csv);
    downloadCSV(table, date);
    setButtonImageByClass(customContent, 'default');
}

async function updateScript(){
    window.open('http://github.com/AndradeMatheus/ADPQualiExtractor/raw/master/src/ADPQualiExtractor.user.js');
}

function redirectGithub(){
    window.open('https://github.com/AndradeMatheus/ADPQualiExtractor')
}

function redirectGithubIssues(){
    window.open('https://github.com/AndradeMatheus/ADPQualiExtractor/issues')
}