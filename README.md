# Quali ADP Extractor

Proof of concept of a ADP timesheet extractor.

## Installation

1. Install Tampermonkey/Greasemonkey on your browser.
  ..* [Tampermonkey at chrome web store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)
  ..* [Tampermonkey at mozila addons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
  ..* [Tampermonkey at microsoft edge store](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

2. With Tampermonkey/Greasemonkey installed, open [this link](https://github.com/AndradeMatheus/ADPQualiExtractor/raw/master/src/ADPQualiExtractor.user.js) and press install.

3. The script is ready to run automatically at https://expert.brasil.adp.com/

## Usage

After a successful login on ADP's appointment website, head over to your appointment history and check out the month you want to be copied.

A button labeled 'COPY' will be available at the top-right corner

![ADP WEBSITE](https://i.imgur.com/XfcjUEt.png)

Press the "COPY" to copy the current visualized appointment month to your clipboard.

The format is based on Qualicorp's timesheet and should be pasted on an Excel file.
