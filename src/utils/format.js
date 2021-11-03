// format.js

function formatTimesheet(content, delimiter) {
    const timesheet = content.data.timetable;
    const workdays = getWorkdays(timesheet);
    return getFormattedTimesheet(workdays, delimiter);
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
            else if(e.timeline[0].itemType === timelineTypes.incorrectAppointedStart){
                appointmentType = `EXTRA`;
            }
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