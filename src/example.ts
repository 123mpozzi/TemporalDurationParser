import { Duration } from "./duration";


// set to true to see internal date and time maps
const debug: boolean = true;

console.log(Duration.from("P3Y0M4DT12H30M5S", debug).toSeconds());
console.log(Duration.from("P00M1.2S", debug).toSeconds());
console.log(Duration.from("P3DT4H59M", debug).toSeconds());
console.log(Duration.from("PT0.0021S", debug).toSeconds());
console.log(Duration.from("P0D", debug).toSeconds());
console.log(Duration.from("P0.2W", debug).toSeconds());
console.log(Duration.from("P6W", debug).toSeconds());

try {
    // These throw the custom error for "banned parameter"
    console.log(Duration.from("PT1M1.2S", debug).toSeconds());
    console.log(Duration.from("P01M1.2S", debug).toSeconds());
} catch(e) {
    console.log(e);
}

try {
    // These throw the custom error for "invalid format"
    console.log(Duration.from("Hello", debug).toSeconds());
    console.log(Duration.from("3312", debug).toSeconds());
    console.log(Duration.from("", debug).toSeconds());
    console.log(Duration.from("T0M1S", debug).toSeconds()); // no P as Period Designator
} catch(e) {
    console.log(e);
}
