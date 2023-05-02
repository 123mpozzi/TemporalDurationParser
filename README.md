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


## Limitations

There are still some issues:
- I did implement these **two formats**: `P[n]Y[n]M[n]DT[n]H[n]M[n]S` and `P[n]W`, but I didn't implement this last format: `P0003-06-04T12:30:05`
- In the calculation of the total seconds I didn't find a way to precisely calculate the seconds for **variable parameters** like YEAR (365 to 366 days) and MONTH (28 to 31 days) 
- **tests expecting throws** are not working because I don't know how bind works and if the error is not the exact same object, the test does not pass 

