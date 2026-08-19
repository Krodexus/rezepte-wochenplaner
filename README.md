# Weekly Food Planner

A simple web application for planning meals throughout the week, so you don't forget why that cabbage is in your fridge.

Instead of keeping meal plans scattered across notes, messages, or shopping lists, the Weekly Food Planner provides one structured place to organize upcoming meals and keep track of what you planned for each day.

## Features

* Create and manage planned meals
* Assign meals to specific days of the week
* Categorize meals by type, such as breakfast, lunch, or dinner
* Add additional information such as expiration dates or recipe sources
* Reorder or move meals between days
* Clear the weekly plan and start a new week
* Create a personal account to securely access your own planner and share it with your family (or your emotional support animal)

## Motivation

You may be asking why I built this (but you probably didn't until now): Basically, I regularly plan meals and groceries several days in advance, but noticed that keeping everything organized in a generic notes app quickly becomes inconvenient.

➡️ Which lead to the goal of
**making weekly meal planning faster, clearer, and easier to maintain changes.**

*At the same time, the project serves as a practical exercise in building a complete database-backed web application, including authentication, validation, authorization, persistence, and deployment.*

## Implementation
### Tech Stack

* **Next.js** – application framework
* **React** – user interface
* **TypeScript** – application logic
* **Tailwind CSS** – styling
* **PostgreSQL / Neon** – database
* **Prisma** – ORM
* **Zod** – Input validation
* **Auth.js** – authentication
* **Vercel** – hosting and deployment

### Core Architecture

Each registered user has access to their own personal weekly planner.

Planner entries are stored in a PostgreSQL database and associated with the authenticated user. Server-side authorization ensures that users can only access or modify their own data.

User input is validated with Zod before being written to the database.

A simplified request flow looks like this:

`User Interface → Server Function → Authentication → Validation → Authorization → Prisma → PostgreSQL`

## Running the Project Locally

Clone the repository:

```bash
git clone <repository-url>
cd weekly-food-planner
```

Install dependencies and generate prisma schema:

```bash
npm install && npx prisma generate
```

Create the required environment variables in `.env` and configure the database and authentication credentials.

Run the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Future Ideas?

I might add some of these potential future improvements:

* integration with a recipe database
* automatic grocery-list generation
* drag-and-drop meal planning
* nutritional information
* AI-assisted meal suggestions


