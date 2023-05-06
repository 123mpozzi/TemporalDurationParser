[Temporal.Duration]: https://tc39.es/proposal-temporal/docs/duration.html

# Temporal.Duration Parser

ISO 8601 notation for [Temporal.Duration]  

The parser is not complete and is mainly focused on converting Duration strings into seconds.

## Setup

Install dependencies
```bash
npm install
```

## Usage

```js
import { Duration } from "./internal";

// Parse Duration string
const sample: Duration = Duration.from("P3Y0M4DT12H30M5.1S");
sample.years;      // 3
sample.days;       // 4
sample.seconds;    // 5.1

// Convert to seconds
Duration.from("P3Y0M4DT12H30M5S").to.seconds()  // 93702605
Duration.from("P3DT4H59M").to.seconds()         // 277140
Duration.from("PT0.0021S").to.seconds()         // 0.0021
Duration.from("PT36H").to.seconds()             // 129600
Duration.from("PT36H").to.hours()               // 36
Duration.from("P12W").to.seconds()              // 7257600
Duration.from("P12W").to.weeks()                // 12


// Customize months or year multipliers

import { MULTIPLIER_2SEC } from "./internal";

const yearAsDays: number = MULTIPLIER_2SEC.DAYS * 365;
const oneYear: Duration = Duration.from('P1Y');
oneYear.to.seconds(false, MULTIPLIER_2SEC.MONTHS, yearAsDays)  // 31536000


const oneMonth: Duration = Duration.from('P1M')
const yearAsWeeks: number = MULTIPLIER_2SEC.WEEKS * 52
// result is close (+- 0.01) to: oneMonth.to.days(false) / 365
oneMonth.to.years(false, MULTIPLIER_2SEC.MONTHS, yearAsDays)
// result is close (+- 0.01) to: oneMonth.to.weeks(false) / 52
oneMonth.to.years(false, MULTIPLIER_2SEC.MONTHS, yearAsWeeks)

```

## Testing

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
    |   testDuration.ts
    |   testTimeConverter.ts
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
- Note that when calculating total seconds, there are attributes which are **not fixed length**: *months* and *years*.  By default a month is considered 30 days and a year 12 months, but can be customized.
- By design, the month parameter is 'banned' and throws an error if it is not set to 0, can disable this behaviour by setting the first argument as `false` when converting time: `Duration.from('P1M').to.seconds(false)` 

