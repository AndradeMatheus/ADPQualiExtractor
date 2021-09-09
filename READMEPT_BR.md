# Quali ADP Extractor

POC de um script de extração de apontamentos do ADP.

Esse script está funcionando atualmente, porém está descontinuado em favor do desenvolvimento de uma [extensão do chrome](https://cdn.discordapp.com/attachments/842058104844714004/884799525003358249/unknown.png) com mais funcionalidades previstas.

[GitHub link](https://github.com/AndradeMatheus/ADPQualiExtractor/)

## Instalação

1. Instale Tampermonkey/Greasemonkey no seu navegador.
  * [Tampermonkey na chrome web store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)
  * [Tampermonkey no mozila addons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
  * [Tampermonkey na microsoft edge store](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

2. Com o Tampermonkey/Greasemonkey instalado, abra [esse link](https://github.com/AndradeMatheus/ADPQualiExtractor/raw/master/src/ADPQualiExtractor.user.js) e pressione 'install'.

3. O script está pronto para ser executado automaticamente no https://expert.brasil.adp.com/

## Uso

Depois de realizar login no site do ADP web, vá para o histórico de apontamentos e visualize o mês que você deseja copiar.

Um botão com a label "COPY" vai estar disponível no canto direito superior do site.

![ADP WEBSITE](https://i.imgur.com/XfcjUEt.png)

Pressione o botão "COPY" para copiar o mês atualmente visualizado para a área de transferência.

O formato é baseado no timesheet da Qualicorp e deve ser colado em um arquivo Excel.