![banner](https://i.imgur.com/Jx8MaDq.png)

Extract viewed month appointed hours to your clipboard or to a CSV file.

**Other Readme languages**:

* [PT-BR](https://github.com/AndradeMatheus/ADPQualiExtractor/blob/master/READMEPT_BR.md)

## Installation

1. Install Tampermonkey/Greasemonkey on your browser:
  * [Tampermonkey at chrome web store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)
  * [Tampermonkey at mozila addons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
  * [Tampermonkey at microsoft edge store](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

2. With Tampermonkey/Greasemonkey installed, open [this link](https://github.com/AndradeMatheus/ADPQualiExtractor/raw/master/src/ADPQualiExtractor.user.js) and press install.

3. The script is ready to run automatically at https://expert.brasil.adp.com/v4/

## Updating

* This script will be automatically updated by tampermonkey.
   * In case tampermonkey can't update the script, the user will be notified if a newer version exists, being able to manually update the script with the button 'Force update' in the 'Script' section.

## Uninstallation

1. Open your tampermonkey dashboard

2. On the dashboard, delete the "ADP QUALICORP TIMESHET CLIPBOARD" script.

  * If you prefer to uninstall tampermonkey, head to chrome://extensions and delete the extension;
      * This also disables the "ADP QUALICORP TIMESHET CLIPBOARD" script automatically.

## Usage

After a successful login on ADP's appointment website, head over to your appointment history and check out the month you want to copy.

Two additional sections will be created on the sidebar:

![SIDEBAR](https://i.imgur.com/8AakRUK.png)

* Script's notifications and alerts will appear on the website's bottom-right corner.

### - Timesheet

Below this section, there's two buttons:

* Copy: Copy the current visualized appointment month to your clipboard.

* CSV: Download the current visualized appointment month to a CSV file.

The format is based on Qualicorp's timesheet.

### - Script

On this section, we have three buttons:

* Force update: Manually check script updates

* Help: Redirect to this repo's issue page.

* GitHub: Redirect to this repo's main page.

### - ADP

This section contains every original sidebar action which remains unchanged.

---

### Thank you for using my tool :)
