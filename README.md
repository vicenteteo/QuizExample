# sumome
Creates and load questions based in the assigned user.

# Prerequisites
 
 - MySql (The project was developed using the version 5.7.15, but there is no reason to believe that you cannot install older ones)
 - Create a user named root and set its password to root also (if you prefer you can edit the file ./src/db/mngr.js - Edit the environment variables to what you want)
 - NodeJs v0.10.46
 - Npm v2.15.1
  
# Installation

 - Download the master branch.
 - Run the npm install command from the project folder.

# Running

- After the installation run the following command: npm run start

# Application Flow

- When starting the application will creates the sumome database automatically
- A table named sessions will be created and will be used to store the user sessions data.
- To open the main page just type http://localhost:8081 in the browser.
- In the right top of the page there is a button 'Sign In'. Push the button and enter the user as admin@admin.com and the password as admin
- Logged as admin you will see the Question Editor where you can elaborate a question and insert answers.
- After configure the Question and push the save button the Question Editor will be cleaned and you can either create another question or push the Sign Out button in the right top
- If try to access the page again the page will keep your last state, so if you were logged as admin before you leave you will return as admin.
- To see the Questions make sure that you have pushed the Sing Out button. You can also clean the browser cache or open another browsers instance in incognito mode.
- After you answer the Question it will not appear again until you clear your session data.

# Improvements


