import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const PORT = process.env.PORT || 8787;
const MODEL = process.env.OLLAMA_MODEL || 'gemma4:e2b';
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';

const fallbackMission = ({ duration = 30, activity = 'Explore', difficulty = 'Easy', setting = 'Park' } = {}) => {
  const activities = {
    Walk: [
      'Walk for 8 minutes without checking your phone. Notice how the route changes.',
      'Find a detail on a building or tree you have passed before but never noticed.',
      'Pause safely and identify five distinct sounds around you.',
      'Choose a return route that is different from the way you came.'
    ],
    Nature: [
      'Find three different leaf shapes without picking or damaging plants.',
      'Stand still for two minutes and notice movement in the environment.',
      'Identify five distinct sounds, natural or human-made.',
      'Find one small natural detail you would normally walk past.'
    ],
    Explore: [
      'Walk in a safe public area and notice one detail you have never seen before.',
      'Find three things with different textures, without disturbing anything.',
      'Look for an interesting pattern in architecture, plants, or shadows.',
      'Sit somewhere safe for five minutes and observe the place.'
    ],
    Exercise: [
      'Begin with a comfortable five-minute walk to warm up.',
      'Walk briskly for intervals that feel comfortable for your fitness level.',
      'Take a short pause, breathe normally, and notice your surroundings.',
      'Finish at an easy pace. Stop if you feel pain, dizziness, or unwell.'
    ]
  };
  const tasks = activities[activity] || activities.Explore;
  return {
    title: ({ Walk: 'The Unhurried Loop', Nature: 'The Field Observer', Explore: 'The Curious Wanderer', Exercise: 'The Moving Hour' }[activity] || 'The Curious Wanderer'),
    tagline: 'The screen has done its job. Now the world gets a turn.',
    duration: Number(duration),
    difficulty,
    setting,
    missions: tasks,
    closing_note: 'Put your phone away somewhere safe. Stay in public, familiar areas and follow local safety guidance.'
  };
};

app.get('/api/health', async (_req, res) => {
  let ollama = false;
  let modelAvailable = false;
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(1200) });
    if (response.ok) {
      ollama = true;
      const body = await response.json();
      modelAvailable = (body.models || []).some(m => m.name === MODEL || m.name.startsWith(`${MODEL.split(':')[0]}:`));
    }
  } catch {}
  res.json({ ok: true, ollama, modelAvailable, model: MODEL });
});

app.post('/api/mission', async (req, res) => {
  const input = req.body || {};
  const duration = Math.min(120, Math.max(10, Number(input.duration) || 30));
  const activity = ['Walk', 'Explore', 'Nature', 'Exercise'].includes(input.activity) ? input.activity : 'Explore';
  const difficulty = ['Easy', 'Medium', 'Adventurous'].includes(input.difficulty) ? input.difficulty : 'Easy';
  const setting = ['Park', 'City streets', 'Garden', 'Trail'].includes(input.setting) ? input.setting : 'Park';

  const prompt = `Create a safe, screen-free outdoor mission as JSON only.
User preferences: duration=${duration} minutes, activity=${activity}, difficulty=${difficulty}, setting=${setting}.
Rules:
- The mission must get the user physically outside and away from the screen.
- Return 4 practical, specific tasks that fit the duration.
- Do not require internet, purchases, specialized equipment, trespassing, picking plants, approaching wildlife, or unsafe behavior.
- Keep tasks accessible and suitable for a public, familiar location.
- Do not claim to know live weather, exact location, species, or conditions.
- The phone should only be used to read the mission before leaving and optionally record a reflection afterward.
- Return valid JSON with exactly these keys: title (string), tagline (string), duration (number), difficulty (string), setting (string), missions (array of 4 strings), closing_note (string).
- duration must be ${duration}; difficulty must be "${difficulty}"; setting must be "${setting}".`;

  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODEL, prompt, stream: false, format: 'json', options: { temperature: 0.75 } }),
      signal: AbortSignal.timeout(90000)
    });
    if (!response.ok) throw new Error(`Ollama returned ${response.status}`);
    const data = await response.json();
    const parsed = JSON.parse(data.response);
    if (!parsed.title || !Array.isArray(parsed.missions) || parsed.missions.length < 3) throw new Error('Model output did not match mission schema');
    res.json({ ...parsed, duration, difficulty, setting, source: 'local-model', model: MODEL });
  } catch (error) {
    res.json({ ...fallbackMission({ duration, activity, difficulty, setting }), source: 'built-in-fallback', model: MODEL, note: 'Local model unavailable; using a built-in mission. Start Ollama and pull the configured model to enable AI generation.' });
  }
});

app.listen(PORT, () => console.log(`TouchGrass API running at http://localhost:${PORT}`));
