# decentralized-password-manager
A password manager built on top of Ethereum


## Preface

This application is a very basic example of what a decentralized password manager would look like built off the Ethereum Blockchain. 
The front end was coded using React.js with a smart contract comprising the backend. AES encryption is used to encrypt all passwords. This 
can be specified inside of the .env file. Currently this application can only on run on local private blockchains like ganache and not on any testnets.

#### Note: This application has numerous security flaws and was only designed to demonstrate how a real decentralized passwords manager might run

## ENV Setup

Assuming the user already has knowledge of smart contracts and truffle, the only setup required is supply a passphrase into .example.env 
(located in "frontend" directory) and paste it next to REACT_APP_PASSPHRASE. Finally .example.env must then be changed to .env

## Start Up

To start the application, navigate to the "blockchain" directory and type in the command "npm run deploy-local"
