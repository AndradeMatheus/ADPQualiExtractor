![banner](https://i.imgur.com/Jx8MaDq.png)

Faça a extração dos meses apontados para a área de transferência ou um CSV.

## Instalação

1. Instale Tampermonkey/Greasemonkey no seu navegador:
  * [Tampermonkey na chrome web store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)
  * [Tampermonkey no mozila addons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
  * [Tampermonkey na microsoft edge store](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

2. Com o Tampermonkey/Greasemonkey instalado, abra [esse link](https://github.com/AndradeMatheus/ADPQualiExtractor/raw/master/src/ADPQualiExtractor.user.js) e pressione 'install'

3. O script está pronto para ser executado automaticamente no https://expert.brasil.adp.com/v4/

## Atualização

* O script será automaticamente atualizado pelo tampermonkey.
   * Caso o tampermonkey não consiga atualizar o script, o usuário será notificado se uma versão mais atual existir, podendo atualizar manualmente o script pelo botão 'Force update' na seção 'Script'

## Desinstalação

1. Abra a dashboard do tampermonkey

2. Na dashboard, delete o script "ADP QUALICORP TIMESHET CLIPBOARD"

  * Caso opte por desinstalar o tampermonkey, vá para chrome://extensions e delete a extensão;
      * Isso também desativa o script "ADP QUALICORP TIMESHET CLIPBOARD" automaticamente.

## Uso

Após realizar login no site do ADP web, vá para o histórico de apontamentos e visualize o mês que você deseja copiar.

Duas seções adicionais serão criadas na barra lateral do site:

![SIDEBAR](https://i.imgur.com/8AakRUK.png)

  * Notificações e alertas referentes ao script aparecerão no canto inferior direito do site.

### - Timesheet

Abaixo da seção "Timesheet", haverá 2 botões:

* Copy: Copie o mês atualmente visualizado para a área de transferência (clipboard).

* CSV: Baixe a extração do mês atualmente visualizado para um arquivo CSV.

O formato é baseado no timesheet da Qualicorp, com horários baseados em intervalo e conteúdo de banco de horas/extras.

### - Script

Nessa seção, temos 3 botões:

* Force update: Checagem manual de atualizações do script.

* Help: Redirect para a página de issues desse repo.

* GitHub: Redirect para a página principal desse repo.

### - ADP

Nessa seção constam todas as funções originais do site sem nenhuma alteração.

---

### Obrigado por usar a minha ferramenta :)
