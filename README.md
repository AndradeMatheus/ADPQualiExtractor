![banner](https://i.imgur.com/Jx8MaDq.png)

# Quali ADP Extractor

Proof of concept of an ADP timesheet extractor.

This is currently working, and will be regularly updated, but will be deprecated in favor of an in-development [Chrome Extension](https://cdn.discordapp.com/attachments/842058104844714004/884799525003358249/unknown.png) with more features to come.

**Other Readme languages**:

* [PT-BR](https://github.com/AndradeMatheus/ADPQualiExtractor/blob/master/READMEPT_BR.md)

## Installation

1. Install Tampermonkey/Greasemonkey on your browser.
  * [Tampermonkey at chrome web store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)
  * [Tampermonkey at mozila addons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
  * [Tampermonkey at microsoft edge store](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

2. With Tampermonkey/Greasemonkey installed, open [this link](https://github.com/AndradeMatheus/ADPQualiExtractor/raw/master/src/ADPQualiExtractor.user.js) and press install.

3. The script is ready to run automatically at https://expert.brasil.adp.com/

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;* PS: If you need to update the script manually, access the link from step 2.

## Usage

After a successful login on ADP's appointment website, head over to your appointment history and check out the month you want to copy.

A button labeled "Timesheet" will be available at the sidebar.

![ADP WEBSITE](https://i.imgur.com/BMn70wg.png)

* Press the "Timesheet" button to copy the current visualized appointment month to your clipboard with intervals and bank hours/extra appointments.

The format is based on Qualicorp's timesheet and should be pasted on an Excel file, as shown below:

![EXCEL](https://i.imgur.com/8MlItEl.png)

Thank you for using this tool :)
