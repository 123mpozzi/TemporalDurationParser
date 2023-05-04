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

Duration.from("P3Y0M4DT12H30M5S").to.seconds()  // 93702605
Duration.from("P3DT4H59M").to.seconds()         // 277140
Duration.from("PT0.0021S").to.seconds()         // 0.0021
Duration.from("PT36H").to.seconds()             // 129600
Duration.from("P12W").to.seconds()              // 7257600


// Customize months or year multipliers

import { MULTIPLIER_2SEC } from "./internal";

const yearInDays: number = MULTIPLIER_2SEC.DAYS * 365;
const oneYear: Duration = Duration.from('P1Y');
oneYear.to.seconds(false, MULTIPLIER_2SEC.MONTHS, yearInDays)  // 31536000
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

