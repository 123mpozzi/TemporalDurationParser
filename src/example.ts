import { Duration } from "./internal";


// set to true to see internal date and time maps
const debug: boolean = true;

console.log(Duration.from("P3Y0M4DT12H30M5S", debug).to.seconds());
console.log(Duration.from("P00M1.2S", debug).to.seconds());
console.log(Duration.from("P3DT4H59M", debug).to.seconds());
console.log(Duration.from("PT0.0021S", debug).to.seconds());
console.log(Duration.from("P0D", debug).to.seconds());
console.log(Duration.from("P0.2W", debug).to.seconds());
console.log(Duration.from("P6W", debug).to.seconds());

try {
    // These throw the custom error for "banned parameter"
    console.log(Duration.from("PT1M1.2S", debug).to.seconds());
    console.log(Duration.from("P01M1.2S", debug).to.seconds());
} catch(e) {
    console.log(e);
}

try {
    // These throw the custom error for "invalid format"
    console.log(Duration.from("Hello", debug).to.seconds());
    console.log(Duration.from("3312", debug).to.seconds());
    console.log(Duration.from("", debug).to.seconds());
    console.log(Duration.from("T0M1S", debug).to.seconds()); // no P as Period Designator
} catch(e) {
    console.log(e);
}
