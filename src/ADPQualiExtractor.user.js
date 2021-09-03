// ==UserScript==
// @name         ADP QUALICORP TIMESHET CLIPBOARD
// @namespace    https://github.com/AndradeMatheus/ADPQualiExtractor/
// @version      0.1
// @description  Copy month's appointments to clipboard
// @author       Matheus Andrade (Tetis) [github.com/AndradeMatheus]
// @copyright    2021+, Matheus Andrade (https://github.com/AndradeMatheus)
// @homepageURL  https://github.com/AndradeMatheus/ADPQualiExtractor/
// @match        https://expert.brasil.adp.com/
// @include      https://expert.brasil.adp.com/*
// @require      https://github.com/AndradeMatheus/ADPQualiExtractor/master/src/axios.min.js
// @require      https://github.com/AndradeMatheus/ADPQualiExtractor/master/src/axiosGmxhrAdapter.min.js
// @icon         https://www.google.com/s2/favicons?domain=adp.com
// @grant        none
// ==/UserScript==

// https://stackoverflow.com/questions/18989345/how-do-i-reload-a-greasemonkey-script-when-ajax-changes-the-url-without-reloadin
// https://stackoverflow.com/questions/629671/how-can-i-intercept-xmlhttprequests-from-a-greasemonkey-script
// https://stackoverflow.com/questions/33855641/copy-output-of-a-javascript-variable-to-the-clipboard

(async function(axios) {
    'use strict';

    const timelineTypes = {
        undefinedFinish: 1,
        incorrectAppointedStart: 2,
        incorrectAppointedFinish: 3,
        correctShouldBeFinish: 7,
        correctAppointedStart: 10,
        correctAppointedFinish: 21,
    }

    window.addEventListener('load', () => {
        addButton('CCPY', copyTable);
    })

    function addButton(text, onclick, cssObj) {
        cssObj = cssObj || {position: 'absolute', top: '7%', right:'4%', 'z-index': 3}
        let button = document.createElement('button'), btnStyle = button.style
        document.body.appendChild(button)
        button.innerHTML = text
        button.onclick = onclick
        Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key])
        return button
    }

    async function copyTable() {
        const date = getDate();
        const content = await getContent(date);
        const table = formatTimeTable(content);
        copyToClipBoard(table);
    }

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

    function formatTimeTable(content) {
        const timeTable = content.data.timetable;
        let offDays = [];
        let workDays = [];

        timeTable.forEach( e => {
            e.hasOwnProperty("timeline") ? workDays.push(newFormat(e)) : offDays.push(newFormat(e));
        })

        console.log('workDays', workDays.sort((x, y) => new Date(x.oldDate).getTime() - new Date(y.oldDate).getTime()));

        return formatTable(workDays);
    }

    function copyToClipBoard(content) {
        const el = document.createElement('textarea');
        el.value = content;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        try {
            const successful = document.execCommand('copy');
            successful ? alert('Tabela copiada com sucesso') : alert('Houve um erro ao copiar a tabela');
        } catch (err) {
            alert('Unable to copy' + err);
        }finally{
            document.body.removeChild(el);
        }
    }

    function formatTable(timeTable){
        const header = [{key:"date", title:"Data"}, {key:"timelineStart", title: "Início"}, {key:"timelineEnd", title:"Fim"}];
        let content = (header.map(m => m.title).join('	')) + '\r\n';

        timeTable.forEach( e => {
            e.timelineFormatted = [];
            for (let i = 0; i < e.timeline.length; i = i+2) {
                let start = '', finish = '';
                start = `${new Date(e.timeline[i].dateTime).getHours()}:${new Date(e.timeline[i].dateTime).getMinutes()}`;
                e.timeline[i+1] ?
                    finish = `${new Date(e.timeline[i+1].dateTime).getHours()}:${new Date(e.timeline[i+1].dateTime).getMinutes()}`
                    : finish = 'ABERTO';
                content += (`${JSON.stringify(e.date)}	${start}	${finish}\r\n`);
            }
        })

        return content;
    }

    function newFormat(element) {
        const dateTemplate = element.date.split("T")[0];
        const day = dateTemplate.split('-')[2];
        const month = dateTemplate.split('-')[1];
        const year = dateTemplate.split('-')[0];
        const dateFormatted = `${day}/${month}/${year}`;
        const timelineFormatted = element.timeline;
        let changed = false;

        if(timelineFormatted){
            timelineFormatted.forEach( () => {
                timelineFormatted.forEach( (x, i) => {
                    if(x.itemType === timelineTypes.correctShouldBeFinish || x.itemType === timelineTypes.undefinedFinish) { timelineFormatted.splice(i, 1); changed = true;}
                })
            })
        }

        return {
            date: dateFormatted,
            oldDate: element.date,
            timeline: timelineFormatted,
            changed
        }
    }
})(axios);