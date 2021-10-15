// ==UserScript==
// @name         ADP QUALICORP TIMESHET CLIPBOARD
// @namespace    https://github.com/AndradeMatheus/ADPQualiExtractor/
// @version      0.5
// @description  Copy month's appointments to clipboard
// @author       Matheus Andrade (Tetis) [github.com/AndradeMatheus]
// @copyright    2021+, Matheus Andrade (https://github.com/AndradeMatheus)
// @homepageURL  https://github.com/AndradeMatheus/ADPQualiExtractor/
// @match        https://expert.brasil.adp.com/
// @include      https://expert.brasil.adp.com/*
// @require      https://raw.githubusercontent.com/AndradeMatheus/ADPQualiExtractor/master/src/axios.min.js
// @require      https://raw.githubusercontent.com/AndradeMatheus/ADPQualiExtractor/master/src/axiosGmxhrAdapter.min.js
// @icon         https://www.google.com/s2/favicons?domain=adp.com
// @grant        none
// ==/UserScript==

(async function(axios) {
    'use strict';

    const timelineTypes = {
        extraHours: 0,
        undefinedFinish: 1,
        incorrectAppointedStart: 2,
        incorrectAppointedFinish: 3,
        correctShouldBeFinish: 7,
        correctAppointedStart: 10,
        correctAppointedFinish: 21,
    }

    window.addEventListener('load', () => {
        addButton('COPY', true, true, { top: '7%', right: '4%'});
    })

    function addButton(text, intervals, extras, position, cssObj) {
        cssObj = cssObj || {position: 'absolute', top: position.top, right: position.right, 'z-index': 3}
        let button = document.createElement('button'), btnStyle = button.style
        document.body.appendChild(button)
        button.innerHTML = text
        button.addEventListener('click', function(){
            copyTable(intervals, extras);
        });
        Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key])
        return button
    }

    async function copyTable(intervals, extras) {
        const date = getDate();
        const content = await getContent(date);
        const table = formatTimeTable(content, intervals, extras);
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

    function formatTimeTable(content, intervals, extras) {
        const timeTable = content.data.timetable;
        let offDays = [];
        let workDays = [];

        timeTable.forEach( e => {
            e.hasOwnProperty("timeline") ? workDays.push(newFormat(e, extras)) : offDays.push(newFormat(e, extras));
        })

        workDays.sort((x, y) => new Date(x.oldDate).getTime() - new Date(y.oldDate).getTime());

        return formatTable(workDays, intervals, extras);
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

    function formatTable(timeTable, intervals, extras){
        const header = [{key:"date", title:"Data"}, {key:"timelineStart", title: "Início"}, {key:"timelineEnd", title:"Fim"}, {key:"extraType", title:"Tipo"}];
        let content = (header.map(m => m.title).join('	')) + '\r\n';

        timeTable.forEach( e => {
            const timelineSize = e.timeline.length;
            let finish = '', start = '';

            if(!intervals && !extras){
                const opex = `${new Date(e.timeline[timelineSize-1].dateTime).getHours()-1}:${new Date(e.timeline[timelineSize-1].dateTime).getMinutes()}`
                start = `${new Date(e.timeline[0].dateTime).getHours()}:${new Date(e.timeline[0].dateTime).getMinutes()}`;
                e.timeline[timelineSize-1] ?
                    finish = `${new Date(e.timeline[timelineSize-1].dateTime).getHours()}:${new Date(e.timeline[timelineSize-1].dateTime).getMinutes()}`
                : finish = 'ABERTO';
                content += (`${JSON.stringify(e.date)}	${start}	${opex}\r\n`);
                content += (`${JSON.stringify(e.date)}	${opex}	${finish}\r\n`);
            }else if(intervals && !extras){
                for (let i = 0; i < e.timeline.length; i = i+2) {
                    let start = '', finish = '';
                    start = `${new Date(e.timeline[i].dateTime).getHours()}:${new Date(e.timeline[i].dateTime).getMinutes()}`;
                    e.timeline[i+1] ?
                        finish = `${new Date(e.timeline[i+1].dateTime).getHours()}:${new Date(e.timeline[i+1].dateTime).getMinutes()}`
                    : finish = 'ABERTO';
                    content += (`${JSON.stringify(e.date)}	${start}	${finish}\r\n`);
                }
            }else if(intervals && extras){
                const allowedBankSeconds = 6300
                let bankSeconds = 0, extraSeconds = 0;
                let previousCheckedDate;

                for (let i = 0; i < e.timeline.length; i = i+2) {
                    if(e.date !== previousCheckedDate) { bankSeconds = 0; extraSeconds = 0; }

                    let start = '', finish = '', extraType = '	NORMAL';

                    start = `${new Date(e.timeline[i].dateTime).getHours()}:${new Date(e.timeline[i].dateTime).getMinutes()}`;
                    e.timeline[i+1] ?
                        finish = `${new Date(e.timeline[i+1].dateTime).getHours()}:${new Date(e.timeline[i+1].dateTime).getMinutes()}`
                    : finish = 'ABERTO';

                    if(start === finish) continue;

                    if(e.timeline[i].itemType === timelineTypes.extraHours || bankSeconds > 0){
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
                                    itemType: 0
                                }

                                e.timeline.insert(i+1, obj);
                                e.timeline.insert(i+2, obj);

                                finish = `${bankEnd.getHours()}:${bankEnd.getMinutes()}`;

                                extraType = `	BANCO`;
                            }else{
                                extraSeconds += seconds
                                extraType = `	EXTRA`;
                            }
                        }else{
                            bankSeconds += seconds;
                            extraType = `	BANCO`;
                        }
                    }

                    content += (`${JSON.stringify(e.date)}	${start}	${finish}${extraType}\r\n`);
                    previousCheckedDate = e.date;
                }
            }
        })

        return content;
    }

    function newFormat(element, extras) {
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
                    if((x.itemType === timelineTypes.correctShouldBeFinish && !extras) || x.itemType === timelineTypes.undefinedFinish) { timelineFormatted.splice(i, 1); changed = true; }
                    else if(x.itemType === timelineTypes.correctShouldBeFinish && extras) { x.itemType = timelineTypes.extraHours; timelineFormatted.insert(i, x) };
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

    Array.prototype.insert = function ( index, item ) {
        this.splice( index, 0, item );
    };
})(axios);
