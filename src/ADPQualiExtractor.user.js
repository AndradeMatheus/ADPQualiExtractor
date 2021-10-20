// ==UserScript==
// @name         ADP QUALICORP TIMESHET CLIPBOARD
// @namespace    https://github.com/AndradeMatheus/ADPQualiExtractor/
// @version      1.2
// @description  Copy month's appointments to clipboard
// @author       Matheus Andrade (Tetis) [github.com/AndradeMatheus]
// @copyright    2021+, Matheus Andrade (https://github.com/AndradeMatheus)
// @homepageURL  https://github.com/AndradeMatheus/ADPQualiExtractor/
// @updateURL    https://github.com/AndradeMatheus/ADPQualiExtractor/raw/master/src/ADPQualiExtractor.user.js
// @match        https://expert.brasil.adp.com/expert/v4/
// @include      https://expert.brasil.adp.com/expert/v4/*
// @require      https://raw.githubusercontent.com/AndradeMatheus/ADPQualiExtractor/master/src/axios.min.js
// @require      https://raw.githubusercontent.com/AndradeMatheus/ADPQualiExtractor/master/src/axiosGmxhrAdapter.min.js
// @icon         https://www.google.com/s2/favicons?domain=adp.com
// @grant        none
// ==/UserScript==

(async function(axios) {
    'use strict';

    window.addEventListener('load', () => {
        setTimeout( function(){
            addButton('Timesheet copy', customContent.whiteCopyOutline, copyTimesheetToClipboard);
            addButton('Timesheet CSV', customContent.whiteDownloadSheetOutline, downloadTimesheet);
        }, 2000)
    })

    function addButton(label, custom, func) {
        const buttonHTML = getButtonHTML(label, custom);
        const buttonDOM = document.createElement('a');
        buttonDOM.innerHTML = buttonHTML;
        buttonDOM.addEventListener('click', function(){
            func(custom);
        });

        const sidebar = document.getElementsByClassName('display-block-md display-none bg-blue-4 text-center')[0];
        if(sidebar) sidebar.appendChild(buttonDOM);
        else if(window.location.href != excludeURL) alert(`Ocorreu um erro ao carregar o botão ${label} :( \n Por favor, recarregue a página.`);

        return buttonDOM
    }

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

    function setButtonImageByClass(customContent, type) { document.getElementsByClassName(customContent.class)[0].children[0].src = customContent.icons[type] }

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

    function formatTimesheet(content, delimiter) {
        const timesheet = content.data.timetable;

        const workdays = getWorkdays(timesheet);
        return getFormattedTimesheet(workdays, delimiter);
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
            successful ? alert('Tabela copiada com sucesso. Obrigado por usar minha ferramenta! :) \n-- Matheus Andrade') : alert('Houve um erro ao copiar a tabela :(');
        } catch (err) {
            alert('Unable to copy' + err);
        }finally{
            document.body.removeChild(el);
        }
    }

    function getWorkdays(timesheet) {
        let offdays = [];
        let workdays = [];

        timesheet.forEach( e => {
            e.hasOwnProperty("timeline") ? workdays.push(getFormattedContent(e)) : offdays.push(getFormattedContent(e));
        })

        workdays.sort((x, y) => new Date(x.oldDate).getTime() - new Date(y.oldDate).getTime());

        return workdays;
    }

    function downloadCSV(table, date){
        const csvHeader = "data:text/csv;charset=utf-8";
        const csvContent = csvHeader.concat(',', table);
        const encodedURI = encodeURI(csvContent);

        const username = document.getElementsByClassName("display-flex align-self-center mx2 text-transform-uppercase fw-bold font-std-5")[0].innerText;

        const link = document.createElement("a");
        link.setAttribute("href", encodedURI);
        link.setAttribute("download", `${username.split(' ').join('_')}_TIMESHEET_${date.year}-${date.month}.csv`);
        document.body.appendChild(link);

        link.click()
    }


    function getFormattedTimesheet(timeTable, delimiter){
        const headers = [
            {key:"date", title:"Data"},
            {key:"timelineStart", title: "Inicio"},
            {key:"timelineEnd", title:"Fim"},
            {key:"appointmentType", title:"Tipo"}
        ];
        let table = (headers.map(m => m.title).join(delimiter)) + '\r\n';

        timeTable.forEach( e => {
            const allowedBankSeconds = 6300
            let bankSeconds = 0, extraSeconds = 0;
            let previousCheckedDate;

            for (let i = 0; i < e.timeline.length; i = i+2) {
                if(e.date !== previousCheckedDate) { bankSeconds = 0; extraSeconds = 0; }

                let start = '', finish = '', appointmentType = 'NORMAL';

                start = `${new Date(e.timeline[i].dateTime).getHours()}:${new Date(e.timeline[i].dateTime).getMinutes()}`;

                e.timeline[i+1] ?
                    finish = `${new Date(e.timeline[i+1].dateTime).getHours()}:${new Date(e.timeline[i+1].dateTime).getMinutes()}`
                    : finish = 'ABERTO';

                if(start === finish) continue;
                else if(e.timeline[i].itemType === timelineTypes.extraHours || bankSeconds > 0){
                    let seconds = (
                        new Date(`9999-12-31:${finish}`).getTime() - new Date(`9999-12-31:${start}`).getTime()
                    ) / 1000;

                    if(seconds > allowedBankSeconds || bankSeconds === allowedBankSeconds){
                        if(bankSeconds === 0){
                            bankSeconds = allowedBankSeconds;
                            extraSeconds += seconds - allowedBankSeconds;

                            const bankEnd = (new Date(new Date(`9999-12-31:${start}`).getTime() + allowedBankSeconds * 1000));
                            const obj = {
                                dateTime: bankEnd,
                                itemType: timelineTypes.extraHours
                            }

                            e.timeline.insert(i+1, obj);
                            e.timeline.insert(i+2, obj);

                            finish = `${bankEnd.getHours()}:${bankEnd.getMinutes()}`;

                            appointmentType = `BANCO`;
                        }else{
                            extraSeconds += seconds
                            appointmentType = `EXTRA`;
                        }
                    }else{
                        bankSeconds += seconds;
                        appointmentType = `BANCO`;
                    }
                }

                table += (`${JSON.stringify(e.date)}${delimiter}${start}${delimiter}${finish}${appointmentType ? delimiter + appointmentType : ''}\r\n`);
                previousCheckedDate = e.date;
            }
        })
        return table;
    }

    function getFormattedContent(element) {
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
                    if(x.itemType === timelineTypes.undefinedEnd) { timelineFormatted.splice(i, 1); changed = true; }
                    else if(x.itemType === timelineTypes.correctShouldBeEnd) { x.itemType = timelineTypes.extraHours; timelineFormatted.insert(i, x) };
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

    const excludeURL = `https://expert.brasil.adp.com/expert/v4/?lp=true`
    const defaultButtonClass = `display-block w-100 text-left text-center-md relative border-none m0 p2 py2 p1-md py3-md text-white decoration-none bg-transparent bg-blue-3-hover pointer`

    function getButtonHTML(label, custom){
    return `<a
        class="${defaultButtonClass} ${custom.class || ''}"
        style=${custom.style || ''}
        data-metrics-event-action="test"
        data-testid="btn_timeline-copy"
    >
    ${custom.img || ''}
    <span
        class="
        display-inline-block display-block-md
        v-align-middle
        font-std-6
        fw-300
        "
        data-testid="txt_timeline-copy"
    >${label}</span>
    </a>
    ${custom.div || ''}`
    }

    Array.prototype.insert = function ( index, item ) {
        this.splice( index, 0, item );
    };
})(axios);
