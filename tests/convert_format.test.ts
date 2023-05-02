import { expect } from "chai";
//import { parseDuration } from "../src/convert_format";
import {  Duration } from "../src/duration";
import rewire from 'rewire'

const rewiredModule = rewire('../src/duration')
const rewiredDuration = rewiredModule.__get__('Duration')

describe('parseDuration', () => {
  it('test parsing time component', () => {
    // Test valid duration string format
    //expect(parseDuration('PT1M1.2S')).to.equal(61.2);
    //expect(parseDuration('T1H2M3S')).to.equal(-1);
    //expect(parseDuration('P3Y14.5DT12H30M55S')).to.equal(-1);

    expect(new rewiredDuration(true).parseTimeComponent('1M1S').getTotalSeconds()).to.equal(61);
    expect(new rewiredDuration(true).parseTimeComponent('1M1.2S').getTotalSeconds()).to.equal(61.2);
    expect(new rewiredDuration(true).parseDayComponent('3Y14.5DT12H30M55S').getTotalSeconds()).to.equal(-1);
  });

  it('test parsing whole duration', () => {
    expect(new Duration(true).parseDuration('PT1M1.2S')).to.equal(61.2);
    expect(new Duration(true).parseDuration('PT1M1S')).to.equal(61);

    // With months not set to 0
    expect(new Duration(true).parseDuration('P11MT1M1S')).to.equal(-1);
    expect(new Duration(true).parseDuration('P9MT1M1S')).to.equal(-1);
  });
   /*it('should parse duration in seconds for a valid duration string', () => {
     // Test valid duration string format
     expect(parseDuration('PT1M1.2S')).to.equal(61.2);
     expect(parseDuration('T1H2M3S')).to.equal(-1);

     expect(parseDuration('P1DT2H3M4.5S')).to.equal(93784.5);
     expect(parseDuration('P10Y')).to.equal(315360000);
     expect(parseDuration('P23DT23H')).to.equal(2073600);
 
     // Test valid duration strings with omitted elements
     expect(parseDuration('PT30S')).to.equal(30);
     expect(parseDuration('PT3M')).to.equal(180);
     expect(parseDuration('P3D')).to.equal(259200);
     expect(parseDuration('P3Y')).to.equal(946080000);
 
     // Test valid zero duration strings
     expect(parseDuration('PT0S')).to.equal(0);
     expect(parseDuration('P0D')).to.equal(0);
   });
 
   it('should throw an error for invalid duration string format', () => {
     // Test invalid duration string format
     expect(() => parseDuration('PT')).to.throw(Error);
     expect(() => parseDuration('P')).to.throw(Error);
     expect(() => parseDuration('P0YT0H0M0S')).to.throw(Error);
   });
 
   it('should throw an error if month value is not set to 0', () => {
     // Test invalid month value
     expect(() => parseDuration('P1M')).to.throw(Error);
     expect(() => parseDuration('P1Y1M')).to.throw(Error);
     expect(() => parseDuration('P1Y1MT1M')).to.throw(Error);
   });*/
 });

