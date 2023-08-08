# ScheduleBlock
### Main features
- Allows you to block any set of websites on a schedule.
- Allows you to block independently both opening new tabs and using old tabs.
- Allows you to set up independent different times for each day of the week.
- By default uses gray color scheme to save your eyes in the night.
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

#### Other browsers
- If you use browser that is based on Chrome or Firefox, but doesn't allow you to download from Chrome or Firefox extension stores (Edge does allow it), you should always be able to fall back on release archives
- If you use browser that isn't based on Chrome or Firefox, your best bet is to download the source code and try installing it (some technical knowledge and manual code adjustments will likely be necessary)

### Usage

#### Finding options page

First thing you will probably want to do after install is finding ScheduleBlock's options page to set up your schedule.

The way you get to it depends on your browser, but in general, you will have to find the Extensions page of your browser, click on ScheduleBlock or a button near it to see more details, and then locate link to ScheduleBlock's custom options page (on Chrome it is near bottom of the details page, on Firefox it is in a hidden menu shown after clicking on a cog on the right).

#### Setting up your schedules

When you're on the options page, there is a lot of text that should guide you toward setting up your schedule.

To add a record, just enter its pattern into the corresponding text field near the bottom of the options page and click 'Add to the list' button, or press enter. Afterwards you can adjust times and destination.

In general, every record consists of:
- Pattern
    - Pattern is a [regular expression](https://en.wikipedia.org/wiki/Regular_expression) describing a set of webpage URLs. In simple terms, if a page URL matches pattern of a record, logic below applies to it. You can test whether page URL matches your pattern in the tester on the bottom of the options page.
    - Regular expressions are incredibly comprehensive notation, but for blocking a whole domain you only need something like '.\*\\.domainname\\.com.*'.
        - '.*' matches any number of any characters (to include any subdomains, like www.domainname.com, en.domainname.com, etc.)
        - '\\.domainname\\.com' matches '.domainname.com' (to specify which domain should be blocked)
        - '.*' matches any number of any characters (to include all pages on given domain, like www.domainname.com/index.html, www.domainname.com/gallery.html, etc.)
- Soft locked hours string (optional)
    - If not present, soft lock (redirect when page is visited) is not applied to pages matching pattern.
    - Consists of rules for days separated by '|' (pipe), each of which consists of time intervals separated by ',' (comma), each of which consists of two times in 24h format separated by '-' (minus). Each interval represents when pages matching pattern cannot be accessed. When there is less than 7 sets of day rules, modulo is applied. That means '12:00-14:15,15:30-16:45|9:00-19:00' will make it impossible to visit given sites from 12:00 to 14:15 and from 15:30 to 16:45 on odd days (counting Sunday as the first day) and from 9:00-19:00 on even days.
- Hard locked hours string (optional)
    - If not present, hard lock (redirect of already open page) is not applied to pages matching pattern.
    - Same format as Soft locked hours string.
- Timeouts string (optional)
	- If not present, timeout logic is not applied to to pages matching the pattern.
	- The format is similar to the two strings above. At its core is pair of time durations separated by a '/', such as '1:00/2:00:00'. First value indicates allowed time, second one indicates forbidden time per allowed time. After this pair, separated by '@', you can specify time intervals (separated with ';') when the rule applies, such as '1:00/2:00:00@12:00-14:00;16:00-18:00'. You can specify multiple such patterns per day separated by ',', and optionally separate different days with '|'.
- Action
    - JavaScript code that will be executed URL of the redirect destination. However you don't need to know any JavaScript, as common actions such as closing the tab and redirecting to different website are prepared to be selected in the edit menu.
	- When redirecting, the destination address should include the protocol (most likely http:// or https://), otherwise undesired behaviour will likely occur.

### How to help?
- You can help by translating this extension into new languages (look at the very beginning of [TranslationProvider.js](TranslationProvider.js))
- Or by implementing new features or fixing bugs (fork this repo and after making changes make a pull request)
- Or by reporting bugs or other issues (just create an issue)

### Sources
- Cog icon used for Settings button by [Lorc](https://lorcblog.blogspot.com/) under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) via [Game-icons.net](https://game-icons.net/1x1/lorc/cog.html)
- Pencil icon used for Edit button by [Delapouite](https://delapouite.com/) under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) via [Game-icons.net](https://game-icons.net/1x1/delapouite/pencil.html)


### Changelog/Roadmap

#### 1.1.7 (upcoming)
- Abandoned attempts at fixing inaccurate timeouts (sometimes off by one cycle due to scheduling)
- Removed ScheduleBlock thumbnail from the lock page (so that it isn't cached as the pages thumbnail)
- TODO: Export language, check frequency and background color along with records
- TODO: Add settings option to wipe all data (or at least to explore it in more detail)
- TODO: Improve effectivity by parsing records in RecordStorage only on load and on change

#### 1.1.6 (current)
- Added basic fallbacks for when website doesn't allow script execution
- Moved source files into the src directory
- Disabled record action input fields when given action is not selected
- Created few basic tests
- Added a lock page functionality showing original address and lock time remaining
- Created a simple Python script to automate "build" process

#### 1.1.5
- Switched from browser.storage.sync to browser.storage.local to prevent MAX_WRITE_OPERATIONS_PER_HOUR error (this will "delete" your settings, sorry)
- Cleaned up translations, fixed incorrect behavior of some labels
- Transitioned to new websites data location ("ScheduleBlock_Websites"), since your data is unfortunately getting "deleted" anyway due to the first fix
- Added alert with reason when import of settings fails

#### 1.1.4
- Moved default settings values to RecordStorage
- Completely reworked RecordStorage to hopefully make it thread safe
- Fixed timeout function not increasing duration on the last cycle
- Action when triggered is now more customizable (you can choose between redirection, closing of the window and execution of custom code)
- Created credits in the settings, listed image authors and licenses
- Made timeouts very customizable using similar format to time strings
- Reworked most of the project so that it works on Firefox (.sendMessage(), browser vs chrome, etc.)

#### 1.1.3
- Fixed a critical bug that extension wouldn't work if specific key wasn't already present due to misplaced early return
- Fixed a smaller bug that details wouldn't be shown on deletion confirmation prompt

#### 1.1.2
- Moved settings to popup, since the top bar was getting crowded
- Moved editing records to popup, since the main table was getting really crowded
- Added nice icons by Lorc (Cog) and Delapouite (Pencil), see section above for more details.
- Made ACL check frequency customizable in the options menu
- Added option for entering timeouts, implemented logic
- Restructured lot of the project into separate classes

#### 1.1.1
- Shortened code for generating table by using more loops
- Added validation when changing times
- Added validation when importing settings
- Added simple framework for translating the extension, czech translation

#### 1.1.0
- Added JSDoc signatures, improved code structure
- Options page background color can now be changed with a color picker
- Small design improvements (unified box sizes and margins)

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