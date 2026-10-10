import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDownRight, ArrowLeft, ArrowRight, Check, Clock3, Compass, Leaf, MapPin, Moon, Sparkles, Sun, Wind, NotebookText, Trash2 } from 'lucide-react';
import './styles.css';

const defaults = { duration: 30, activity: 'Nature', difficulty: 'Easy', setting: 'Park' };

function App() {
  const [prefs, setPrefs] = useState(defaults);
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('tg-theme') || 'light'; }
    catch { return 'light'; }
  });
  const [screen, setScreen] = useState('home');
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checked, setChecked] = useState([]);
  const [reflection, setReflection] = useState('');
  const [rating, setRating] = useState('Good');
  const [evidence, setEvidence] = useState('');
  const [evidenceError, setEvidenceError] = useState('');
  const [startedAt, setStartedAt] = useState(null);
  const [stats, setStats] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tg-stats')) || { missions: 0, minutes: 0, discoveries: 0 }; }
    catch { return { missions: 0, minutes: 0, discoveries: 0 }; }
  });
  const [health, setHealth] = useState({ ollama: false, modelAvailable: false, model: 'gemma4:e2b' });
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tg-history') || '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('tg-theme', theme); } catch {}
  }, [theme]);

  useEffect(() => {
    fetch('/api/health').then(r => r.json()).then(setHealth).catch(() => {});
  }, []);

  const updatePref = (key, value) => setPrefs(prev => ({ ...prev, [key]: value }));

  async function createMission() {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/mission', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs)
      });
      if (!res.ok) throw new Error('Could not generate mission');
      const data = await res.json();
      setMission(data); setChecked([]); setScreen('mission');
    } catch {
      setError('Could not reach the local app server. Run the project using npm run dev.');
    } finally { setLoading(false); }
  }

  function beginOutside() {
    setStartedAt(Date.now());
    setScreen('go');
  }

  async function handleEvidenceChange(event) {
    const file = event.target.files?.[0];
    setEvidenceError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) { setEvidenceError('Choose an image file.'); return; }
    if (file.size > 12 * 1024 * 1024) { setEvidenceError('Choose an image under 12 MB.'); return; }
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const image = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = dataUrl;
      });
      const scale = Math.min(1, 1200 / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
      setEvidence(canvas.toDataURL('image/jpeg', 0.78));
    } catch { setEvidenceError('Could not read that image. Try another photo.'); }
  }

  function finishMission() {
    const record = { id: Date.now(), completedAt: new Date().toISOString(), title: mission.title, duration: mission.duration, setting: mission.setting, rating, reflection: reflection.trim(), evidence };
    const nextHistory = [record, ...history].slice(0, 20);
    try {
      localStorage.setItem('tg-history', JSON.stringify(nextHistory));
      setHistory(nextHistory);
    } catch { setEvidenceError('Your browser storage is full. Remove the photo or use a smaller image, then try saving again.'); return; }
    const next = {
      missions: stats.missions + 1,
      minutes: stats.minutes + (startedAt ? Math.max(1, Math.min(mission.duration, Math.round((Date.now() - startedAt) / 60000))) : mission.duration),
      discoveries: stats.discoveries + (reflection.trim() ? 1 : 0)
    };
    setStats(next);
    localStorage.setItem('tg-stats', JSON.stringify(next));
    setScreen('done');
  }

  function reset() {
    setMission(null); setReflection(''); setRating('Good'); setEvidence(''); setEvidenceError(''); setChecked([]); setScreen('home');
  }

  function deleteSubmission(id) {
    const nextHistory = history.filter(item => item.id !== id);
    try { localStorage.setItem('tg-history', JSON.stringify(nextHistory)); setHistory(nextHistory); }
    catch { setError('Could not update saved submissions in this browser.'); }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={reset} aria-label="TouchGrass home"><span className="brand-mark"><Leaf size={19}/></span> touchgrass<span className="brand-period">.</span></button>
        <div className="top-right"><button className="submissions-nav" onClick={() => { setHistory(() => { try { return JSON.parse(localStorage.getItem('tg-history') || '[]'); } catch { return []; } }); setScreen('submissions'); }}><NotebookText size={15}/> MY SUBMISSIONS <span>{history.length}</span></button><span className="local-pill"><span className={`status-dot ${health.modelAvailable ? 'live' : ''}`}></span>{health.modelAvailable ? 'LOCAL AI READY' : 'OFFLINE-FIRST MODE'}</span><button className="icon-button" onClick={() => setTheme(current => current === 'light' ? 'dark' : 'light')} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>{theme === 'light' ? <Moon size={18}/> : <Sun size={18}/>}</button></div>
      </header>

      {screen === 'home' && <main className="home">
        <div className="hero">
          <div className="eyebrow"><span className="eyebrow-line"></span> A SMALL REBELLION AGAINST THE FEED</div>
          <h1>Your screen<br/>has had <em>enough.</em></h1>
          <p className="hero-copy">A little AI. A real-world mission. Then you disappear into the world for a while.</p>
          <div className="hero-stats"><span><Wind size={16}/> Made for outside</span><span><Moon size={16}/> No endless feed</span><span><Leaf size={16}/> Locally generated</span></div>
        </div>

        <section className="builder-card">
          <div className="section-heading"><div><span className="step-label">01 / SET YOUR INTENTION</span><h2>What does outside look like today?</h2></div><div className="sun-icon"><Sun size={23}/></div></div>
          <div className="field-block"><label>HOW MUCH TIME DO YOU HAVE?</label><div className="choice-row">{[15,30,45,60].map(n=><button key={n} className={`choice ${prefs.duration===n?'selected':''}`} onClick={()=>updatePref('duration',n)}>{n}<small>min</small></button>)}</div></div>
          <div className="field-block"><label>WHAT ARE YOU IN THE MOOD FOR?</label><div className="activity-grid">
            {[
              {name:'Nature', desc:'Notice the little things', icon:Leaf},
              {name:'Walk', desc:'Move without a destination', icon:Wind},
              {name:'Explore', desc:'See familiar places anew', icon:Compass},
              {name:'Exercise', desc:'Get your body moving', icon:ArrowDownRight}
            ].map(item=>{const Icon=item.icon;return <button key={item.name} className={`activity-card ${prefs.activity===item.name?'selected':''}`} onClick={()=>updatePref('activity',item.name)}><span className="activity-icon"><Icon size={20}/></span><span className="activity-name">{item.name}</span><span className="activity-desc">{item.desc}</span><span className="radio-dot">{prefs.activity===item.name&&<span/>}</span></button>})}
          </div></div>
          <div className="two-fields"><div className="field-block"><label>YOUR SURROUNDINGS</label><div className="select-wrap"><MapPin size={16}/><select value={prefs.setting} onChange={e=>updatePref('setting',e.target.value)}><option>Park</option><option>City streets</option><option>Garden</option><option>Trail</option></select></div></div><div className="field-block"><label>ENERGY LEVEL</label><div className="select-wrap"><Sparkles size={16}/><select value={prefs.difficulty} onChange={e=>updatePref('difficulty',e.target.value)}><option>Easy</option><option>Medium</option><option>Adventurous</option></select></div></div></div>
          {error && <p className="error-text">{error}</p>}
          <button className="primary-button" onClick={createMission} disabled={loading}>{loading ? <><span className="spinner"/> MAKING YOUR MISSION</> : <>MAKE ME GO OUTSIDE <ArrowRight size={18}/></>}</button>
          <p className="privacy-note"><span className="privacy-dot"/> Your preferences stay on this device. No account. No feed. No fuss.</p>
        </section>

        <section className="bottom-strip"><div><span className="strip-number">01</span><span><b>AI makes the plan.</b><small>A mission shaped around your time and mood.</small></span></div><ArrowRight size={17}/><div><span className="strip-number">02</span><span><b>You leave the screen.</b><small>No checking off tasks while you walk.</small></span></div><ArrowRight size={17}/><div><span className="strip-number">03</span><span><b>The world happens.</b><small>Come back only when you're done.</small></span></div></section>
      </main>}

      {screen === 'submissions' && <main className="submissions-page">
        <button className="back-link" onClick={() => setScreen('home')}><ArrowLeft size={16}/> BACK HOME</button>
        <div className="eyebrow"><span className="eyebrow-line"></span> YOUR TIME OUTSIDE</div>
        <h1 className="submissions-title">My <em>submissions.</em></h1>
        <p className="submissions-intro">Your completed missions, reflections, and photo evidence saved on this device.</p>
        {history.length === 0 ? <div className="empty-submissions"><span className="empty-icon"><NotebookText size={25}/></span><h2>Nothing here yet.</h2><p>Complete an outdoor mission and save your field notes. Your submissions will appear here.</p><button className="primary-button" onClick={() => setScreen('home')}>MAKE MY FIRST MISSION <ArrowRight size={18}/></button></div> : <div className="submission-list">{history.map((item) => <article className="submission-card" key={item.id}><div className="submission-card-head"><div><span className="submission-date">{new Date(item.completedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span><h2>{item.title || 'Outdoor mission'}</h2></div><button className="delete-submission" onClick={() => deleteSubmission(item.id)} aria-label={`Delete submission ${item.title}`} title="Delete submission"><Trash2 size={17}/></button></div><div className="submission-meta"><span><Clock3 size={14}/>{item.duration} min</span><span><MapPin size={14}/>{item.setting}</span><span><Leaf size={14}/>{item.rating}</span></div>{item.evidence ? <img className="submission-photo" src={item.evidence} alt={`Photo evidence for ${item.title}`} /> : <div className="no-photo"><NotebookText size={18}/><span>No photo evidence attached</span></div>}{item.reflection && <div className="submission-reflection"><span className="stat-label">FIELD NOTE</span><p>{item.reflection}</p></div>}</article>)}</div>}
        <p className="storage-note">Stored locally in this browser only. Clearing browser data can remove these submissions; they are not synced across devices.</p>
      </main>}

      {screen === 'mission' && mission && <main className="mission-page">
        <button className="back-link" onClick={reset}><ArrowLeft size={16}/> BACK TO THE BEGINNING</button>
        <div className="mission-hero"><div className="eyebrow"><span className="eyebrow-line"></span> YOUR OUTSIDE PLAN</div><div className="mission-meta"><span><Clock3 size={15}/>{mission.duration} MINUTES</span><span><MapPin size={15}/>{mission.setting}</span><span><Sparkles size={15}/>{mission.difficulty}</span></div><h1>{mission.title || 'The Field Observer'}<span>.</span></h1><p>{mission.tagline || 'The screen has done its job. Now the world gets a turn.'}</p></div>
        <div className="task-list"><div className="task-list-head"><span>YOUR FIELD NOTES</span><span>{mission.missions.length} SMALL MISSIONS</span></div>{mission.missions.map((task,i)=><div className="task-row" key={i}><span className="task-num">0{i+1}</span><p>{task}</p><Leaf className="task-leaf" size={17}/></div>)}</div>
        <div className="mission-footnote"><Leaf size={17}/><p>{mission.closing_note || 'Stay aware of your surroundings and keep your phone safely tucked away.'}</p></div>
        {mission.source === 'built-in-fallback' && <p className="fallback-note">Built-in mission shown because the local model is not connected. Start Ollama and pull the model to enable AI-generated missions.</p>}
        <button className="primary-button" onClick={beginOutside}>I'M HEADING OUT <ArrowRight size={18}/></button>
        <p className="privacy-note">Read it once. Then let the world have your attention.</p>
      </main>}

      {screen === 'go' && mission && <main className="go-screen">
        <div className="go-top"><span className="go-mark"><Leaf size={25}/></span><span>TOUCHGRASS / GO MODE</span></div>
        <div className="go-center"><div className="go-orbit"><div className="go-leaf"><Leaf size={44}/></div></div><span className="eyebrow">MISSION IN PROGRESS</span><h1>Out there<br/><em>is enough.</em></h1><p>{mission.duration} minutes. Your only job is to notice the world around you.</p><div className="go-rule"></div><span className="go-reminder">PUT YOUR PHONE AWAY</span><span className="go-sub">Return when you're ready. There's no rush.</span></div>
        <div className="go-bottom"><span><MapPin size={15}/> Stay in a safe, familiar area</span><button onClick={()=>setScreen('reflect')}>I'M BACK <ArrowRight size={16}/></button></div>
      </main>}

      {screen === 'reflect' && mission && <main className="reflect-page"><button className="back-link" onClick={()=>setScreen('go')}><ArrowLeft size={16}/> BACK OUTSIDE</button><div className="eyebrow"><span className="eyebrow-line"></span> WELCOME BACK</div><h1>What did you<br/><em>notice?</em></h1><p className="reflect-copy">No score to chase. Just a moment to remember what happened away from your screen.</p><div className="field-block"><label>HOW DID IT FEEL?</label><div className="choice-row mood-row">{['Restless','Okay','Good','Great'].map(m=><button className={`choice mood-choice ${rating===m?'selected':''}`} key={m} onClick={()=>setRating(m)}>{m}</button>)}</div></div><div className="field-block"><label>ANYTHING WORTH REMEMBERING? (OPTIONAL)</label><textarea value={reflection} onChange={e=>setReflection(e.target.value)} placeholder="A bird call, a strange cloud, a thought that finally had room..." rows={4}/></div><div className="field-block evidence-block"><label>PHOTO EVIDENCE (OPTIONAL)</label><p className="evidence-help">Add a photo from your time outside. It stays in this browser and is not uploaded to a server.</p><label className="upload-button" htmlFor="evidence-upload">{evidence ? 'CHANGE PHOTO' : 'CHOOSE A PHOTO'} <ArrowRight size={15}/></label><input id="evidence-upload" className="evidence-input" type="file" accept="image/*" capture="environment" onChange={handleEvidenceChange}/>{evidence && <div className="evidence-preview-wrap"><img className="evidence-preview" src={evidence} alt="Outdoor mission evidence preview"/><button type="button" className="remove-evidence" onClick={()=>{setEvidence('');setEvidenceError('');document.getElementById('evidence-upload').value='';}}>REMOVE PHOTO</button></div>}{evidenceError && <p className="error-text">{evidenceError}</p>}</div><button className="primary-button" onClick={finishMission}>SAVE MY FIELD NOTES <ArrowRight size={18}/></button></main>}

      {screen === 'done' && <main className="done-page"><div className="done-symbol"><Check size={34}/></div><div className="eyebrow"><span className="eyebrow-line"></span> FIELD NOTES SAVED</div><h1>You were<br/><em>actually there.</em></h1><p className="done-copy">That's the whole point. No feed to catch up on. Nothing else to unlock.</p><div className="stats-grid"><div><span className="stat-value">{stats.minutes}</span><span className="stat-label">MINUTES OUTSIDE*</span></div><div><span className="stat-value">{stats.missions}</span><span className="stat-label">MISSIONS DONE</span></div><div><span className="stat-value">{stats.discoveries}</span><span className="stat-label">NOTES SAVED</span></div></div><p className="stat-foot">*Time is estimated from the time you started Go Mode. Stats and photo evidence are stored locally in this browser.</p>{evidence && <div className="saved-evidence"><span className="stat-label">YOUR PHOTO EVIDENCE</span><img src={evidence} alt="Saved outdoor mission evidence"/></div>}<button className="primary-button" onClick={() => { setHistory(() => { try { return JSON.parse(localStorage.getItem('tg-history') || '[]'); } catch { return []; } }); setScreen('submissions'); }}><NotebookText size={17}/> VIEW MY SUBMISSIONS <ArrowRight size={18}/></button><button className="text-button" onClick={reset}>MAKE ANOTHER PLAN</button></main>}

      <footer className="footer"><span>BUILT FOR THE WORLD OUTSIDE YOUR WINDOW.</span><span>OPEN SOURCE · LOCAL-FIRST · SCREEN-LIGHT</span></footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
