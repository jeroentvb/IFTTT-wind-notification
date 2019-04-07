# wind-notifier
Get an IFTTT notification when there's wind coming.

## Disclaimer
This application uses a scraper to scrape windguru.cz. This may not be allowed by the website, so use this application at you own risk.

## Table of contents
* [What it does](#what-it-does)
* [Installation](#installation)
* [Setup](#setup)
  * [.env file](#.env-file)
  * [Cron](#cron)
  * [IFTTT Applet](#ifttt-applet)

## What it does
This application scrapes the forecast for the following 3 days from [windguru.cz](windguru.cz) and sends the forecast to the [maker webhooks](https://ifttt.com/maker_webhooks) service, which can send a notification to your phone. Or you can connect it to something else.

## Installation
Run the following commands in terminal.
```sh
git clone https://github.com/jeroentvb/wind-notifier.git
cd wind-notifier
npm install
```

## Setup
### .env file
Next, create a file named `.env` and add the following lines.
```
MAKER_KEY=
SPOT_NUMBER=
SPOT_MODELNUMBER=
```

##### MAKER_KEY
Get your key for the maker channel [here](https://ifttt.com/maker_webhooks).

##### SPOT_NUMBER
Get the spot number from the url of the forecast for a spot. E.g. this is the url for tarifa `https://www.windguru.cz/43`. 43 is the spot number.

##### SPOT_MODELNUMBER
This is the number of the model you want to use for the forecast. You can get these using the inspector in your browser. Or use 0 for the first model, 1 for the second, 2 for the third, e.t.c.  
Example: If I want to use the ICON model for tarifa, the modelnumber would be 4.

### CRON
Since this isn't a server but more of a script that should be run once to send a notification, you need to set up some sort of [cron](https://en.wikipedia.org/wiki/Cron) job to run this application at the desired time.

### IFTTT applet
Last but not least you need to set up an applet on ifttt to run when this application runs.  
It doesn't really matter what service you attatch to it, as long as you set the maker event name to `wind-update`.
