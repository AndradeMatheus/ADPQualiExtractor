// consts.js

const Notify = new XNotify();

const customContent = {
    whiteCopyOutline: {
        img:`<img src="https://raw.githubusercontent.com/AndradeMatheus/ADPQualiExtractor/master/assets/copy_icon.png" class= "timesheet-copy" style="filter: invert(1)"/>`,
        icons: {
            default: `https://raw.githubusercontent.com/AndradeMatheus/ADPQualiExtractor/master/assets/copy_icon.png`,
            loading: `https://raw.githubusercontent.com/AndradeMatheus/ADPQualiExtractor/master/assets/loading_icon.gif`
        },
        class:`timesheet-copy`
    },
    whiteDownloadSheetOutline: {
        img:`<img src="https://raw.githubusercontent.com/AndradeMatheus/ADPQualiExtractor/master/assets/download_icon.png" class= "timesheet-copy" style="filter: invert(1)"/>`,
        icons: {
            default: `https://raw.githubusercontent.com/AndradeMatheus/ADPQualiExtractor/master/assets/download_icon.png`,
            loading: `https://raw.githubusercontent.com/AndradeMatheus/ADPQualiExtractor/master/assets/loading_icon.gif`
        },
        class:`timesheet-download`
    }
}

const tableDelimiterTypes = {
    csv: ',',
    clipboard: '	'
}

const timelineTypes = {
    extraHours: 0,
    undefinedEnd: 1,
    incorrectAppointedStart: 2,
    incorrectAppointedEnd: 3,
    correctShouldBeEnd: 7,
    correctAppointedStart: 10,
    correctAppointedEnd: 21,
}

const excludeURL = `https://expert.brasil.adp.com/expert/v4/?lp=true`
const defaultButtonClass = `display-block w-100 text-left text-center-md relative border-none m0 p2 py2 p1-md py3-md text-white decoration-none bg-transparent bg-blue-3-hover pointer`