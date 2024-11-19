# Welcome to the backend for smartmoneyapp

### Introduction

Thank you for taking the time to view our smartmoney API. This backend was created by Abdurahman Mohamud, Dandre Opperman, Ibrahim Ahmed, Joshua Roper, Justin Hill and Mark Harrison during a 2 week-long sprint (30-09-2024 to 11-10-2024) for our [Northcoders](https://northcoders.com) full stack software developer bootcamp.
our contact details are listed at the bottom.

The purpose of this API is accessing application data programmatically. The intention of this project was to mimic the building of a real world backend service, which provides information to the front end architecture of the smartmoneyapp which can be found here https://github.com/smart-money-app/smart-money-app. During the creation of this API we utilised the following skills:

- Javascript
- Documentation
- Test driven development (TDD)
- Jest
- Supertest
- Express
- Model view controller (MVC)
- PostgreSQL
- Fs/promises
- Json webtoken
- Password hashing (pg crypto)
- Hosting using supabase for the tables and render for the API

### Access online

To access this API online click on the following link: [smartmoneyapp backend](https://smart-money-backend.onrender.com)

For a list of endpoints, simply type /api in the url after .com

To access each endpoint, you also type it in the URL after .com

### Set up

To interact with this api locally you will need to carry out the following instructions:

1. clone the repository with following command `git clone https://github.com/DandreOpperman/smart-money-backend`

2. Next open the repository in a code editing software, for example visual studio code.

3. Next in the root of the repository create a file called .env.test . In the .env.test file on line one type `PGDATABASE=smart_money_test`.

4. next you will need to install the dependencies with following command: `npm install` . Doing so will install these dependencies:

- cors
- express
- dotenv
- pg
- pg-format
- jest
- jest extended
- supertest
- jjwt-decode

5. initialise the database by running `npm run setup-db`

6. seed the database by running `npm run seed`

7. initialise the server by running `npm start`

### Contact

please feel free to contact us or view more of our projects by using the links provided

| Name               |                         Contact                          | github                               |
| ------------------ | :------------------------------------------------------: | ------------------------------------ |
| Abdurahman Mohamud |              [email](Abdi_mo4@outlook.com)               | https://github.com/AbdurahmanMohamud |
| Dandre Opperman    | [LinkedIn](https://www.linkedin.com/in/dandre-opperman/) | https://github.com/DandreOpperman    |
| Ibrahim Ahmed      | [LinkedIn](https://www.linkedin.com/in/ibrahim-ahmed8/)  | https://github.com/IbznVI            |
| Joshua Roper       |            [email](joshuaroper513@gmail.com)             | https://github.com/joshuatdr         |
| Justin Hill        | [LinkedIn](https://www.linkedin.com/in/justinhill1976/)  | https://github.com/jasonic69         |
| Mark Harrison      |               [dev domain](me@ufailed.dev)               | https://github.com/IThinkUFailed     |
