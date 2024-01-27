
# Adventure Finder

This application is a NestJS-based command line utility that sends the current temperature of the Limmat river in Zurich along with an encouraging message in German to a specified WhatsApp number. The temperature data is fetched from [HydroProWeb](https://hydroproweb.zh.ch/Listen/AktuelleWerte/AktWassertemp.html), and the encouraging message is generated using ChatGPT, powered by OpenAI.

## Features

- Fetches the current water temperature of the Limmat river in Zurich.
- Generates an encouraging message in German using ChatGPT.
- Sends the combined message (temperature + encouraging message) to a specified WhatsApp number.

## Setup and Installation

### Requirements

- Node.js (Version 21 recommended)
- A NestJS environment
- An OpenAI API key for ChatGPT message generation
- A WhatsApp number and a CallMeBot API key for message sending

### Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Install Dependencies**

   Run `npm install` to install the required packages.

3. **Set Environment Variables**

   You need to set up the following environment variables:
    - `OPENAI_API_KEY`: Your OpenAI API key for accessing ChatGPT.
    - `PHONE_NUMBER`: The WhatsApp number where the message will be sent.
    - `CALL_ME_BOT_API_KEY`: Your CallMeBot API key for sending WhatsApp messages.

   These can be set in a `.env` file in your project root or configured as secrets in your GitHub repository for GitHub Actions.

4. **Build the Project**

   Compile the TypeScript source code to JavaScript using NestJS CLI:

   ```bash
   npm run build
   ```

5. **Run the Command**

   Execute the command to send the WhatsApp message:

   ```bash
   npm run start:prod -- generate-ice-bath-message
   ```

## GitHub Action: Automated Message Dispatch

The GitHub Action `Run NestJS Command` is configured to automate the execution of the `generate-ice-bath-message` command under certain conditions.

### Trigger Conditions

- **On Push/Pull Request to Main Branch**: The action is triggered whenever code is pushed to the main branch or a pull request is made against it.
- **Scheduled Runs**: Additionally, the command is scheduled to run automatically at 09:00 UTC every day.

### Jobs and Steps

1. **Checkout**: The latest code is checked out from the main branch.
2. **Set up Node.js**: Node.js is set up with the specified version (21), ensuring compatibility.
3. **Install Dependencies**: All project dependencies are installed using `npm ci` for a clean installation.
4. **Build the Project**: The project is built using `npm run build`, compiling the TypeScript code.
5. **Run NestJS Command**: The `generate-ice-bath-message` command is executed with necessary environment variables (`OPENAI_API_KEY`, `PHONE_NUMBER`, `CALL_ME_BOT_API_KEY`) provided from the repository's secrets.

This GitHub Action ensures that the application can automatically send out messages based on the schedule or code updates, keeping the information flow automated and up-to-date.