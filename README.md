# TouchGrass 🌱

**An AI whose success is measured by how quickly you stop using it.**

TouchGrass was built for the [Hacktoberfest '26 Week 1: Touch Grass challenge](https://dev.to/challenges/hacktoberfest-week1-2026-10-05).

The idea is to use AI for something that gets people away from their screens. TouchGrass generates outdoor missions based on your preferences. You can complete a mission, return to write a reflection, and optionally attach a photo of your experience.

## Live Demo

- **App:** https://touchgrass-delta-six.vercel.app/
- **Demo video:** https://youtu.be/9seersnxmN4
- **Source code:** https://github.com/HarshAggarwal1/touchgrass

## Features

- Generate outdoor missions based on activity, duration, difficulty, and setting.
- Enter Go Outside Mode to focus on the activity instead of the screen.
- Write reflections after completing a mission.
- Optionally attach photo evidence.
- View previous missions and reflections in My Submissions.
- Keep submissions saved across page refreshes using browser storage.
- Fall back to predefined missions when AI generation fails.

## Screenshots

<img width="42%" alt="TouchGrass home screen" src="https://github.com/user-attachments/assets/86dbadb6-a3fb-4059-9c43-faa95a230d55" />
<img width="42%" alt="Mission generation" src="https://github.com/user-attachments/assets/eb50ff1e-001b-4981-acde-f5ef53fd2173" />
<img width="42%" alt="Outdoor mission" src="https://github.com/user-attachments/assets/37056a47-28db-4de4-b403-76d21931838b" />
<img width="42%" alt="Mission reflection" src="https://github.com/user-attachments/assets/138f3685-706a-4c97-b013-b9187ac9b064" />
<img width="42%" alt="My Submissions" src="https://github.com/user-attachments/assets/d40a45f6-00b9-43d2-b2d2-a9c3fc4d0257" />

## Tech Stack

- **Frontend:** React, Vite, CSS
- **Backend:** Node.js, Express
- **AI inference:** Hugging Face Inference Providers
- **Model:** Configured through `HF_MODEL`
- **Storage:** Browser `localStorage`
- **Deployment:** Vercel (frontend), Render (backend)

## How It Works

1. Choose your preferences for an outdoor activity.
2. The frontend sends them to the Express backend.
3. The backend requests a mission from the configured AI model.
4. The mission is validated and returned to the frontend.
5. If AI generation fails, the backend can return a predefined mission.
6. Complete the activity away from the screen.
7. Return to write a reflection and optionally attach a photo.
8. Find your saved submission in My Submissions.

## Run Locally

### Requirements

- Node.js 18 or newer
- npm
- A Hugging Face account and an API token with Inference Providers permission

### 1. Clone the repository

```bash
git clone https://github.com/HarshAggarwal1/touchgrass.git
cd touchgrass
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Configure the backend using the environment variables expected by `server/index.js`. For the current hosted inference setup, these include:

```dotenv
PORT=8787
FRONTEND_URL=http://localhost:5173
HF_TOKEN=your_hugging_face_token
HF_MODEL=your_supported_model_id
```

For the frontend, configure the backend URL:

```dotenv
VITE_API_URL=http://localhost:8787
```

Use the model ID supported by your enabled inference provider. Refer to `.env.example` if it is present in the repository.

**Keep your API token private.** Do not commit it to GitHub or expose it through a `VITE_` environment variable.

### 4. Start the application

```bash
npm run dev
```

The frontend normally runs at http://localhost:5173 and the backend at http://localhost:8787.

On Windows, if PowerShell has trouble running npm scripts, try:

```powershell
npm.cmd install
npm.cmd run dev
```

## Deployment

The frontend and backend are deployed separately.

### Vercel

Set the following environment variable in your Vercel project:

```dotenv
VITE_API_URL=https://your-render-backend-url
```

Replace the example with your actual Render backend URL, then redeploy the frontend.

### Render

Configure the backend's build command as `npm install` and its start command as `npm start`, assuming `package.json` is at the repository root.

Set these backend environment variables in Render:

```dotenv
FRONTEND_URL=https://touchgrass-delta-six.vercel.app
HF_TOKEN=your_hugging_face_token
HF_MODEL=your_supported_model_id
```

Use your actual model ID and never commit the token to the repository.

## Checking AI Generation

Open the backend health endpoint:

```text
http://localhost:8787/api/health
```

For the deployed application, use the equivalent URL for your Render service.

To inspect mission generation:

1. Open the app and press `F12`.
2. Select **Network → Fetch/XHR**.
3. Generate a mission.
4. Open the `POST /api/mission` response.

Check the `source` field:

- `hosted-model`: The hosted model generated the mission.
- `built-in-fallback`: The backend returned a predefined mission instead.

A successful HTTP response alone does not guarantee that AI inference succeeded.

## Storage and Privacy

TouchGrass stores submissions, reflections, and photo evidence in browser `localStorage`. The data stays associated with that browser and device and is not automatically synchronized across devices.

Mission generation sends the selected preferences to the backend. When hosted inference is used, the backend sends the required prompt and input to the configured inference provider.

Avoid including sensitive personal information in mission requests.

## Limitations

- Hosted inference depends on model availability, provider access, rate limits, and available credits.
- Failed or invalid AI responses can result in predefined fallback missions.
- Submissions are stored locally rather than in a cloud database.
- Clearing browser data may remove saved submissions.

## Hacktoberfest '26 — Week 1 Challenge

TouchGrass was built for the [Hacktoberfest Week 1: Touch Grass challenge](https://dev.to/challenges/hacktoberfest-week1-2026-10-05).

The project uses **Gemma** for AI-generated outdoor missions, **Vercel** to host the frontend, and **Render** to run the backend.

The goal is to use AI to encourage people to spend less time on screens and more time outside. The model creates the mission; the user completes it in the real world.

**Technologies showcased:** Gemma, Vercel and Render.

## License

MIT License. See [LICENSE](LICENSE) for details.