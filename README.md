# Stock Market Simulation Game

This project is a web-based game designed to simulate the complexities of stock market trading. Users can compete against each other in real-time to buy and sell stocks based on historical market data, aiming to maximize their profits. The game's primary goal is to provide an educational platform where users can learn about stock market dynamics and improve their trading decisions without financial risk.

## Key Features

- **Multiplayer Functionality:** Compete in real-time trading simulations against other players.
- **Dynamic Game Modes:** Create or join invite-only games to challenge friends or other traders.
- **Interactive Trading Interface:** Buy and sell stocks using an intuitive interface that displays real-time orders and market movements.
- **Educational Resources:** Learn from quizzes, resources, and recent market news to improve your trading knowledge.
- **Statistics and Leaderboards:** Track your performance through detailed game statistics and compare your progress on leaderboards.
- **User Authentication:** Secure login, registration, and password management using Clerk.
- **Interactive Graphs:** Visualize stock price changes and market trends during each game session.

## Getting Started with Development

### Technology Stack

- **Frontend:** ReactJS with TypeScript, Next.js
- **Backend:** Node.js with Next.js
- **Database:** MongoDB
- **Styling:** Material UI, Tailwind CSS

### Setup

As a prerequisite step, ensure that you have setup a MongoDB database called "stockquest", the application will populate all required collections. This database can either be a local MongoDB Community Server instance or a MongoDB Atlas Instance.

**Step 1 :** First, clone the repository into your local environment <br/>

```
git clone https://github.com/UOA-CS732-SE750-Students-2024/project-group-xylophone-xeruses.git
```

**Step 2 :** Open the terminal and run the following commands:

```
cd project-group-xylophone-xeruses
npm install
```

**Step 3:** Setup .env file

Run the following command

```
cp .env.example .env
```

In the new .env file enter the provided variables

**Step 4 :** Run the command `npm run dev` and open the web browser

Visit http://localhost:3000 in your browser to check the web browser running.

### Testing

Running the command `npm run test` will run the test suite for the project.

## Where can I get more help, if I need it?

For additional assistance, please contact our friendly developers:

| Name              | Email                     |
| ----------------- | ------------------------- |
| Michael Hardy     | mhar860@aucklanduni.ac.nz |
| Ben Martin        | bmar268@aucklanduni.ac.nz |
| Dylan Heron       | dher577@aucklanduni.ac.nz |
| Michael Howell    | mhow865@aucklanduni.ac.nz |
| Young Min Kim     | ykim583@aucklanduni.ac.nz |
| Devesh Duptala    | ddup656@aucklanduni.ac.nz |
| Jackson Schofield | jsch790@aucklanduni.ac.nz |

## Acknowledgements

This project was showcased to peers in the SE 750 course, coordinated by Andrew Meads, as part of our academic curriculum. We extend significant appreciation to the API providers for their invaluable resources and to our developers, testers, and all contributors involved.
