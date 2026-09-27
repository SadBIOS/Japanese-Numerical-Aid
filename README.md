# Western to Japanese Numeral Engine

A lightweight, zero-dependency Web application that dynamically converts numbers from **0 to 1 Trillion** into Japanese Kanji and Romaji in real time.


## Features

- **Dynamic Dual-Input**: Synchronized number input field and interactive logarithmic/linear range slider (0 – 1,000,000,000,000).
- **Full Spectrum Conversion**: Accurately breaks down small and large numbers up to $10^{12}$ (兆 - *chou*), properly applying Japanese 4-digit (万, 億, 兆) grouping rules.
- **Phonetic & Kanji Render**: Generates both standard Kanji representation and formatted Romaji pronunciation.
- **Responsive Word-Wrapping**: Prevents layout breakages on ultra-large numbers using overflow-wrap rules.
- **Interactive Reference Guide**: Built-in reference table containing single digits, units, Kanji, Romaji, and Furigana annotations using HTML `<ruby>` tags.
- **Modern Dark UI**: Pure CSS styling with custom glow effects, smooth CSS animations, pastel accents, and custom range slider thumb styling.
- **Zero External Dependencies**: Pure vanilla HTML5, CSS3, and JavaScript (ES6+ with `BigInt` support).

---

## File Structure

```text
.
├── index.html   # Main HTML structure & reference guide tables
├── styles.css   # Modern dark/pastel styles, animations, responsive design
└── script.js    # Core conversion algorithm using JS BigInt & event listeners

```

---

## Quick Start

1. Clone or download the repository:
```bash
git clone https://github.com/Samkaka22/Japanese-Numerical-Aid.git

```


2. Navigate to the project directory:
```bash
cd Japanese-Numerical-Aid
```


3. Open `index.html` in any modern web browser:
```bash
# On macOS
open index.html

# On Linux
xdg-open index.html

# On Windows
start index.html

```



---

## Conversion Logic Overview

Western numbers are grouped in powers of 1,000 ($10^3$), whereas Japanese numerals group numbers in powers of 10,000 ($10^4$).

| Power | Western Unit | Japanese Kanji | Romaji |
| --- | --- | --- | --- |
| $10^0$ | 1 | — | — |
| $10^4$ | 10,000 | 万 | man |
| $10^8$ | 100,000,000 | 億 | oku |
| $10^{12}$ | 1,000,000,000,000 | 兆 | chou |

The algorithm inside `script.js` processes numbers using `BigInt` arithmetic:

1. Splits the target integer into $10,000$-base chunks (`temp % 10000n`).
2. Evaluates individual sub-thousands ($1000s$, $100s$, $10s$, $1s$) for each chunk.
3. Maps irregular readings (e.g., $300$ $\rightarrow$ *san-byaku*, $600$ $\rightarrow$ *roppyaku*, $800$ $\rightarrow$ *happyaku*, $3000$ $\rightarrow$ *san-zen*, $8000$ $\rightarrow$ *hassen*).
4. Appends major power units (`万`, `億`, `兆`) and outputs formatted text.

---

## Tech Stack

* **HTML5**: Semantic tags and `<ruby>` / `<rt>` markup for furigana typography.
* **CSS3**: Custom properties (variables), Flexbox, CSS Grid, keyframe animations and custom pseudo-elements.
* **JavaScript (ES6+)**: `BigInt` for high-precision large integer calculation without floating-point overflow.

---

## License

This project is open-source and available under the [STFU BRUH WHAT LICENSE](https://mschf.com/).