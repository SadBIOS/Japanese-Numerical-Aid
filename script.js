const MAX_INTEGER_VALUE = 1000000000000000n;
const MAX_DECIMAL_VALUE = 1000;
const MAX_DECIMAL_DIGITS = 4;

let isDecimalMode = false;
let savedIntegerRaw = "12345678";
let savedDecimalRaw = "123.4567";

const kanjiDigits = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
const romajiDigits = ["", "ichi", "ni", "san", "yon", "go", "roku", "nana", "hachi", "kyuu"];

const decimalDigitKanji = {
    "0": "零",
    "1": "一",
    "2": "二",
    "3": "三",
    "4": "四",
    "5": "五",
    "6": "六",
    "7": "七",
    "8": "八",
    "9": "九"
};

const decimalDigitRomaji = {
    "0": "rei",
    "1": "ichi",
    "2": "ni",
    "3": "san",
    "4": "yon",
    "5": "go",
    "6": "roku",
    "7": "nana",
    "8": "hachi",
    "9": "kyuu"
};

const hundredsKanji = ["", "百", "二百", "三百", "四百", "五百", "六百", "七百", "八百", "九百"];
const hundredsRomaji = ["", "hyaku", "ni-hyaku", "san-byaku", "yon-hyaku", "go-hyaku", "roppyaku", "nana-hyaku", "happyaku", "kyuu-hyaku"];

const thousandsKanji = ["", "千", "二千", "三千", "四千", "五千", "六千", "七千", "八千", "九千"];
const thousandsRomaji = ["", "sen", "ni-sen", "san-zen", "yon-sen", "go-sen", "roku-sen", "nana-sen", "hassen", "kyuu-sen"];

const tensKanji = ["", "十", "二十", "三十", "四十", "五十", "六十", "七十", "八十", "九十"];
const tensRomaji = ["", "juu", "ni-juu", "san-juu", "yon-juu", "go-juu", "roku-juu", "nana-juu", "hachi-juu", "kyuu-juu"];

const majorUnitsKanji = ["", "万", "億", "兆"];
const majorUnitsRomaji = ["", "man", "oku", "choo"];

const onesWords = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const teensWords = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const tensWords = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const shortScaleWords = ["", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion"];

const modeToggle = document.getElementById('modeToggle');
const inputLabel = document.getElementById('inputLabel');
const numInput = document.getElementById('numInput');
const numSlider = document.getElementById('numSlider');
const kanjiOut = document.getElementById('kanjiOut');
const romajiOut = document.getElementById('romajiOut');
const westernDigits = document.getElementById('westernDigits');
const westernWords = document.getElementById('westernWords');
const resultCard = document.getElementById('resultCard');

modeToggle.addEventListener('click', () => {
    if (!isDecimalMode) {
        savedIntegerRaw = numInput.value.replace(/[^0-9]/g, '');
        isDecimalMode = true;
        modeToggle.textContent = "Integer Mode";
        modeToggle.classList.add('active');
        inputLabel.textContent = "Type a decimal number or drag the slider (0 to 1,000, max 4 decimals)";
        numInput.setAttribute("inputmode", "decimal");
        numSlider.min = "0";
        numSlider.max = "1000";
        numSlider.step = "0.0001";
        applyDecimalInput(savedDecimalRaw);
    } else {
        savedDecimalRaw = sanitizeDecimal(numInput.value);
        isDecimalMode = false;
        modeToggle.textContent = "Decimal Mode";
        modeToggle.classList.remove('active');
        inputLabel.textContent = "Type a number or drag the slider (0 to 1 Quintillion)";
        numInput.setAttribute("inputmode", "numeric");
        numSlider.min = "0";
        numSlider.max = "1000000000000000";
        numSlider.step = "1";
        applyIntegerInput(savedIntegerRaw);
    }
});

numInput.addEventListener('input', (e) => {
    if (isDecimalMode) {
        applyDecimalInput(e.target.value);
    } else {
        applyIntegerInput(e.target.value);
    }
});

numSlider.addEventListener('input', (e) => {
    if (isDecimalMode) {
        const raw = Number(e.target.value).toFixed(MAX_DECIMAL_DIGITS).replace(/\.?0+$/, '');
        applyDecimalInput(raw);
    } else {
        const num = BigInt(e.target.value);
        applyIntegerInput(num.toString());
    }
});

function sanitizeDecimal(raw) {
    let cleaned = raw.replace(/[^0-9.]/g, '');
    const firstDot = cleaned.indexOf('.');
    if (firstDot !== -1) {
        const intPart = cleaned.slice(0, firstDot);
        const fracPart = cleaned.slice(firstDot + 1).replace(/\./g, '').slice(0, MAX_DECIMAL_DIGITS);
        cleaned = `${intPart}.${fracPart}`;
    }

    if (cleaned === "" || cleaned === ".") {
        return cleaned === "." ? "." : "";
    }

    const parts = cleaned.split('.');
    let intNum = Number(parts[0] || "0");
    if (intNum > MAX_DECIMAL_VALUE) {
        intNum = MAX_DECIMAL_VALUE;
        return `${MAX_DECIMAL_VALUE}`;
    }
    if (intNum === MAX_DECIMAL_VALUE && parts.length === 2 && parts[1].length > 0) {
        return `${MAX_DECIMAL_VALUE}`;
    }

    const cleanInt = parts[0] === "" ? "" : String(intNum);
    return parts.length === 2 ? `${cleanInt}.${parts[1]}` : cleanInt;
}

function formatDecimalForInput(sanitized) {
    if (sanitized === "") return "";
    if (sanitized === ".") return ".";
    const parts = sanitized.split('.');
    const intFormatted = parts[0] === "" ? "" : BigInt(parts[0]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.length === 2 ? `${intFormatted}.${parts[1]}` : intFormatted;
}

function applyDecimalInput(raw) {
    const sanitized = sanitizeDecimal(raw);
    savedDecimalRaw = sanitized;
    numInput.value = formatDecimalForInput(sanitized);

    if (sanitized === "" || sanitized === ".") {
        numSlider.value = 0;
        processDecimal("");
        return;
    }

    const numericVal = Math.min(MAX_DECIMAL_VALUE, Number(sanitized));
    numSlider.value = numericVal;
    processDecimal(sanitized);
}

function applyIntegerInput(raw) {
    const cleaned = raw.replace(/[^0-9]/g, '');
    savedIntegerRaw = cleaned;

    if (cleaned === "") {
        numInput.value = "";
        numSlider.value = 0;
        processInteger("");
        return;
    }

    let num = BigInt(cleaned);
    if (num > MAX_INTEGER_VALUE) {
        num = MAX_INTEGER_VALUE;
        savedIntegerRaw = num.toString();
    }

    numInput.value = formatWithCommas(num);
    numSlider.value = Number(num);
    processInteger(num.toString());
}

function formatWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function triggerPop() {
    resultCard.classList.remove('animate-pop');
    void resultCard.offsetWidth;
    resultCard.classList.add('animate-pop');
}

function processInteger(rawVal) {
    if (!rawVal || rawVal === "") {
        kanjiOut.innerText = "-";
        romajiOut.innerText = "-";
        westernDigits.innerText = "-";
        westernWords.innerText = "-";
        return;
    }

    const num = BigInt(rawVal);
    westernDigits.innerText = formatWithCommas(num);
    westernWords.innerText = convertToEnglishWords(num);

    const { kanji, romaji } = convertToJapanese(num);

    kanjiOut.innerText = kanji;
    romajiOut.innerText = romaji;

    triggerPop();
}

function processDecimal(rawVal) {
    if (!rawVal || rawVal === "") {
        kanjiOut.innerText = "-";
        romajiOut.innerText = "-";
        westernDigits.innerText = "-";
        westernWords.innerText = "-";
        return;
    }

    const parts = rawVal.split('.');
    const intPart = parts[0] === "" ? 0n : BigInt(parts[0]);
    const hasDot = parts.length === 2;
    const fracPart = hasDot ? parts[1] : "";

    const formattedInt = formatWithCommas(intPart);
    westernDigits.innerText = hasDot ? `${formattedInt}.${fracPart}` : formattedInt;

    const intWords = convertToEnglishWords(intPart);
    if (hasDot && fracPart.length > 0) {
        const fracWords = fracPart.split('').map(d => d === "0" ? "zero" : onesWords[Number(d)]).join(" ");
        westernWords.innerText = `${intWords} point ${fracWords}`;
    } else if (hasDot) {
        westernWords.innerText = `${intWords} point`;
    } else {
        westernWords.innerText = intWords;
    }

    const intJap = convertToJapanese(intPart);
    if (hasDot && fracPart.length > 0) {
        const fracKanji = fracPart.split('').map(d => decimalDigitKanji[d]).join("");
        const fracRomaji = fracPart.split('').map(d => decimalDigitRomaji[d]).join("-");
        kanjiOut.innerText = `${intJap.kanji}点${fracKanji}`;
        romajiOut.innerText = `${intJap.romaji} ten ${fracRomaji}`;
    } else if (hasDot) {
        kanjiOut.innerText = `${intJap.kanji}点`;
        romajiOut.innerText = `${intJap.romaji} ten`;
    } else {
        kanjiOut.innerText = intJap.kanji;
        romajiOut.innerText = intJap.romaji;
    }

    triggerPop();
}

function convertChunkToWords(n) {
    const parts = [];
    const hundreds = Math.floor(n / 100);
    const remainder = n % 100;

    if (hundreds > 0) {
        parts.push(`${onesWords[hundreds]} hundred`);
    }

    if (remainder > 0) {
        let remText = "";
        if (remainder < 10) {
            remText = onesWords[remainder];
        } else if (remainder < 20) {
            remText = teensWords[remainder - 10];
        } else {
            const ten = Math.floor(remainder / 10);
            const one = remainder % 10;
            remText = tensWords[ten] + (one > 0 ? `-${onesWords[one]}` : "");
        }

        if (parts.length > 0) {
            parts.push(`and ${remText}`);
        } else {
            parts.push(remText);
        }
    }

    return parts.join(" ");
}

function convertToEnglishWords(num) {
    if (num === 0n) return "zero";

    let temp = num;
    const groups = [];

    while (temp > 0n) {
        groups.push(Number(temp % 1000n));
        temp = temp / 1000n;
    }

    const sections = [];
    for (let i = groups.length - 1; i >= 0; i--) {
        const g = groups[i];
        if (g === 0) continue;

        const chunkText = convertChunkToWords(g);
        const scale = shortScaleWords[i];
        sections.push(scale ? `${chunkText} ${scale}` : chunkText);
    }

    if (sections.length >= 2) {
        const last = sections[sections.length - 1];
        if (!last.includes(" and ") && groups[0] > 0 && groups[0] < 100) {
            sections[sections.length - 1] = `and ${last}`;
        }
    }

    return sections.join(", ");
}

function convertToJapanese(num) {
    if (num === 0n) return { kanji: "零", romaji: "rei" };

    let temp = num;
    let chunks = [];

    while (temp > 0n) {
        chunks.push(temp % 10000n);
        temp = temp / 10000n;
    }

    let resultKanji = "";
    let resultRomaji = "";

    for (let i = chunks.length - 1; i >= 0; i--) {
        let chunk = chunks[i];
        if (chunk === 0n) continue;

        let c = Number(chunk);
        let k = "";
        let r = [];

        let thou = Math.floor(c / 1000);
        let hund = Math.floor((c % 1000) / 100);
        let ten = Math.floor((c % 100) / 10);
        let one = c % 10;

        if (thou > 0) {
            k += thousandsKanji[thou];
            let tRom = thousandsRomaji[thou];
            if (i > 0 && thou === 1) {
                tRom = "issen";
            }
            r.push(tRom);
        }
        if (hund > 0) { k += hundredsKanji[hund]; r.push(hundredsRomaji[hund]); }
        if (ten > 0) { k += tensKanji[ten]; r.push(tensRomaji[ten]); }

        if (one > 0) {
            k += kanjiDigits[one];
            r.push(romajiDigits[one]);
        }

        if (i > 0) {
            const unitIdx = Math.min(i, majorUnitsKanji.length - 1);
            k += majorUnitsKanji[unitIdx];
            let unitRom = majorUnitsRomaji[unitIdx];
            if (c === 1) {
                if (unitIdx === 3) {
                    r = ["icchoo"];
                } else {
                    r = ["ichi-" + unitRom];
                }
            } else {
                let lastIdx = r.length - 1;
                if (unitIdx === 3 && r[lastIdx] === "juu") {
                    r[lastIdx] = "jucchoo";
                } else {
                    r.push(unitRom);
                }
            }
        }

        resultKanji += k;
        resultRomaji += (resultRomaji ? " " : "") + r.join("-");
    }

    resultRomaji = resultRomaji
        .replace(/-man/g, ' man')
        .replace(/-oku/g, ' oku')
        .replace(/-choo/g, ' choo');

    return {
        kanji: resultKanji,
        romaji: resultRomaji.trim()
    };
}

applyIntegerInput(numInput.value.replace(/[^0-9]/g, ''));