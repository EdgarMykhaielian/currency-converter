const [form] = document.forms;
const leftInput = form["left-input"];
const rightInput = form["right-input"];
const leftSelect = form["left-select"];
const rightSelect = form["right-select"];
let rates = {};
let lastInput;

leftInput.onkeydown = rightInput.onkeydown = controlInput;
leftInput.oninput = rightInput.oninput = calculateRate;
leftSelect.onchange = rightSelect.onchange = calculateRate;

getData().then((data) => {
    data.unshift({
        r030: 980,
        txt: "Українська гривня",
        rate: 1,
        cc: "UAH",
        exchangedate: "09.03.2023",
    });
    fillSelectOptions(data);
    rates = Object.fromEntries(data.map(({ cc, rate }) => [cc, rate]));
});

function getData() {
    return fetch(
        "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json"
    ).then((response) => response.json());
}
function fillSelectOptions(data) {
    leftSelect.innerHTML = rightSelect.innerHTML = `
    <option disabled selected>Choose</option>
    ${data.map(buildOption).join("")}
    `;
}
function buildOption({ txt, cc }) {
    return `<option value="${cc}">${txt}</option>`;
}

function controlInput(e) {
    const { target, key } = e;

    if (target.value.length > 8 && key != "Backspace") {
        e.preventDefault();
    }
}
function calculateRate(e) {
    if (this.matches('input')){
        lastInput = this
    }
    const thisInput = lastInput || this.parentElement.lastElementChild;
    const thatInput = leftInput == thisInput ? rightInput : leftInput;
    const thisSelect = thisInput.previousElementSibling;
    const thatSelect = thatInput.previousElementSibling;
    const thisRate = rates[thisSelect.value];
    const thatRate = rates[thatSelect.value];
    thatInput.value = ((thisInput.value * thisRate) / thatRate).toFixed(2);
}
