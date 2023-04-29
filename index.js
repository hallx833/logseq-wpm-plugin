var charsTyped = 0;
var charsHistory = [];
var isCtrlDown = false;
const wpmWindow = 5;
const inactivityTimeout = 2;
var secondsSinceLastKeypress = 0;
const maxcharsHistory = wpmWindow * 10000;
const pollingRate = 500;

async function onKeyDown(e) {
    if (e.key == "Control") {
        isCtrlDown = true;
    }
    else if (!isCtrlDown && e.key.match(/^[0-9a-z]+$/)) {
        charsTyped++;
        secondsSinceLastKeypress = 0;
    }
}

async function onKeyUp(e) {
    if (e.key == "Control") {
        isCtrlDown = false;
    }
}

function calculateWpm(charsHistory) {
    const charsHistoryWindow = charsHistory.slice(-wpmWindow);
    const chars = charsHistoryWindow.reduce((a, b) => a + b, 0) / charsHistoryWindow.length;
    return Math.round(chars / 5 * 60 * (1000 / pollingRate));

}

async function updateWpm() {
    if (secondsSinceLastKeypress > inactivityTimeout) {
        return;
    }
    if (charsHistory.length > maxcharsHistory) {
        charsHistory.splice(0, charsHistory.length - wpmWindow);
    }
    secondsSinceLastKeypress++;
    charsHistory.push(charsTyped);

    let wpm;
    if (charsHistory.slice(-inactivityTimeout).reduce((a, b) => a + b, 0) == 0) {
        wpm = 0;
    } else {
        wpm = calculateWpm(charsHistory);
    }
    logseq.App.registerUIItem("toolbar", {
                key: "wpm_counter", 
                template: 
                    `<div><p style="font-size: large; opacity: 50%;">${wpm}</p></div>`
                }
            );
    charsTyped = 0;
}

const main = () => {
    logseq.App.registerUIItem("toolbar", {
        key: "wpm_counter", 
        template: 
            `<div><p style="font-size: large; opacity: 50%;">${0}</p></div>`
        }
    );
    const appContainer = parent.document.getElementById("app-container");
    appContainer.addEventListener("keydown", onKeyDown);
    appContainer.addEventListener("keyup", onKeyUp);
    setInterval(updateWpm, pollingRate);
};

logseq.ready(main).catch(console.error);