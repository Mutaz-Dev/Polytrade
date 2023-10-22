# Polytrade Assignment
This README file provides an overview of the Polytrade "Basic Social Media Application" assignment based on NestJS with instructions on how to set up and use the application

## Description
This system will support basic functionalities such as registering users, creating posts, adding friends, and liking posts.


## Prerequisites
#### Before setting up and using the application, ensure that the following prerequisites are met:
<ol>
<li>Node.js and npm are installed.</li>
<li>NestJS is installed.</li>
<li>Git is installed.</li>
<li>Docker and Docker compose is installed.</li>
</ol>

## Installation
#### To install the Polytrade "Basic Social Media Application", follow the steps below:

##### Clone the repository from GitHub using the command:
###
    $ git clone git@github.com:Mutaz-Dev/polytrade.git .

##### Install the dependencies: using the command:
###
    $ npm install

## Environment Variables
#### Create .env file with the following environment variables:
###
    DB_NAME = 
    DB_USERNAME = 
    DB_PASSWORD = 
    DB_HOST = 
    DB_PORT =   
    DB_TIMEOUT =
    SALT_ROUNDS = 
    JWT_TOKEN_SECRET = 
    JWT_EXPIRATION = 
    SERVER_PORT =  


##### If you watn to consider running postgres DB on a docker container, run the following comand; otherwise, set the .env variables to your local PG engine.
###### NOTE: Do not forget to match the .env port variables with DB configurations inside the docker-compose.yaml file.
###
    $ docker compose up -d


## Usage
### To use the application, follow the steps below:
<ol>
<li>
<h4>Start the application:</h4>

###
    $ npm run start

<p>For development and debuging purposes:</p>

###
    $ npm run start:dev
</li>


## Lisence
#### No lisence.