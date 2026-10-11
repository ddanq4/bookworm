# Bookworm

A web app for browsing and reading books and keeping your own library.

Books are loaded from [Gutendex](https://gutendex.com) (a catalogue of Project Gutenberg). Accounts and each user's library are stored in Firebase.

[Video overview](https://youtu.be/KJjo-WV1sQY)

## Screenshots

<p align="center">
  <img src="https://raw.githubusercontent.com/danylokiri/bookworm/assets/screenshots/home.jpg" alt="Book catalogue with search" width="49%">
  <img src="https://raw.githubusercontent.com/danylokiri/bookworm/assets/screenshots/book-details.jpg" alt="Book details" width="49%">
</p>
<p align="center">
  <img src="https://raw.githubusercontent.com/danylokiri/bookworm/assets/screenshots/reader.jpg" alt="Built-in reader" width="49%">
</p>

## Features

- Search and browse the book catalogue
- Book details in a modal window
- Registration and sign-in (Firebase Authentication)
- Personal library with reading statuses
- Built-in reader page
- Unit tests for the main components and pages (Jest), CI on CircleCI

## Tech stack

Next.js (pages router), React, Firebase (Auth + Firestore), CSS Modules, Jest.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

| Command | Description |
|---|---|
| `npm run build` | production build |
| `npm start` | run the production build |
| `npm run lint` | lint |
| `npm test` | run the tests |

## Project structure

```
src/
  components/   UI components (BookCard, BookModal, Header, ...)
  firebase/     Firebase initialisation, auth and Firestore helpers
  pages/        routes: home, library, reader, account, auth
  styles/       global styles
__tests__/      component and page tests
```
