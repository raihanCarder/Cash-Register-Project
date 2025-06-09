const purchaseBtn = document.getElementById("purchase-btn");
const changeDueText = document.getElementById("change-due");
const changeDueArea = document.getElementById("change-area");
const inputText = document.getElementById("cash");
const cashRegisterText = document.getElementById("cash-register-p");
const priceText = document.getElementById("price");

let price = 1.87;
let cid = [
    ['PENNY', 1.01],
    ['NICKEL', 2.05],
    ['DIME', 3.1],
    ['QUARTER', 4.25],
    ['ONE', 90],
    ['FIVE', 55],
    ['TEN', 20],
    ['TWENTY', 60],
    ['ONE HUNDRED', 100]
];

let change = {
    "PENNY": 0,
    "NICKEL": 0,
    "DIME": 0,
    "QUARTER": 0,
    "ONE": 0,
    "FIVE": 0,
    "TEN": 0,
    "TWENTY": 0,
    "ONE HUNDRED": 0
}

/* INITIAL CALLS */
priceText.textContent += ` $${price}`;
updateRegisterText();
/* CLICK EVENTS */

purchaseBtn.addEventListener("click", () => {
    const inputInCents = Math.round(inputText.value * 100);
    const priceInCents = Math.round(price * 100);
    const changeDueInCents = Math.round(inputInCents - priceInCents);
    const registerCashInCents = totalCashInRegisterInCents();
    let status = "";

    if (changeDueInCents < 0) {
        alert("Customer does not have enough money to purchase the item");
        inputText.value = "";

    }
    else if (changeDueInCents === 0) {
        changeDueArea.style.display = "block";
        changeDueText.textContent = "No change due - customer paid with exact cash";
        inputText.value = "";

    }
    else if (changeDueInCents < registerCashInCents) {
        changeDueArea.style.display = "block";
        status = "OPEN";
        Object.keys(change).forEach(key => change[key] = 0);

        const extra = calculateChange(changeDueInCents);
        if (extra > 0) {
            changeDueText.textContent = "Status: INSUFFICIENT_FUNDS";
            return;
        }

        updateRegisterText();
        updateReceipt(status);
        inputText.value = "";
        return;
    }
    else if (changeDueInCents === registerCashInCents) {
        changeDueArea.style.display = "block";
        status = "CLOSED";
        Object.keys(change).forEach(key => change[key] = 0);

        const extra = calculateChange(changeDueInCents);
        if (extra > 0) {
            changeDueText.textContent = "Status: INSUFFICIENT_FUNDS";
            return;
        }

        updateRegisterText();
        updateReceipt(status);
        inputText.value = "";
        return;
    }
    else {
        changeDueArea.style.display = "block";
        changeDueText.textContent = "Status: INSUFFICIENT_FUNDS";
        inputText.value = "";
        return;
    }

});

/* FUNCTIONS */

function calculateChange(inputInCents) {

    const denominations = [
        {
            name: "ONE HUNDRED",
            value: 10000,
            index: 8
        },
        {
            name: "TWENTY",
            value: 2000,
            index: 7
        },
        {
            name: "TEN",
            value: 1000,
            index: 6
        },
        {
            name: "FIVE",
            value: 500,
            index: 5
        },
        {
            name: "ONE",
            value: 100,
            index: 4
        },
        {
            name: "QUARTER",
            value: 25,
            index: 3
        },
        {
            name: "DIME",
            value: 10,
            index: 2
        },
        {
            name: "NICKEL",
            value: 5,
            index: 1
        },
        {
            name: "PENNY",
            value: 1,
            index: 0
        }
    ];

    for (let coin of denominations) {
        let amountAvailable = Math.round(cid[coin.index][1] * 100);

        while (inputInCents >= coin.value && amountAvailable >= coin.value) {
            change[coin.name] += coin.value / 100;
            cid[coin.index][1] -= coin.value / 100;
            amountAvailable -= coin.value;
            inputInCents -= coin.value;
        }
    }
    return inputInCents;
}

function totalCashInRegisterInCents() {
    const total = cid.map(subArr => subArr[1]).reduce((acc, num) => acc + num, 0);

    return Math.round(total * 100);
}

function updateRegisterText() {
    const displayArr = [
        `Pennies: $${cid[0][1].toFixed(2)} <br>`,
        `Nickels: $${cid[1][1].toFixed(2)} <br>`,
        `Dimes: $${cid[2][1].toFixed(2)} <br>`,
        ` Quarters: $${cid[3][1].toFixed(2)} <br>`,
        `Ones: $${cid[4][1].toFixed(2)} <br>`,
        `Fives: $${cid[5][1].toFixed(2)} <br>`,
        `Tens: $${cid[6][1].toFixed(2)} <br>`,
        `Twenties: $${cid[7][1].toFixed(2)} <br>`,
        `Hundreds: $${cid[8][1].toFixed(2)} <br>`
    ];

    cashRegisterText.innerHTML = "";

    displayArr.forEach((arr) => {
        cashRegisterText.innerHTML += arr;
    })
}

function updateReceipt(status) {
    const changeArrDisplay = Object.entries(change)
        .filter(([key, value]) => value > 0)
        .reverse()
        .map(([key, value]) => `${key}: $${value.toFixed(2)}`)
        .join("<br>");

    changeDueText.innerHTML = `Status: ${status} <br>${changeArrDisplay}`;
}