# JavaScript Pipeline — Word Frequencies

This project illustrates a JavaScript pipeline approach to breaking a problem into functional
steps, where each function takes a single paramter of a given type. The demo here calculates the
top 20 word frequencies found in a text document, after removing stopwords such as "the".

The pipleline steps reside in an array of functions, where each function takes a parameter taken from the result of the previous
function. The first element of the funntion array is a special case. It holds the initial argument instead of a function. 
The reduce function handles this speciai first case automatically.

## Toolchain

We used node.js v15.14.0. Our development machine is an Apple M1, but the project runs on
Linux or Windows 10 if node is present.

## Invocation and Results
From a command terninal:

```bash
> node word-freq.js
children: 18
being: 15
kingdom: 15
one: 15
thousand: 15
from: 12
country: 11
number: 11
therefore: 11
may: 11
great: 10
very: 10
his: 10
own: 10
child: 10
year: 10
all: 9
many: 9
other: 9
we: 9
```

## Pipeline Script Source

```javascript
const fs = require('fs');
const INPUT_TEXT = 'text.txt';
const STOP_WORDS = 'stopwords.txt';

function readText(fileName) {
    return fs.readFileSync(fileName, 'utf8');
}
function parseWords(words) {
    const wordList = [];
    let index = 0;
    let word = "";
    while (index < words.length) {
        const c = words[index].toLowerCase();
        if (c >= "a" && c <= "z") {
            word += c;
            index++;
            continue;
        }
        index++;
        if (word !== "") {
            wordList.push(word);
        }
        word = "";
    }
    return wordList;
}
function removeStopwords(wordList) {
    const stopWordsRaw = fs.readFileSync(STOP_WORDS, "utf-8");
    const stopWordsText = stopWordsRaw.replace(/(\r\n|\n|\r)/gm, ",");
    const stopWords = stopWordsText.split(",");
    for (let i = 0; i < wordList.length; i++) {
        for (let j = 0; j < stopWords.length; j++) {
            if (wordList[i] === stopWords[j]) {
                for (let k = i; k < wordList.length-1; k++) {
                    wordList[k] = wordList[k+1];
                }
                i--; // this handles two stopwords in a row
                wordList.pop();
                break;
            }
        }
    }
    return wordList;
}
function calculateFreqs(wordList) {
    const wordFreqs = [];
    wordFreqs.push([wordList[0],1]);
    for (let i = 1; i < wordList.length; i++) {
        for (let j = 0; j < wordFreqs.length; j++) {
            if (wordList[i] === wordFreqs[j][0]) {
                wordFreqs[j][1] += 1;
                break;
            }
        }
        wordFreqs.push([wordList[i], 1]);
    }
    return wordFreqs;
}
function sortFreqs(wordFreqs) {
    for (let i = wordFreqs.length-1; i > 0; i--) {
        for (let j = 0; j < i; j++) {
            if (wordFreqs[j][1] < wordFreqs[j+1][1]) {
                const temp = wordFreqs[j];
                wordFreqs[j] = wordFreqs[j+1];
                wordFreqs[j+1] = temp;
            }
        }
    }
    return wordFreqs;
}
function getTopFreqs(wordFreqs) {
    let str = "";
    for (let i = 0; i < 20; i++) {
        str += wordFreqs[i][0] + ": " + wordFreqs[i][1] + "\n";
    }
    return str;
}
function display(wordFreqs) {
    console.log(wordFreqs);
}

const pipeline = [ INPUT_TEXT,
    readText,
    parseWords,
    removeStopwords,
    calculateFreqs,
    sortFreqs,
    getTopFreqs,
    display ];
pipeline.reduce((acc, fn) => fn(acc));
```
