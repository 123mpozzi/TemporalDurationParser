import { Duration } from "./duration";


// TODO: rename file? also in .json files!


// TODO: global const bad practice? (clutter env, security in browser, .., make an object?)

// P3Y0M14DT12H30M55S
// P3Y0M14D [T] 12H30M55S
// P3Y0M14D     12H30M55S
// TODO: pretty docs (also returns types, see typescript)
// Parse ISO_8601 Durations
// https://en.wikipedia.org/wiki/ISO_8601#Durations
//const dur1 = new Duration();
//const dur2 = new Duration().parseDayComponent('3Y14.5DT12H30M55S');
//const dur2 = new Duration();

//parseDuration("PT1M1.2S");

// TODO: try laziness: parse one string and CHECK, parse another and CHECK, and so on!

//console.log(dur1.parseDuration('P3Y14DT12H30M55S'));
//console.log(dayMap.entries())
console.log(Duration.from("PT1M1.2S").toSeconds());
console.log(Duration.from("PT1M1S").toSeconds());
//console.log(dur1.parseDayComponent("PT1M1.2S"));
//parseDuration('P3Y0M14DT12H30M55S');//('P3Y0M1DT12H')
// three years, six months, four days, twelve hours, thirty minutes, and five seconds
//parseDuration("P3Y6M0DT12H30M5S");
