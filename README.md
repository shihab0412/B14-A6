# FitLog — Workout Library

FitLog is a responsive workout library web application built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- Browse available workouts.
- View workout details.
- Add workouts to My Plan.
- Save workouts for later.
- Track completed workouts.
- Responsive design for mobile, tablet, and desktop.
- Store plan, saved, and completed workouts using browser localStorage.
- Fetch workout data from an API with fallback support.

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- REST API
- Browser localStorage

## Getting Started

### Prerequisites

Install Node.js and npm before running the project.

### Installation

Install the project dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API

Primary API:

`https://api.abcz.workers.dev/api/fitlog`

Fallback API:

`https://api.api-store.workers.dev/api/fitlog`

## Local Storage

The application uses browser localStorage with these keys:

- `fitlog-plan` — workouts added to My Plan
- `fitlog-saved` — saved workouts
- `fitlog-completed` — completed workouts

## Responsive Design

FitLog is designed to work across mobile phones, tablets, and desktop screens.

## Build

Create a production build by running:

```bash
npm run build
```

## Deployment

This project can be deployed on [Vercel](https://vercel.com/).

## Project Information

**Project name:** FitLog — Workout Library

**Framework:** Next.js .
