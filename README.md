# README

Link to the hosted version: https://dead-pink-hare-garb.cyclic.app/api/

This is a server project for the northcoders board games database.

To clone this project, you need to click on the "Code" button, copy the link and use "git clone your_copied_link" command in your terminal.

To install all dependencies in the project directory, you need to run "npm install" command in the terminal.

To create the required databases, you first need to run "npm run setup-dbs" command in the terminal. Then use "npm run seed" command to seed this database.

To run the tests, you just need to use "npm test" command.

In order to successfully join databases locally, you will need to create the .env.test and .env.development files in the same folder as app.js file and specify the desired database inside those files (PGDATABASE=database_name_here).

Minimum versions needed to run this project are :
PostgreSQL 14.5
Node.js 18.10.0
