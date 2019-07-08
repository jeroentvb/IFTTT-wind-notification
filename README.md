# wind-notifier
Get an IFTTT notification when there's wind coming. The notification includes average windspeed, spot and winddirection.

The application scrapes the forecast for the following 3 days from [windguru.cz](windguru.cz) and sends the forecast to the [maker webhooks](https://ifttt.com/maker_webhooks) service on ifttt, which can send a notification to your phone if connected to the notifications channel. Or you can connect it to something else.

## Disclaimer
This application uses a scraper to scrape windguru.cz. This is **not** allowed by the website, so use this application at you own risk.

## Table of contents
* [Installation](#installation)
* [Setup](#setup)
* [.env file](#env-file)
    * [MAKER_KEY](#maker-key)
* [app-config.json](#app-configjson)
  * [spots](#spots)
    * [name](#name)
    * [spotNumber](#spotnumber)
    * [modelNumber](#modelnumber)
    * [directionMin & directionMax](#directionmin---directionmax)
  * [windThreshold](#windthreshold)
* [IFTTT applet](#ifttt-applet)
* [CRON](#cron)

## Installation
Run the following commands in terminal.
```sh
git clone https://github.com/jeroentvb/wind-notifier.git
cd wind-notifier
npm install
touch .env
```

## Setup
### .env file
Next, create a file named `.env` and add the following line.
```
MAKER_KEY=
```

##### MAKER_KEY
Get your key for the maker channel [here](https://ifttt.com/maker_webhooks). Paste your key in the `.env` file after `MAKER_KEY=`.

### app-config.json
 An example config file is located in [app-config.json](app-config.json).  

#### spots
Spot info is contained in the `spots` array. Each spot is represented by an object.

##### name
The name of the spot. This name will be used in the notification.

> Example: Tarifa

##### spotNumber
The windguru number of a spot, which is used to get the forecastdata.
Get the spot number from the url of the forecast for a spot.
> Example: this is the url for the spot tarifa `https://www.windguru.cz/43`. 43 is the spot number.

##### modelNumber
The number windguru uses to identify a forecast model.  
You can get these using the inspector in your browser. Or use 0 for the first model, 1 for the second, 2 for the third, e.t.c.  
**Make sure the selected model has a forecast for 3 days. Otherwise the application may not work.**

> Example: If I want to use the ICON model for tarifa, the modelnumber would be 4.

##### directionMin & directionMax
Used to calculate which spot is best with a certain winddirection. The forecast of the best spot matching the winddirection will be used for the notification.

These numbers are degrees. The winddirection of a spot is calculated from `directionMin` to `directionMax`. If the winddirection (in degrees) is within those values, it will be selected as the best spot for that winddirection.  
A spots min and max direction and degrees can pass 360 degrees.

> Example 1: `directionMin`: 180, `directionMax`: 315

> Example 2: `directionMin`: 315, `directionMax`: 23

#### windThreshold
Minimum windspeed (in kts) for at least 3 hours to trigger a notification.  
If this value is left empty, the minimum will be set at 14 kts.

> Example: 14

### IFTTT applet
You also need to connect the [ifttt maker channel](https://ifttt.com/maker_webhooks) to an applet in order to do something with the notification.  
It doesn't really matter what service you attatch to it, as long as you set the maker event name to `wind-update`.

### CRON
Since this isn't a server but more of a script that should be run once to send a notification, you need to set up some sort of [cron](https://en.wikipedia.org/wiki/Cron) job to run this application at the desired time.


