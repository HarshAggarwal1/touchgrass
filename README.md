# TouchGrass 🌱

**An AI whose success is measured by how quickly you stop using it.**

TouchGrass is a small project I built for the **Hacktoberfest '26 Open-Source AI Challenge — Week 1: Touch Grass**.

The idea is simple: instead of using AI to spend more time on a screen, why not use it to help us go outside? TouchGrass generates outdoor missions based on your preferences. You can complete a mission, come back, write about your experience, and optionally upload a photo as evidence.

## Features

- Generate outdoor missions based on activity, duration, difficulty, and setting.
- Use Gemma locally through Ollama to generate missions.
- Go Outside Mode to encourage users to put their phones away.
- Add a reflection after completing a mission.
- Optionally attach photo evidence to a submission.
- View previous missions and reflections in My Submissions.
- Save submissions in the browser so they remain available after refreshing the page.
- Use built-in fallback missions when the local AI model is unavailable.

## Screenshots

<img width="42%" alt="image" src="https://github.com/user-attachments/assets/86dbadb6-a3fb-4059-9c43-faa95a230d55" />
<img width="42%" alt="image" src="https://github.com/user-attachments/assets/eb50ff1e-001b-4981-acde-f5ef53fd2173" />
<img width="42%" alt="image" src="https://github.com/user-attachments/assets/37056a47-28db-4de4-b403-76d21931838b" />
<img width="42%" alt="image" src="https://github.com/user-attachments/assets/138f3685-706a-4c97-b013-b9187ac9b064" />
<img width="42%" alt="image" src="https://github.com/user-attachments/assets/d40a45f6-00b9-43d2-b2d2-a9c3fc4d0257" />
<img width="42%" alt="image" src="https://github.com/user-attachments/assets/88103c5d-74e4-4217-994f-3eb629bc0824" />
<img width="42%" alt="image" src="https://github.com/user-attachments/assets/ec2c3649-8d6f-494d-bebf-243e1c3168b5" />
<img width="42%" alt="image" src="https://github.com/user-attachments/assets/b5e377d6-4dd3-42fc-8723-c3be3c6f94c9" />
<img width="42%" alt="image" src="https://github.com/user-attachments/assets/04242ee9-8deb-43e5-82b3-9d6232fb0d5b" />

## Live Links

- **Demo Video:** https://youtu.be/9seersnxmN4

## Tech Stack

- **Frontend:** React, Vite, CSS
- **Backend:** Node.js, Express
- **AI model:** Gemma (`gemma4:e2b`)
- **Local AI runtime:** Ollama
- **Storage:** Browser localStorage

## Getting Started

### Requirements

- Node.js 18 or newer
- npm
- [Ollama](https://ollama.com/download)
- Enough memory and disk space to run the Gemma model

### 1. Clone the repository

```bash
git clone https://github.com/HarshAggarwal1/touchgrass.git
cd touchgrass
```

### 2. Download the model

```bash
ollama pull gemma4:e2b
```

Make sure Ollama is installed and running before starting the application.

### 3. Install dependencies

```bash
npm install
```

### 4. Start the application

```bash
npm run dev
```

Open the frontend URL shown in the terminal. It is normally:

http://localhost:5173

The Express API normally runs at:

http://localhost:8787

### Windows PowerShell

If PowerShell blocks the npm script, try:

```powershell
npm.cmd install
npm.cmd run dev
```

## How It Works

1. The user chooses the type of outdoor activity and other preferences.
2. The frontend sends these preferences to the Express backend.
3. The backend asks the local Gemma model through Ollama to generate a mission.
4. The generated mission is displayed in the app.
5. The user enters Go Outside Mode and goes outdoors.
6. After returning, the user can write a reflection and attach photo evidence.
7. The saved submission can be viewed later in My Submissions.

If Ollama is unavailable or the model response cannot be used, the application can generate a fallback mission instead.

## Checking the AI Integration

Open the following URL while the backend is running:

http://localhost:8787/api/health

This endpoint reports whether Ollama and the configured model are available.

You can also open the browser's Developer Tools, go to the Network tab, and inspect the response from `POST /api/mission`.

- `source: local-model` indicates that the request used the local model path.
- `source: built-in-fallback` indicates that the fallback generator was used.

## Storage and Privacy

Mission submissions, reflections, and photo evidence are stored locally in the browser. They are not uploaded to a remote database by this application.

This means that the saved data is tied to the browser and device being used. It is not automatically synced across devices.

The app uses a local model through Ollama, so it does not require a paid AI API.

## Hacktoberfest '26 — Week 1 Challenge

This project was built for the **Hacktoberfest Open-Source AI Challenge, Week 1: Touch Grass**.

The challenge is about using open-source AI or open-weight models to encourage people to spend less time on screens and more time in the real world.

TouchGrass is my attempt at this idea: AI creates the mission, but the actual activity happens away from the screen.

**Challenge link:** [Hacktoberfest Week 1 — Touch Grass](https://dev.to/challenges/hacktoberfest-week1-2026-10-05)

**Prize category:** Best Use of Gemma, where applicable. The project uses Gemma locally through Ollama; the submission demo should show that the model actually generated the mission.

## Current Limitations

- Ollama and the model need to be installed locally.
- The app can use fallback missions if the AI model is unavailable.
- Submissions are stored in the browser and are not synced to an account or cloud database.
- Photo evidence is optional and is not independently verified by AI.
- A hosted demo is not currently available.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
