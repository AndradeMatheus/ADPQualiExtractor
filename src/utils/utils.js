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
        successful ? createNotify("Sucesso", "#1A871A", 'Tabela copiada com sucesso :)')
        : createNotify("Erro", "#D40F0F", `Houve um erro ao copiar a tabela :(`)
    } catch (err) {
        console.log(err);
        createNotify("Erro", "#D40F0F", `Houve um erro ao copiar a tabela :(`)
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
    try{
        link.click();
        createNotify("Sucesso", "#1A871A", `CSV gerado com sucesso :)`)
    }catch(err){
        console.log(err);
        createNotify("Erro", "#D40F0F", `Houve um erro ao gerar o CSV :(`)
    }
}

function createNotify(title, background, description){
    Notify.alert({ 
        title,
        description,
        background,
        position: "BottomRight",
        color: "white",
        borderRadius: "0px"
    })
}