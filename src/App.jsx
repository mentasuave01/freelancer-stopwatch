import { createSignal, onCleanup } from 'solid-js';
import Footer from './Footer';

console.log(`
⠀⠀⠀⠀⠀⠀⢀⠴⠚⠉⠉⠀⠈⠉⠙⢲⡤⠐⠊⠉⠉⠉⠉⠲⡄⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⡴⡁⠀⠀⠀⢀⠤⠤⠤⢤⣀⢱⡀⠀⠀⠀⠀⠀⠀⠘⡄⠀⠀⠀⠀
⠀⠀⠀⣀⡴⠁⠀⠀⠐⠀⠀⠀⠀⢀⣀⣈⡙⢳⡀⠀⠀⠀⠀⠀⠈⠁⠀⠀⠀⠀
⠀⢠⢿⠷⡾⢷⣦⣀⠀⢀⡠⣶⡽⢷⣂⣀⠀⠀⣨⣶⣀⣉⠀⢀⣀⡀⠀⣀⣈⣢
⢰⢾⠀⠀⠁⠀⠈⠙⠷⣶⣛⣿⣶⣷⣿⣿⣿⣿⣿⣿⠋⣯⣭⣿⣿⣿⣿⣿⣿⣿
⣾⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⣿⣿⣿⣿⣿⣿⣿⡟⡟⠢⠜⠿⣿⣿⣿⣿⣿⢟⡥
⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠙⠛⠛⠛⠍⠁⠀⠀⠀⠀⠀⠀⠈⢤⣭⡾⠋⠀
⡇⠀⠀⠀⠀⠀⠀⠀⣀⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣫⠀⠀
⣷⣄⠀⠀⠀⠀⠀⠸⡁⢰⣈⠑⠦⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣼⢲⠀
⣿⣿⣷⣤⣀⠀⠀⠀⠑⢤⣈⠑⠒⠤⠤⢍⣉⣉⣓⣒⣒⣒⣒⣒⣋⣉⣡⢾⠜⠀
⣿⣿⣿⣿⣿⣿⣶⣤⣀⣀⣀⠉⠉⠓⠲⠶⠤⠤⠤⣄⣀⣀⣀⣀⣀⣤⣿⠟⠀⠀
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣶⡖⠀⠀⠀⠀⢀⣀⣤⣾⣾⣿⣗⣲⢤⠀
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⠒⣠⣾⣿⣿⣿⣿⣿⣿⣿⢿⡧⠐
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣽⣽⣟⣿⣿⣿⣟⡵⠋⠀⠀
         
          Created by Mentasuave01`);
function saveToLocalStorage(projects) {
  localStorage.setItem('projects', JSON.stringify(projects));
}

function loadFromLocalStorage() {
  const storedProjects = localStorage.getItem('projects');
  return storedProjects ? JSON.parse(storedProjects) : [];
}
const localProjects = loadFromLocalStorage();


function formatTime(time) {
  let seconds = Math.floor((time / 1000) % 60).toString().padStart(2, '0');
  let minutes = Math.floor((time / (1000 * 60)) % 60).toString().padStart(2, '0');
  let hours = Math.floor((time / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
  let days = Math.floor(time / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
  return `${days}:${hours}:${minutes}:${seconds}`;
}

function Stopwatch(id) {
  //TODO: CREATE A USE EFFECT TO SAFE DATA TO LOCAL STORAGE
  const idn = id.id;
  const project = localProjects[idn] ?? { stopwatch: { laps: [], time: 0 } };
  const initialLaps = project.stopwatch.laps ?? [];
  const initialTime = project.stopwatch.time ?? 0;
  const [laps, setLaps] = createSignal(initialLaps);
  const [running, setRunning] = createSignal(false);
  const [time, setTime] = createSignal(initialTime);
  let interval;
  let runningTime = 0;
  let startTime = 0;

  const setTitle = (index, title) => {
    let newLaps = [...laps()];
    newLaps[index].title = title;
    setLaps(newLaps);
    const localProjects = loadFromLocalStorage()
    localProjects[idn].stopwatch.laps = newLaps;
    saveToLocalStorage(localProjects);
  };

  const start = () => {
    setRunning(true);
    runningTime = Date.now();
    startTime = Date.now() - time();
    interval = setInterval(() => setTime(Date.now() - startTime), 100);
  };

  const pause = () => {
    setRunning(false);
    clearInterval(interval);
    let endTime = Date.now();
    let lapTime = endTime - runningTime;
    let newLap = { id: laps().length, title: `Lap ${laps().length + 1}`, start: runningTime, end: endTime, time: lapTime };
    setLaps([...laps(), newLap]);
    const localProjects = loadFromLocalStorage()
    localProjects[idn].stopwatch.laps = [...laps()];
    localProjects[idn].stopwatch.time = time();

    saveToLocalStorage(localProjects);
    startTime = endTime; // Update the startTime to the current endTime
  };


  function removeLap(index) {
    setLaps(laps().filter((_, i) => i !== index));
    project.stopwatch.laps = laps().filter((_, i) => i !== index);
    saveToLocalStorage(localProjects);
  }

  function downloadCSV() {
    let csvContent = "Title,Start Time,End Time,Duration\n";

    laps().forEach((lap) => {
      const startDate = new Date(lap.start).toUTCString();
      const endDate = new Date(lap.end).toUTCString();
      const duration = formatTime(lap.end - lap.start);
      csvContent += `"${lap.title}","${startDate}","${endDate}","${duration}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `report-${new Date().toISOString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  onCleanup(() => clearInterval(interval));

  return (
    <>
      <h2>Total Time</h2>
      <h3>{formatTime(time())}</h3>
      <button
        class={running() ? 'btn-pause' : 'btn-start'}
        onClick={() => running() ? pause() : start()}>{running() ? '⏸ Pause' : '▶️ Start'}</button>

      <div></div>
      <div class="laps-container">
        {laps().map((lap, index) => (
          <div class="lap">
            <Record title={lap.title} start={lap.start} end={lap.end} index={index} duration={lap.time} remove={removeLap} setTitle={setTitle} key={lap.id} />
          </div>
        ))}
      </div>
      <button onClick={downloadCSV}>Download Report</button>
    </>
  );
}

function Record({ title, start, end, index, remove, setTitle, duration }) {
  let [lapTitle, setLapTitle] = createSignal(title);

  const handleTitleChange = (e) => {
    setLapTitle(e.target.value);
    setTitle(index, e.target.value);
  };


  return (
    <div>
      <input type="text" value={lapTitle()} onBlur={handleTitleChange} />
      <div>Start: {new Date(start).toUTCString()}</div>
      <div>End: {new Date(end).toUTCString()}</div>
      <div>Duration: {formatTime(duration)}</div>
      <button class="btn-remove" onClick={() => remove(index)}>Remove</button>
    </div>
  );
}

function Project({ name, id, deleteProject }) {
  return (
    <>
      <main class="projectWrapper">
        <div>
          <h1 style={{ color: "#69B00B" }}>{name}</h1>
          <Stopwatch id={id} />
          <button class="btn-remove" onClick={deleteProject}>Delete Project</button>
        </div>
      </main>
    </>
  );
}

export default function App() {
  const [projects, setProjects] = createSignal(localProjects);
  const [newProjectName, setNewProjectName] = createSignal('');


  const addProject = () => {
    setProjects(loadFromLocalStorage());
    const newProjects = [
      ...projects(),
      {
        name: newProjectName(),
        stopwatch: {
          laps: [],
          time: 0,
        },
      },
    ];
    setProjects(newProjects);
    saveToLocalStorage(newProjects);
  };

  const deleteProject = (index) => {
    const localProjects = loadFromLocalStorage()
    setProjects(localProjects);
    const newProjects = projects().filter((_, i) => i !== index);
    setProjects(newProjects);
    saveToLocalStorage(newProjects)
    location.reload();
  };


  return (
    <main class="mainContainer">
      <div class="generatorContainer">
        <div class="title">Freelancer Stopwatch</div>
        <div>
          <input type="text" value={newProjectName()} onInput={(e) => setNewProjectName(e.target.value)} />
          <button onClick={addProject}>Add Project</button>
        </div>
      </div>
      <div class="projectsContainer">
        {projects().map((project, index) => (
          <Project key={index} id={index} {...project} deleteProject={() => deleteProject(index)} />
        ))}
      </div>
      <Footer />
    </main>
  );
}