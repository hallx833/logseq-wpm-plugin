let charsTyped = 0;
let isCtrlDown = false;
let currentFrame = 0;
const pollingRate = 1000;
const wpmWindow = 5 * (1000 / pollingRate);

function onKeyDown(e) {
    if (e.key == "Control") {
        isCtrlDown = true;
    }
    else if (!isCtrlDown && e.key.match(/^[0-9a-z]+$/)) {
        charsTyped++;
    }
}

function onKeyUp(e) {
    if (e.key == "Control") {
        isCtrlDown = false;
    }
}

function updateWpm() {
    const wpm = Math.round(charsTyped / (5 * (currentFrame+1)) * 60 * (1000 / pollingRate));
    logseq.App.registerUIItem("toolbar", {
                key: "wpm_counter", 
                template: 
                    `<div><p style="font-size: large; opacity: 50%;">${wpm}</p></div>`
                }
            );
    currentFrame++;
    if (currentFrame == wpmWindow) {
        currentFrame = 0;
        charsTyped = 0;
    }
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