Our application will be centered around the functionality of utilizing real-time odds and sportsbook offers to calculate risk-free bets based on probability and given outcomes. We will be using an API to gather betting odds from various sportsbooks and use their data to suggest potential bets for maximizing winnings. Users will be able to view a variety of potential outcomes by inputting their desired sportsbook and given offers. The key points of the application include calculated odds so that no bet is placed without known outcomes. These “known” outcomes will be based on various deals that sportsbooks offer for signing on, seasonal specials, or after meeting monetary value thresholds.

Individual user accounts will record an input of previous/current bets and suggest future bets based on those inputs. The application will be fairly simple as far as pages go since the user will not be making bets based on teams or sports, but the odds associated with any event. We will provide a page that lists viable options for placing bets that includes any additional non-essential information like sport, team, date, etc. The odds for any bet will be obtained using an API for the most up-to-date and accurate information. For the sake of simplicity, we do not intend to use an API for deals on offer at the various sportsbooks but will instead compile a list of the most common ones and allow users to select their intended, or available deal manually when using the bet hacker.

Users will also have the opportunity to communicate with customer service agents via a help page that offers “live” support. This feature will function essentially as a chat service that records previous conversations and allows interaction between two accounts (one client, and one SafeBet team member) This page should also include a suggestion box for bug fixes, feature requests, or help fill in missing data like new offers or incorrect odds.
Additional pages on the web app include login, register, welcome pages, an about page, a user profile page, a user betting history and a main function page for viewing recommended bets.

Meet the team who developed this project: Ruan Abarbanel, Rohan Adepu, Joshua Gildred, Chasen Goren, Robiel Kennedy, Aaron Van.

For this project we used this list of websites and services including:
- [Docker](https://www.docker.com)
- [The-Odds-API](https://the-odds-api.com)
- [Microsfot Azure](https://azure.microsoft.com/en-us/)
  
In order to run this app if the Azure site isn't up, you will need to download Docker as listed above and make sure you have virtualization enabled on your PC. 

Step one of setting up the app once the repository is downloaded as well as Docker. Is to use this command while in `../ProjectSourceCode`, `docker-compose up -d`

To run a test on the program you must once the site is running with the above command. Go to a browser of your choice and type in the browser head [http://localhost:3000](http://localhost:3000)

Here is the fully built app - [http://recitation-010-team-01.eastus.cloudapp.azure.com:3000/register](http://recitation-010-team-01.eastus.cloudapp.azure.com:3000/home/odds)
