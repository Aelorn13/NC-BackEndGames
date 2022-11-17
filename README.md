There is the link to hosted version - https://dead-pink-hare-garb.cyclic.app/api/

This is a server project for the northcoders board games database.

To clone this project, you need to click on the "Code" button on the site, copy the link and write "git clone your_copied_link" in the terminal.

To install all dependencies in the project directory, you need to write the "npm install" command in the terminal.

To create the required databases, you first need to type "npm run setup-dbs" into the terminal. Then write the command "npm run seed" to seed this database.

To run the tests, you just need to write the command "npm test" in the terminal.

In order to successfully join databases locally, you will need to create the .env.test and .env.development files in the same folder as app.js file and specify the desired database inside those files (PGDATABASE=database_name_here).

Minimum versions needed to run this project are :
PostgreSQL 14.5
Node.js 18.10.0
