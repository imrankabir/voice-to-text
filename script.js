const startBtn = document.querySelector('#start-btn');
const stopBtn = document.querySelector('#stop-btn');
const clearBtn = document.querySelector('#clear-btn');
const resultTextArea = document.querySelector('#result');
const instructions = document.querySelector('#instructions');

let recognition;
let interval = null;

const STORAGE_KEY = 'voice-to-text';
const saveText = text => localStorage.setItem(STORAGE_KEY, text);
const getText = e => localStorage.getItem(STORAGE_KEY);

const updateClearBtnState = e => {
    if (resultTextArea.value != '') {
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
        resultTextArea.value = getText();
        instructions.textContent = 'Voice recognition started. Speak into the microphone.';
        startBtn.disabled = true;
        stopBtn.disabled = false;
    };

    recognition.onresult = e => {
        let interimTranscript = '';
        let finalTranscript = getText();
        for (let i = e.resultIndex; i < e.results.length; ++i) {
            if (e.results[i].isFinal) {
                finalTranscript += e.results[i][0].transcript + '. ';
            } else {
                interimTranscript += e.results[i][0].transcript;
            }
        }
        resultTextArea.value = finalTranscript + interimTranscript;
    };

    recognition.onerror = e => {
        instructions.textContent = 'Error occurred in recognition: ' + e.error;
    };

    recognition.onend = e => {
        saveText(resultTextArea.value);
        instructions.textContent = 'Voice recognition stopped.';
        startBtn.disabled = false;
        stopBtn.disabled = true;
    };
}

window.addEventListener('DOMContentLoaded', e => {
    resultTextArea.value = getText();
    interval = setInterval(updateClearBtnState, 1000);
});

startBtn.addEventListener('click', e => {
    recognition.start();
});

stopBtn.addEventListener('click', e => {
    recognition.stop();
});

clearBtn.addEventListener('click', e => {
    resultTextArea.readonly = false;
    resultTextArea.value = '';
    saveText('');
    resultTextArea.readonly = true;
    clearBtn.disabled = true;
    interval = setInterval(updateClearBtnState, 1000);
});

resultTextArea.addEventListener('click', e => {
    if (resultTextArea.value != '') {
        resultTextArea.select();
        document.execCommand('copy');
        instructions.textContent = 'Text copied to clipboard.';
    }
});
