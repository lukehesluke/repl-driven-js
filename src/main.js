const state = {
  libs: {},
  intervalId: null,
  heading: null,
  statusPara: null,
  counter: 0,
};

async function importLibs() {
  const { default: moment } = await import('https://cdn.pika.dev/moment@2.26.0');
  state.libs = {
    moment,
  };
}

function onInterval() {
  state.statusPara.innerText = `Local time: ${state.libs.moment().format()} ;; Counter: ${state.counter}`;
  state.counter += 1;
}

function unload() {
  if (state.intervalId) {
    clearInterval(state.intervalId);
    state.intervalId = null;
  }
  if (state.heading) {
    document.body.removeChild(state.heading);
    state.heading = null;
  }
  if (state.statusPara) {
    document.body.removeChild(state.statusPara);
    state.statusPara = null;
  }
  state.counter = 0;
}

function load() {
  unload();
  // # Create h1 heading
  const heading = document.createElement('h1');
  heading.innerText = 'REPL-driven JS - Demo';
  document.body.appendChild(heading);
  state.heading = heading;
  // # Create para for showing time + counter
  const statusPara = document.createElement('p');
  statusPara.innerText = '';
  document.body.appendChild(statusPara);
  state.statusPara = statusPara;
  // # Set-up an interval
  state.intervalId = setInterval(() => { onInterval(); }, 1000);
}

(async () => {
  await importLibs();
  load();
})();
