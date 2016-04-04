# Pingify : 
Real time social media notifications on Google Chrome
# Description: 
A chrome addon that notifies any new update on any of the opened social media tab  and allows to quickly switch to it. Currently supports Facebook, Twitter, Linkedin.
# Benifits:
	* Allows to check realtime social media updates without leaving the current tab
	* Makes it easy to quickly switch to the tab you are interested in, from any window
	# Features
	* Supports facebook, twitter, Linkedin
	* Realtime and fast updates
	* Ability to quickly switch between tabs
	* Supports multiple windows and multiple tabs
	* Does not need any sensitive data, password etc
	* Low on memory consuption
# Screenshots
## Notifications
![Screenshot](/screenshots/main1.png?raw=true "Screenshots")
## Combined Notifications
![Screenshot](/screenshots/main2.png?raw=true "Screenshots")
## Expanded View
![Screenshot](/screenshots/main3.png?raw=true "Screenshots")
## Normal view
![Screenshot](/screenshots/main4.png?raw=true "Screenshots")

# Components:
	popup.js: script that gets activated when user clicks the pingify icon in the toolbar
	background.js : acts like a modal and performs ajax listening and title value calcualtion
	popup.html: html for popup UI
	manifest.json : configuration file as per Google chrome recommendations

# Issues: 
	Please see the attached issue tracker

# credits :
	Icon files : http://www.iconarchive.com/show/100-flat-2-icons-by-graphicloads
	Google Chrome API : https://developer.chrome.com/extensions

# Author: 
	Piyush Tripathi @ Texas A&M University
	http://piyu.tk

# ToDo: 
	Support Gmail, Whatsapp and many other social media sites
	Allow any tab to be pingified
