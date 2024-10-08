const app = 'Voice To Text';
const VISITS_KEY = 'voice-to-text-visits';

const result = document.querySelector('#result');
const stopBtn = document.querySelector('#stop-btn');
const startBtn = document.querySelector('#start-btn');
const clearBtn = document.querySelector('#clear-btn');
const instructions = document.querySelector('#instructions');

let recognition;
let interval = null;

const STORAGE_KEY = 'voice-to-text';
const saveText = text => localStorage.setItem(STORAGE_KEY, text);
const getText = e => localStorage.getItem(STORAGE_KEY);

const updateClearBtn = e => {
    if (result.value != '') {
        clearBtn.disabled = false;
        clearInterval(interval);
    }
}

if (!('webkitSpeechRecognition' in window)) {
    instructions.textContent = 'Web Speech API is not supported by this browser. Please use Chrome or another supported browser.';
} else {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = e => {
        result.value = getText();
        instructions.textContent = 'Voice recognition started. Speak into the microphone.';
        startBtn.disabled = true;
        stopBtn.disabled = false;
    };

    recognition.onresult = e => {
        let interimTranscript = '';
        let finalTranscript = getText();
        for (let i = e.resultIndex; i < e.results.length; ++i) {
            if (e.results[i].isFinal) {
                finalTranscript += e.results[i][0].transcript;
            } else {
                interimTranscript += e.results[i][0].transcript;
            }
        }
        result.value = `${finalTranscript} . ${interimTranscript}`;
    };

    recognition.onerror = e => {
        instructions.textContent = `Error occurred in recognition: ${e.error}`;
    };

    recognition.onend = e => {
        saveText(result.value);
        instructions.textContent = 'Voice recognition stopped.';
        startBtn.disabled = false;
        stopBtn.disabled = true;
    };
}

window.addEventListener('DOMContentLoaded', e => {
    result.value = getText();
    interval = setInterval(updateClearBtn, 1000);
});

startBtn.addEventListener('click', e => {
    recognition.start();
});

stopBtn.addEventListener('click', e => {
    recognition.stop();
});

clearBtn.addEventListener('click', e => {
    result.readonly = false;
    result.value = '';
    saveText('');
    result.readonly = true;
    clearBtn.disabled = true;
    interval = setInterval(updateClearBtn, 1000);
});

result.addEventListener('click', e => {
    if (result.value != '') {
        result.select();
        document.execCommand('copy');
        instructions.textContent = 'Text copied to clipboard.';
    }
});

// trackVisitor();
