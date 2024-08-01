const startBtn = document.querySelector('#start-btn');
const stopBtn = document.querySelector('#stop-btn');
const resultTextArea = document.querySelector('#result');
const instructions = document.querySelector('#instructions');

let recognition;

if (!('webkitSpeechRecognition' in window)) {
    instructions.textContent = 'Web Speech API is not supported by this browser. Please use Chrome or another supported browser.';
} else {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = e => {
        instructions.textContent = 'Voice recognition started. Speak into the microphone.';
        startBtn.disabled = true;
        stopBtn.disabled = false;
    };

    recognition.onresult = e => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = e.resultIndex; i < e.results.length; ++i) {
            if (e.results[i].isFinal) {
                finalTranscript += e.results[i][0].transcript;
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
        instructions.textContent = 'Voice recognition stopped.';
        startBtn.disabled = false;
        stopBtn.disabled = true;
    };
}

startBtn.addEventListener('click', e => {
    recognition.start();
});

stopBtn.addEventListener('click', e => {
    recognition.stop();
});

resultTextArea.addEventListener('click', () => {
    resultTextArea.select();
    document.execCommand('copy');
    instructions.textContent = 'Text copied to clipboard.';
});
