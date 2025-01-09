# Note: This a project that I made with other people, using hungumass as the account, all of my contributions are over there, this is just for display
## Getting Started

To get started with the project, follow these instructions:

### Installation

First, navigate to the server folder:

```
cd back-end
```

Run the following command to install the necessary dependencies for the back-end:

```
npm install
```

To navigate into the project folder, run:

```
cd ..
cd front-end
```

Run the following command to install the necessary dependencies for the project:

```
npm install
```

And for testing:

```
npm install --save-dev jest
npm install --save-dev jest-environment-jsdom
```

### Setting up the Environment

Create a .env file in the root directory of the `back-end` folder.

In this file, insert the following code and fill in the blank sections with the client ID, client secret, and a session secret you devise. If you do not yet have these IDs and secrets, please reach out to someone on the dev team.

```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
SESSION_SECRET=...
```

### Running the Application

First, navigate to the `back-end` folder:

```
cd back-end
```

After the dependencies are installed, you can start the server by running:

```
npm start
```

Then, navigate to the `front-end` folder:

```
cd ..
cd front-end
```

Next, start the application by running:

```
npm start
```

### Testing

To ensure everything is working correctly, you may run tests with the following command from the `front-end` folder:

```
npm test
```
