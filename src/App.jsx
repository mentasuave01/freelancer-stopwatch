import { createSignal, onCleanup } from 'solid-js';
import Footer from './Footer';

function saveToLocalStorage(projects) {
  localStorage.setItem('projects', JSON.stringify(projects));
}



function loadFromLocalStorage() {
  const storedProjects = localStorage.getItem('projects');
  return storedProjects ? JSON.parse(storedProjects) : [];
}


function formatTime(time) {
  let seconds = Math.floor((time / 1000) % 60).toString().padStart(2, '0');
  let minutes = Math.floor((time / (1000 * 60)) % 60).toString().padStart(2, '0');
  let hours = Math.floor((time / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
  let days = Math.floor(time / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
  return `${days}:${hours}:${minutes}:${seconds}`;
}

function Stopwatch() {
  const [laps, setLaps] = createSignal([]);
  const [running, setRunning] = createSignal(false);
  const [time, setTime] = createSignal(0);
  let interval;

  let startTime = 0;

  const setTitle = (index, title) => {
    let newLaps = [...laps()];
    newLaps[index].title = title;
    setLaps(newLaps);
  };



  const start = () => {
    setRunning(true);
    startTime = Date.now() - time();
    interval = setInterval(() => setTime(Date.now() - startTime), 100);
  };

  const pause = () => {
    setRunning(false);
    clearInterval(interval);
    let endTime = Date.now();
    let lapTime = endTime - startTime;
    let newLap = { id: laps().length, title: `Lap ${laps().length + 1}`, start: startTime, end: endTime, time: lapTime };
    setLaps([...laps(), newLap]);
    startTime = endTime;
  };
  const reset = () => {
    setTime(0);
    setLaps([]);
    clearInterval(interval);
    setRunning(false);
  };

  function removeLap(index) {
    setLaps(laps().filter((_, i) => i !== index));
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
      <button onClick={() => running() ? pause() : start()}>{running() ? 'Pause' : 'Start'}</button>
      <button onClick={reset}>Reset</button>

      <div></div>
      <div class="laps-container">
        {laps().map((lap, index) => (
          <div class="lap">
            <Record title={lap.title} start={lap.start} end={lap.end} index={index} remove={removeLap} setTitle={setTitle} key={lap.id} />
          </div>
        ))}
      </div>
      <button onClick={downloadCSV}>Download Report</button>
    </>
  );
}

function Record({ title, start, end, index, remove, setTitle }) {
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
      <div>Duration: {formatTime(end - start)}</div>
      <button class="btn-remove" onClick={() => remove(index)}>Remove</button>
    </div>
  );
}

function Project({ name, stopwatch, deleteProject }) {
  return (
    <>
      <main class="projectWrapper">
        <div>
          <h1 style={{ color: "#69B00B" }}>{name}</h1>
          <Stopwatch {...stopwatch} />
          <button class="btn-remove" onClick={deleteProject}>Delete Project</button>
        </div>
      </main>
    </>
  );
}

export default function App() {
  const [projects, setProjects] = createSignal(loadFromLocalStorage());
  const [newProjectName, setNewProjectName] = createSignal('');


  const addProject = () => {
    const newProjects = [
      ...projects(),
      {
        name: newProjectName(),
        stopwatch: {
          laps: createSignal([]),
          running: createSignal(false),
          time: createSignal(0),
        },
      },
    ];
    setProjects(newProjects);
    saveToLocalStorage(newProjects);
  };

  const deleteProject = (index) => {
    const newProjects = projects().filter((_, i) => i !== index);
    setProjects(newProjects);
    saveToLocalStorage(newProjects);
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
          <Project key={index} {...project} deleteProject={() => deleteProject(index)} />
        ))}
      </div>
      <Footer />
    </main>
  );
}