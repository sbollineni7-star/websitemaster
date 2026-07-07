# JobHunt One Portal Assistant

Browser extension for capturing the visible job detail page from LinkedIn Jobs and Dice into the JobHunt One workspace.

## Install locally

1. Open Chrome or Edge.
2. Go to `chrome://extensions`.
3. Enable `Developer mode`.
4. Click `Load unpacked`.
5. Select this folder: `extensions/jobhunt-one`.

## Use

1. Open a LinkedIn Jobs or Dice job detail page.
2. Click `Save to JobHunt One` on the page, or open the extension popup and click `Capture Current Job`.
3. Open `http://127.0.0.1:3000/jobhunt`.
4. The workspace imports captured jobs from extension storage when the extension is installed.

The extension only captures the job detail page you are viewing. It does not auto-apply, bulk scrape listings, or submit messages.
