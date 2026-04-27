let originalArray = [], steps = [], currentStepIndex = 0;
let isPlaying = false, playInterval = null;

const algoInfo = {
    bubble: { worst: "O(n²)", best: "O(n)", space: "O(1)", code: ["for i from 0 to N-1:", "  for j from 0 to N-i-1:", "    if arr[j] > arr[j+1]:", "      swap(arr[j], arr[j+1])"] },
    selection: { worst: "O(n²)", best: "O(n²)", space: "O(1)", code: ["for i from 0 to N-1:", "  min = i", "  for j from i+1 to N:", "    if arr[j] < arr[min]: min = j", "  swap(arr[i], arr[min])"] },
    insertion: { worst: "O(n²)", best: "O(n)", space: "O(1)", code: ["for i from 1 to N:", "  key = arr[i], j = i-1", "  while j >= 0 and arr[j] > key:", "    arr[j+1] = arr[j]", "  arr[j+1] = key"] }
};

function updateSpeedLabel(val) { document.getElementById('speedVal').innerText = val; }

function generateRandom() {
    const randomArr = Array.from({length: 10}, () => Math.floor(Math.random() * 85) + 15);
    document.getElementById('inputArray').value = randomArr.join(', ');
    loadArray();
}

function loadArray() {
    const input = document.getElementById('inputArray').value;
    if (!input) return;
    originalArray = input.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    stopPlay();
    steps = []; currentStepIndex = 0;
    renderStep(0);
}

function renderStep(index) {
    const container = document.getElementById('bar-container');
    container.innerHTML = '';
    const state = steps.length > 0 ? steps[index] : { array: originalArray, comparing: [], sorted: [], line: -1, note: "Array Initialized." };
    
    const maxVal = Math.max(...originalArray, 1);
    state.array.forEach((val, i) => {
        const bar = document.createElement('div');
        bar.className = `bar ${state.comparing.includes(i) ? 'comparing' : ''} ${state.sorted.includes(i) ? 'sorted' : ''}`;
        bar.style.height = `${(val / maxVal) * 250 + 20}px`;
        bar.innerText = val;
        container.appendChild(bar);
    });

    document.getElementById('status-text').innerText = state.note;
    document.querySelectorAll('.code-line').forEach((el, i) => el.classList.toggle('active', i === state.line));
}

function prepareSort(type) {
    if (originalArray.length === 0) return alert("Please load or generate an array first!");
    stopPlay();
    steps = []; currentStepIndex = 0;
    
    const info = algoInfo[type];
    document.getElementById('analysis-panel').classList.remove('hidden');
    document.getElementById('worst-case').innerText = info.worst;
    document.getElementById('best-case').innerText = info.best;
    document.getElementById('space-complexity').innerText = info.space;
    document.getElementById('pseudocode-display').innerHTML = info.code.map(l => `<div class="code-line">${l}</div>`).join('');

    let arr = [...originalArray];
    if (type === 'bubble') generateBubbleSteps(arr);
    else if (type === 'selection') generateSelectionSteps(arr);
    else if (type === 'insertion') generateInsertionSteps(arr);
    
    renderStep(0);
}

// Algorithm step generators...
function generateBubbleSteps(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            steps.push({ array: [...arr], comparing: [j, j+1], sorted: [], line: 2, note: `Comparing ${arr[j]} & ${arr[j+1]}` });
            if (arr[j] > arr[j+1]) {
                [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
                steps.push({ array: [...arr], comparing: [j, j+1], sorted: [], line: 3, note: `Swap: ${arr[j+1]} > ${arr[j]}` });
            }
        }
    }
}

function generateSelectionSteps(arr) {
    for (let i = 0; i < arr.length; i++) {
        let min = i;
        for (let j = i + 1; j < arr.length; j++) {
            steps.push({ array: [...arr], comparing: [min, j], sorted: [], line: 3, note: `Checking if ${arr[j]} is new minimum` });
            if (arr[j] < arr[min]) min = j;
        }
        [arr[i], arr[min]] = [arr[min], arr[i]];
        steps.push({ array: [...arr], comparing: [i, min], sorted: [], line: 4, note: `Swapping min value into index ${i}` });
    }
}

function generateInsertionSteps(arr) {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i], j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j+1] = arr[j];
            steps.push({ array: [...arr], comparing: [j, j+1], sorted: [], line: 3, note: `Moving ${arr[j]} to the right` });
            j--;
        }
        arr[j+1] = key;
        steps.push({ array: [...arr], comparing: [j+1], sorted: [], line: 4, note: `Placing key ${key}` });
    }
}

function togglePlay() {
    if (steps.length === 0) return alert("Select an algorithm first!");
    if (isPlaying) stopPlay();
    else {
        isPlaying = true;
        document.getElementById('playBtn').innerText = "PAUSE";
        playInterval = setInterval(nextStep, document.getElementById('speed').value);
    }
}

function stopPlay() {
    isPlaying = false;
    document.getElementById('playBtn').innerText = "PLAY";
    clearInterval(playInterval);
}

function nextStep() {
    if (currentStepIndex < steps.length - 1) renderStep(++currentStepIndex);
    else { stopPlay(); }
}

function prevStep() {
    if (currentStepIndex > 0) renderStep(--currentStepIndex);
}