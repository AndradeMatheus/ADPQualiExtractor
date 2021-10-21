// utils.js

function setButtonImageByClass(customContent, type) { document.getElementsByClassName(customContent.class)[0].children[0].src = customContent.icons[type] }

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