# Solana NextJS POC

This app is built as a part of R&D process within my organisation. It creates a simple app where one can use Solana to
pay for their online purchases.

## Technologies

- NextJS: For building FE and BE of the app
- Prisma: ORM for MySQL database
- TypeScript: Used throughout the app
- Zod: For validating user input
- tRPC: For creating fully typed API connection between FE and BE.
- Solana Pay: For making online payment
- TailwindCSS: For styling the app
- Auth0: For authentication and authorization
- Figma: For designing the pages
- Vercel: For FE deployment
- Railway: For MySQL deployment

## Todo

- [x] Design all the pages in NextJS - Home page, Product page
- [x] Setup Prisma and create User, Product, and Order Schema
- [x] Add Auth0 authentication flow
  - [x] New user can click on Login button.
  - [x] This takes the user to Auth0 UI.
    - [x] User chooses email and password:
      - [x] Auth0 manages the sign-up and login.
      - [x] Sends a mail for verifying email.
      - [x] Sets up a flag to indicate sign-up: Done via Auth Pipeline -> Rules
      - [x] Capture signup flag to fill the User table on our end.
      - [x] Check for email_verified flag and show toast notification for the same to the user.
      - [x] If email_verfied === true and not the first login (signup): don't interact with the database.
    - [x] User chooses social login - google here
      - [x] Auth0 manages the flow
      - [x] Automatic verification of email.
      - [x] Sets a flag to indicate sign-up: Done via Auth pipeline -> rules
      - [x] Capture signup flag to fill the User table on our end.
    - [x] User logins with both interchangably
      - [x] Use upsert method to create or update user data based on email.
  - [x] Once auth is complete, show the logout and select wallet buttons.
  - [x] On select wallet action, allow selection of solana wallet
- [x] Add the user data to the MySQL database
- [x] Add tRPC and Zod
- [ ] Make the product data dynamic coming from database
- [ ] Implement Solana Pay
- [ ] Store the orders of users in the db
- [ ] Test the complete app
