// ==UserScript==
// @name         ADP QUALICORP TIMESHET CLIPBOARD
// @namespace    https://github.com/AndradeMatheus/ADPQualiExtractor/
// @version      0.7
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

    window.addEventListener('load', () => {
        setTimeout( function(){
            addButton('Timesheet', customContent.whiteCopyOutline);
        }, 2000)
    })

    function addButton(label, custom) {
        const buttonHTML = getButtonHTML(label, custom);
        const buttonDOM = document.createElement('a');
        buttonDOM.innerHTML = buttonHTML;
        buttonDOM.addEventListener('click', function(){
            copyTable();
        });

        const sidebar = document.getElementsByClassName('display-block-md display-none bg-blue-4 text-center')[0];
        if(sidebar) sidebar.appendChild(buttonDOM);
        else alert('Ocorreu um erro ao carregar o botão de cópia de timesheet :( \n Por favor, recarregue a página.');

        return buttonDOM
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

        workDays.sort((x, y) => new Date(x.oldDate).getTime() - new Date(y.oldDate).getTime());

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
        const header = [{key:"date", title:"Data"}, {key:"timelineStart", title: "Início"}, {key:"timelineEnd", title:"Fim"}, {key:"extraType", title:"Tipo"}];
        let content = (header.map(m => m.title).join('	')) + '\r\n';

        timeTable.forEach( e => {
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
                    if(x.itemType === timelineTypes.undefinedFinish) { timelineFormatted.splice(i, 1); changed = true; }
                    else if(x.itemType === timelineTypes.correctShouldBeFinish) { x.itemType = timelineTypes.extraHours; timelineFormatted.insert(i, x) };
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

    const timelineTypes = {
        extraHours: 0,
        undefinedFinish: 1,
        incorrectAppointedStart: 2,
        incorrectAppointedFinish: 3,
        correctShouldBeFinish: 7,
        correctAppointedStart: 10,
        correctAppointedFinish: 21,
    }

    const customContent = {
        whiteCopyOutline: {
            icon:'<img src="https://img.icons8.com/pastel-glyph/32/000000/copy--v1.png" style="filter: invert(1)"/>',
            style: '',
            class: '',
            div: ''
        }
    }

    function getButtonHTML(label, custom){
    return `<a
        class="display-block w-100 text-left text-center-md relative border-none m0 p2 py2 p1-md py3-md text-white decoration-none bg-transparent bg-blue-3-hover pointer timelinecopy ${custom.class}"
        style=${custom.style}
        data-metrics-event-action="test"
        data-testid="btn_timeline-copy"
    >
    ${custom.icon}
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
    ${custom.div}`
    }

    Array.prototype.insert = function ( index, item ) {
        this.splice( index, 0, item );
    };
})(axios);
