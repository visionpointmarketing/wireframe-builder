// State management
export const state = {
    sections: [],
    currentViewport: 'desktop',
    history: [],
    historyIndex: -1,
    maxHistorySize: 50
};

// These will be set by app.js after DOM is ready
let undoBtnRef = null;
let redoBtnRef = null;
let updateCanvasRef = null;

export function initStateRefs(undoBtn, redoBtn, updateCanvasFn) {
    undoBtnRef = undoBtn;
    redoBtnRef = redoBtn;
    updateCanvasRef = updateCanvasFn;
}

// History Management with memory optimization
export function saveToHistory() {
    if (state.history.length > state.maxHistorySize) {
        state.history = state.history.slice(-state.maxHistorySize + 10);
        state.historyIndex = state.history.length - 1;
    }

    state.history = state.history.slice(0, state.historyIndex + 1);

    const historyEntry = {
        sections: JSON.parse(JSON.stringify(state.sections)),
        timestamp: Date.now()
    };

    state.history.push(historyEntry);
    state.historyIndex++;

    updateHistoryButtons();
}

export function undo() {
    if (state.historyIndex > 0) {
        state.historyIndex--;
        const historyEntry = state.history[state.historyIndex];
        state.sections = JSON.parse(JSON.stringify(historyEntry.sections));
        if (updateCanvasRef) updateCanvasRef(false);
        updateHistoryButtons();
    }
}

export function redo() {
    if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        const historyEntry = state.history[state.historyIndex];
        state.sections = JSON.parse(JSON.stringify(historyEntry.sections));
        if (updateCanvasRef) updateCanvasRef(false);
        updateHistoryButtons();
    }
}

export function updateHistoryButtons() {
    if (undoBtnRef) undoBtnRef.disabled = state.historyIndex <= 0;
    if (redoBtnRef) redoBtnRef.disabled = state.historyIndex >= state.history.length - 1;
}
