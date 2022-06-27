# ScheduleBlock
### Main features
- Allows you to block any set of websites on a schedule.
- Allows you to block independently both opening new tabs and using old tabs.
- Allows you to set up independent different times for each day of the week.
- Uses gray color scheme to save your eyes in the night.
- Reliable, without spying, ads or microtransactions.
- Fully open source, therefore open to both code inspections and great new ideas.
- Perfect for improving your concentration when you need it.

### How to install

#### Chrome
- Simplest way is to install it from [Chrome Store](https://chrome.google.com/webstore/detail/scheduleblock/hkcbacbpfhlbmaifoakhifmopmgdajkn)
- Another way is to download [release zip file](https://github.com/sdasda7777/ScheduleBlock/releases)
- Lastly, you can clone this repo and point Chrome inside the folder (Extensions (chrome://extensions/) > Load Unpacked)

#### Firefox
- Simplest way is to install it from [Firefox Browser Add-Ons](https://addons.mozilla.org/en-US/firefox/addon/scheduleblock/)
- Another way is to download [release xpi file](https://github.com/sdasda7777/ScheduleBlock/releases)
- Lastly, you can clone this repo and point Firefox toward the manifest file
	- You will have to rename the manifestff.json to manifest.json
	- Beware that installing unsigned extensions on Firefox is kinda painful

#### Other browsers
- If you use browser that isn't based on Chrome or Firefox, your best bet is to download the source code and try installing it (some technical knowledge and manual code adjustments will likely be necessary)

### Changelog

#### 1.0.9
- Moved from using global variables to using callback functions
- Fixed a minor bug where importing the same settings file for the second time without reloading the page wouldn't work
- Renamed button.css to styles.css
- Added more comments, general code style improvements

#### 1.0.8
- Reimplemented reordering to use number input box instead of buttons

#### 1.0.7
- Changed labels of buttons to keep page as brief as possible
- Added option to reorder records using buttons

#### 1.0.6
- Introduced "widget" to allow user to test pattern beforehand