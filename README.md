# [IN-PROGRESS] - Setup steps:

**Installing the project dependencies**: Navigate to the project root folder and run `npm install`

**Setting certificate up:** This project simulates a secure application that communicates over HTTPS in order to protect the confidentiality of our data agains malicious users intercepting our network traffic. To to do, the browser needs to use a public certificate that will be self-signed. Using a Linux or Git Bash terminal, run the following command:

`openssl req -x509 -newkey rsa:4096 -nodes -keyout key.pem -out cert.pem -days 365`

It will be responsible for generating a pair of keys, represented by the file names **key.pem** - our private key, used to encrypt data - and **cert.pem** - our digital certificate that the browser will use in order to decrypt data. 

**Setting Google App credentials up:**: Your back-end application needs to be registered as a client app on the identity provider (in our case, Google). To accomplish this, access the Google Developer console (https://console.developers.google.com/project). Then, create a new project with the name of your preference. Under the "credential" menu, click "Set Up consent screen", select "External" for User Type

Pending to write about the following topics:

Create a file named .env
About the cookie keys to be set on .env
Gitignore