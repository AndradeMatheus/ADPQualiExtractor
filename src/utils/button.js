// button.js

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