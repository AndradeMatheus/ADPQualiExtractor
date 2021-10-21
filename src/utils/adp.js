// adp.js

function getDate() {
    const currentMonth = new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const currentUrl = (window.location.href).split('timesheet/')[1];
    const dateString = currentUrl != null ? currentUrl.split('-') : `${currentYear}-${currentMonth}`.split('-');
    return { year:  dateString[0], month: dateString[1] }
}

async function getContent(date) {
    const url = `https://expert.brasil.adp.com/expert/api/timesheet/time-card/reference/${date.year}/${date.month}`
    return await axios({
        url,
        headers: {
            'newexpert_sessionid': document.querySelector('#newexpert_sessionid').value || ``,
            'serviceplace-context-contextid': document.querySelector('#newexpert_contextid').value || ``
        }
    });
}