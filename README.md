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
- [x] Make the product data dynamic coming from database
- [x] Store the orders of users in the db
  - [x] Store products in order table in db on addToCart with status="IN_CART"
  - [x] Remove products from order table from db on deleteFromCart with status="IN_CART"
  - [x] Storing productIds in the localStorage for quick knowledge of add or remove state -> Security Issue?
- [ ] Implement Solana Pay
  - [x] Get Devnet SOL from [Solfaucet](https://solfaucet.com/). Only 1 unit allowed per request.
  - [x] Complete the SOL Desktop flow.
  - [x] Get the USDC-Dev - Token starts with [Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr] ($1000) from [Solfaucet-USDC-DEV](https://spl-token-faucet.com/?token-name=USDC-Dev). You must have SOL amount (DEV NETWORK) in your wallet.
  - [x] Complete the USDC Desktop Flow.
  - [x] Implement Point of Sale Page for accepting SOL and USDC using mobile QR Scanner Flow: Needs mobile wallet download in Android or iOS. Download [Phantom wallet](https://phantom.app/download)
- [x] Test the complete app

## Future Todos

- Build a transaction without available js tools.
- Use different technologies for server side - SpringBoot, Go, Rust, Express TS.
- Separate FE and BE.
- Loyalty Program in Solana Pay
- Tighten the app security and remove defects. This is just a POC app. Doesn't follow best practices.

## Findings

- Prisma doesn't allow update of single record unless the where clause has a field which is unique. Breaks the case where 2 columns together make a unique constraint and one wants to just update single record using those 2 columns. Solution was to write manual SQL query using Prisma.$queryRaw.
- Multiple issues could be present due to not much regard to secure the app and hardly any testing. Only manual testing was done up to a certain limit.
- Implementing tRPC with Auth0 was a pain. First attempt to learn TailwindCSS, tRPC, Auth0 was not easy.
- Have paid no regard to securing the app to the level of production.
- Solana Pay implementation was quite easy.
- @solana/web3.js package is quite huge.

## Solana Pay

Solana Pay is a new payments protocol over Web 3. It's decentralized, open, and truly peer-to-peer payment protocol. The vision is to pave the way for a future where digital currencies are prevalent and digital money moves through the internet like data - uncensored and without intermediaries taxing every transaction.

The core premise behind Solana Pay is that the payment and underlying technology goes from being a necessary service utility to true peer-to-peer communication channel between the merchant and consumer.

The protocol provides a specification that allows the consumer to send digital dollar currencies, such as USDC, from their wallet directly into the merchant’s account, settling immediately with costs measured in fractions of a penny. This embeds loyalty, offers and rewards in the same messaging scheme and become true building blocks for the future of commerce.

### Specification

```js
solana:<recipient>?amount=<amount>&label=<label>&message=<message>&memo=<memo>&reference=<reference>
```

### Recipient

A single **recipient** field is required as the pathname. The value must be the **base58-encoded public key** of a native SOL account. Associated token accounts must not be used.

Instead, to request an SPL token transfer, the **spl-token** field must be used to specify an SPL Token mint, from which the associated token address of the recipient address must be derived.

### Amount

A single **amount** field is allowed as an optional query parameter. The value must be a non-negative integer or decimal number of "user" units. For SOL, that's SOL and not lamports. For tokens, uiAmountString and not amount (reference: [Token Balances Structure](https://docs.solana.com/developing/clients/jsonrpc-api#token-balances-structure)).

**0** is a valid value. If the value is a decimal number less than 1, it must have a leading 0 before the .. Scientific notation is prohibited.

If a value is not provided, the wallet must prompt the user for the amount. If the number of decimal places exceed what's supported for SOL (9) or the SPL token (mint specific), the wallet must reject the URL as malformed.

### SPL Token

A single **spl-token** field is allowed as an optional query parameter. The value must be the **base58-encoded public key** of an SPL Token mint account.

If the field is not provided, the URL describes a native SOL transfer. If the field is provided, the [Associated Token Account](https://spl.solana.com/associated-token-account) convention must be used.

Wallets must derive the ATA address from the recipient and spl-token fields. Transfers to auxiliary token accounts are not supported.

### Reference

Multiple reference fields are allowed as optional query parameters. The values must be base58-encoded public keys.

If the values are provided, wallets must attach them in the order provided as read-only, non-signer keys to the SystemProgram.transfer or TokenProgram.transfer/TokenProgram.transferChecked instruction in the payment transaction. The values may or may not be unique to the payment request, and may or may not correspond to an account on Solana.

Because Solana validators index transactions by these public keys, reference values can be used as client IDs (IDs usable before knowing the eventual payment transaction). The [getSignaturesForAddress](https://docs.solana.com/developing/clients/jsonrpc-api#getsignaturesforaddress) RPC method can be used locate transactions this way.

### Label

A single **label** field is allowed as an optional query parameter. The value must be a URL-encoded string that describes the source of the payment request.

For example, this might be the name of a merchant, a store, an application, or a user making the request. Wallets should display the label to the user.

### Message

A single message field is allowed as an optional query parameter. The value must be a URL-encoded string that describes the nature of the payment request.

For example, this might be the name of an item being purchased. Wallets should display the message to the user.

### Memo

A single memo field is allowed as an optional query parameter. The value must be a URL-encoded string that will be included in an [SPL Memo](https://spl.solana.com/memo) instruction in the payment transaction.

Wallets should display the memo to the user. The SPL Memo instruction must be included immediately before the SOL or SPL Token transfer instruction to avoid ambiguity with other instructions in the transaction.

### Example

- Transfer of 1 SOL:

  ```js
  solana:mvines9iiHiQTysrwkJjGf2gb9Ex9jXJX8ns3qwf2kN?amount=1&label=Michael&message=Thanks%20for%20all%20the%20fish&memo=OrderId1234
  ```

- Transfer of 0.01 USDC
  ```js
  solana:mvines9iiHiQTysrwkJjGf2gb9Ex9jXJX8ns3qwf2kN?amount=0.01&spl-token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&label=Michael&message=Thanks%20for%20all%20the%20fish&memo=OrderId5678
  ```

### Transaction Request [Source](https://docs.solanapay.com/core/transaction-request/overview)

![general-image](https://docs.solanapay.com/assets/images/transaction-request-flow-dark-5bfeda8bfaf7cc66a89aed62b1b2db60.png)

**Best Practices [Source](https://docs.solanapay.com/core/transaction-request/merchant-integration)**

1. Customer goes to the payment page
2. Merchant frontend (client) sends order information to the backend
3. Merchant backend (server) generates a reference public key and stores it in a database with the expected amount for the shopping cart / pending purchase (unique to each customer's checkout session).
4. Merchant backend redirects the user to the confirmation page with the generated reference public key.
5. The confirmation page redirects to the merchant with the transaction signature.
6. Merchant backend checks that the transaction is valid for the checkout session by validating the transaction with the reference and amount stored in step 3.

### Transfer Request [Source](https://docs.solanapay.com/core/transfer-request/overview)

**Web App to Mobile Wallet**
![image](https://docs.solanapay.com/assets/images/web-app-mobile-wallet-flow-dark-9b539ef48a77983233419dc0a8a51b95.png)

**Web App to Browser Wallet**
![image](https://docs.solanapay.com/assets/images/web-app-browser-wallet-dark-e45414f2f8471974d9226edd8191f220.png)

**Mobile App to Mobile Wallet**
![image](https://docs.solanapay.com/assets/images/mobile-app-mobile-wallet-flow-dark-7cfdb24237207bba52973c2939e84e37.png)

**Best practices**
![image](https://docs.solanapay.com/assets/images/transfer-request-best-practice-dark-51b7f36233131701e7f9b9b232f65f61.png)

1. Customer goes to the payment page
2. Merchant frontend (client) sends order information to the backend
3. Merchant backend (server) generates a reference public key and stores it in a database with the expected amount for the shopping cart / pending purchase (unique to each customer's checkout session).
4. Merchant backend redirects the user to the confirmation page with the generated reference public key.
5. The confirmation page redirects to the merchant with the transaction signature.
6. Merchant backend checks that the transaction is valid for the checkout session by validating the transaction with the reference and amount stored in step 3.

   The steps outlined above prevents:

   - A different transaction from being used to trick the merchant
   - The frontend from being manipulated to show a confirmed transaction

### [API Request Docs](https://docs.solanapay.com/api/core)
