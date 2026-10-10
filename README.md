# TouchGrass 🌱

**An AI whose success is measured by how quickly you stop using it.**

TouchGrass is a project built for the **Hacktoberfest '26 Open-Source AI Challenge — Week 1: Touch Grass**.

The idea is simple: instead of using AI to spend more time on a screen, use it to help you go outside. TouchGrass generates outdoor missions based on your preferences. Complete a mission, return to write about your experience, and optionally attach a photo as evidence.

The AI creates the mission. The real experience happens away from the screen.

## Live Demo

- **Live App:** https://touchgrass-delta-six.vercel.app/
- **Demo Video:** https://youtu.be/9seersnxmN4
- **Repository:** https://github.com/HarshAggarwal1/touchgrass

## Features

- **AI-generated missions:** Generate outdoor activities based on duration, difficulty, activity preferences, and setting.
- **Go Outside Mode:** Encourages you to put your phone away and focus on the real world.
- **Personal reflections:** Write about your experience after completing a mission.
- **Photo evidence:** Optionally attach a photo to a submission.
- **Mission history:** Review previous missions and reflections through My Submissions.
- **Browser-based persistence:** Submissions remain available after refreshing the page in the same browser.
- **Fallback missions:** Built-in missions keep the application usable when AI inference is unavailable.
- **Responsive interface:** A simple interface designed around spending less time on the screen.

## Screenshots

<!-- Keep your screenshots here. Replace or reorder them as needed. -->

<img width="42%" alt="TouchGrass home screen" src="https://github.com/user-attachments/assets/86dbadb6-a3fb-4059-9c43-faa95a230d55" />
<img width="42%" alt="TouchGrass mission interface" src="https://github.com/user-attachments/assets/eb50ff1e-001b-4981-acde-f5ef53fd2173" />
<img width="42%" alt="TouchGrass mission experience" src="https://github.com/user-attachments/assets/37056a47-28db-4de4-b403-76d21931838b" />
<img width="42%" alt="TouchGrass reflection interface" src="https://github.com/user-attachments/assets/138f3685-706a-4c97-b013-b9187ac9b064" />
<img width="42%" alt="TouchGrass submissions interface" src="https://github.com/user-attachments/assets/d40a45f6-00b9-43d2-b2d2-a9c3fc4d0257" />

## Tech Stack

| Component | Technology |
|---|---|
| Frontend | React, Vite, CSS |
| Backend | Node.js, Express |
| Hosted AI inference | Hugging Face Inference Providers |
| AI model | Configurable through `HF_MODEL` |
| Local AI runtime | Ollama, if using the local development integration |
| Storage | Browser `localStorage` |
| Frontend deployment | Vercel |
| Backend deployment | Render |

## How It Works

1. The user selects their preferences for an outdoor activity.
2. The frontend sends the preferences to the Express backend.
3. The backend requests a mission from the configured AI inference provider.
4. The backend validates the response and returns the generated mission.
5. If inference fails or the response is invalid, the backend can return a built-in fallback mission.
6. The user enters Go Outside Mode and completes the activity away from the screen.
7. After returning, the user can write a reflection and optionally attach photo evidence.
8. The submission is saved in browser storage and can be viewed through My Submissions.

## Getting Started

### Requirements

- Node.js 18 or newer
- npm
- Git

For hosted inference, you also need a Hugging Face account and a token with the required Inference Providers permissions.

For local Ollama development, you additionally need [Ollama](https://ollama.com/download) and the model configured in your local backend.

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

Create the environment files required by your local setup. Use `.env.example` as a reference if it is present in the repository.

For the hosted Hugging Face backend, the server configuration uses variables similar to:

```dotenv
PORT=8787
FRONTEND_URL=http://localhost:5173
HF_TOKEN=your_hugging_face_token
HF_MODEL=google/gemma-2-2b-it
```

The model value above is an example. Choose a model supported by an inference provider available to your account.

For the frontend, configure the backend URL using Vite's environment variable:

```dotenv
VITE_API_URL=http://localhost:8787
```

**Security notes:**

- Never commit real API tokens or secrets to Git.
- Keep backend credentials in the server environment, not in frontend variables.
- Variables prefixed with `VITE_` are exposed to the browser bundle and must not contain secrets.
- Keep `.env` files out of version control.

### 4. Start the application

```bash
npm run dev
```

This command starts the frontend and backend together if the project's dependencies and scripts are configured accordingly.

The frontend normally runs at:

http://localhost:5173

The backend normally runs at:

http://localhost:8787

On Windows PowerShell, if script execution causes an npm command issue, try:

```powershell
npm.cmd install
npm.cmd run dev
```

### Optional: Local Ollama Setup

If the current codebase retains the local Ollama integration:

1. Install [Ollama](https://ollama.com/download).
2. Download the model configured in your local backend.
3. Make sure Ollama is running.
4. Configure the backend to use the local inference path.
5. Start the application with `npm run dev`.

For example, if the configured model is `gemma4:e2b`:

```bash
ollama pull gemma4:e2b
```

Use the model name expected by your actual local backend configuration.

## Deployment

TouchGrass uses a separate frontend and backend deployment.

### Frontend — Vercel

Deploy the React/Vite application to [Vercel](https://vercel.com/).

Configure the following environment variable in the Vercel project:

```dotenv
VITE_API_URL=https://your-render-backend-url
```

Replace the example URL with your deployed Render backend URL. Rebuild the frontend after changing environment variables.

### Backend — Render

Deploy the Express server to [Render](https://render.com/).

Typical settings for a repository with `package.json` at its root:

- **Build command:** `npm install`
- **Start command:** `npm start`
- **Root directory:** Leave blank if the backend and `package.json` are at the repository root.

Configure the required backend environment variables in Render:

```dotenv
FRONTEND_URL=https://touchgrass-delta-six.vercel.app
HF_TOKEN=your_hugging_face_token
HF_MODEL=your_supported_model_id
```

Use the actual deployed frontend URL and a model supported by your enabled inference provider. Never put the Hugging Face token in the frontend configuration.

## Checking the AI Integration

### Health endpoint

When the backend is running locally, open:

http://localhost:8787/api/health

For a deployed backend, open:

`https://your-render-backend-url/api/health`

The response should indicate whether the server is running and whether its hosted inference configuration is present. The exact fields depend on the active backend implementation.

A configured token does not guarantee that the model can generate a response.

### Inspect mission generation

1. Open the app in your browser.
2. Open Developer Tools using `F12`.
3. Select the **Network** tab and filter by **Fetch/XHR**.
4. Generate a mission.
5. Select the `POST /api/mission` request and inspect its response.

The `source` field indicates which path was used:

- `hosted-model`: The hosted AI generated the mission.
- `local-model`: The local model generated the mission, if local mode is supported.
- `built-in-fallback`: A predefined mission was returned instead of a successful model-generated mission.

A `200 OK` response does not necessarily mean AI inference succeeded. Check both the `source` field and the backend logs.

## Storage and Privacy

TouchGrass stores mission submissions, reflections, and photo evidence in the browser using `localStorage`.

Consequently:

- Data is associated with the browser and device being used.
- Submissions are not automatically synchronized across devices.
- Clearing browser data may remove saved submissions.
- The application does not use a remote database for these submissions in its current design.

Generating a mission sends the selected preferences to the backend. When hosted inference is enabled, the backend forwards the required prompt and data to the configured inference provider.

Avoid including sensitive personal information in mission requests or reflections sent to external services.

## Current Limitations

- Hosted AI availability depends on the selected model, inference provider, account permissions, quotas, and available credits.
- When hosted inference fails, the backend may return a built-in fallback mission.
- Local Ollama mode, if retained, requires a compatible local model and sufficient system resources.
- Submissions are browser-local and are not backed by a cloud database or user account.
- Saved submissions do not automatically transfer between browsers or devices.

## Hacktoberfest '26 — Week 1 Challenge

TouchGrass was built for the **Hacktoberfest Open-Source AI Challenge — Week 1: Touch Grass**.

The project explores how open-source AI and open-weight models can encourage people to spend less time on screens and more time engaging with the real world.

**Challenge:** [Hacktoberfest Week 1 — Touch Grass](https://dev.to/challenges/hacktoberfest-week1-2026-10-05)

**Project idea:** AI creates the mission, but the actual activity happens away from the screen.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.