[Temporal.Duration]: https://tc39.es/proposal-temporal/docs/duration.html

# Temporal.Duration Parser

ISO 8601 notation for [Temporal.Duration]  

The parser is not complete.

## Setup

Install dependencies
```bash
npm install
```

## How to run

Run an example script
```bash
npm run try
```

Run tests via Mocha
```bash
npm test
```

## Project Structure

```
project
│   README.md               This file
│   package.json            Project metadata
│   ...
│
└───src                     Source files
│   │   dateParser.ts
│   │   duration.ts
│   │   timeConverter.ts
│
└───tests                   Tests files
    │   testParser.ts
```


There are **3 main components**: the ones listed in `src`

#### Duration  
responsible for modeling an ISO_8601 Duration

#### DateParser  
responsible for parsing the string and adding data to the Duration model

#### TimeConverter  
responsible for handling time conversions


## Limitations


- I did implement these **two formats**: `P[n]Y[n]M[n]DT[n]H[n]M[n]S` and `P[n]W`, but I didn't implement this last format: `P0003-06-04T12:30:05`
- Note that when calculating total seconds, there are attributes which are **not fixed length**: *months* and *years*.  In this case a month is considered 30 days and a year 12 months.

