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
	- Beware that installing unsigned extensions on Firefox is kinda painful

#### Other browsers
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
- Normal allowed time is amount of time you are allowed to be on a given page.
- Normal timeout is amount of time you must wait before being able to acces given page again.
- Redirect destination
    - URL of the redirect destination. The address should include the protocol (most likely http:// or https://), otherwise undesired behaviour may occur.

### How to help?
- You can help by translating this extension into new languages (look at the very beginning of [TranslationProvider.js](TranslationProvider.js))
- Or by implementing new features or fixing bugs (fork this repo and after making changes make a pull request)
- Or by reporting bugs or other issues (just create an issue)

### Sources
- Cog icon used for Settings button by [Lorc](https://lorcblog.blogspot.com/) under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) via [Game-icons.net](https://game-icons.net/1x1/lorc/cog.html)
- Pencil icon used for Edit button by [Delapouite](https://delapouite.com/) under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) via [Game-icons.net](https://game-icons.net/1x1/delapouite/pencil.html)


### Changelog

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