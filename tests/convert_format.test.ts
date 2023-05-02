import { expect } from "chai";
import {  Duration } from "../src/duration";

describe('parseDuration', () => {
  it('test throw error on invalid formats', () => {
    // The tests checking throws do not work because I didn't know how to use 'bind'
    // for checking that the same exact error object is thrown
    expect(function(){
      Duration.from('T1M1.2S').toSeconds();
    }).to.throw(new RangeError(Duration.ERRORS.INVALID_FORMAT));

    expect(function(){
      Duration.from('PT').toSeconds();
    }).to.throw(new RangeError(Duration.ERRORS.INVALID_FORMAT));
  });

  it('test throw error on months not set to 0', () => {
    // The tests checking throws do not work because I didn't know how to use 'bind'
    // for checking that the same exact error object is thrown
    expect(Duration.from('P11MT1M1S').toSeconds()).to.throw(new RangeError(Duration.ERRORS.BANNED_PARAM));
    expect(Duration.from('P9MT1M1S').toSeconds()).to.throw(new RangeError(Duration.ERRORS.BANNED_PARAM));
  });

  it('test normal strings', () => {
    expect(Duration.from('PT1M1.2S').toSeconds()).to.equal(61.2);
    expect(Duration.from('PT1M1S').toSeconds()).to.equal(61);
  });

  it('test minutes vs months (both have designator M)', () => {
    // The tests checking throws do not work because I didn't know how to use 'bind'
    // for checking that the same exact error object is thrown
    expect(Duration.from('P1M').toSeconds()).to.throw(new RangeError(Duration.ERRORS.BANNED_PARAM));
    expect(Duration.from('PT1M').toSeconds()).to.equal(60);
  });

  it('test zeros', () => {
    expect(Duration.from('PT0S').toSeconds()).to.equal(0);
    expect(Duration.from('P0D').toSeconds()).to.equal(0);
  });

  it('test fractional values', () => {
    expect(Duration.from('PT0.0021S').toSeconds()).to.equal(0.0021);
    expect(Duration.from('PT0.5H').toSeconds()).to.equal(1800);

  });

  it('test overflowing params', () => {
    expect(Duration.from('PT36H').toSeconds()).to.equal(129600);
    expect(Duration.from('PT1M120S').toSeconds()).to.equal(180); 
  });

  it('test weeks format', () => {
    expect(Duration.from('P12W').toSeconds()).to.equal(7257600);
    expect(Duration.from('P0.5W').toSeconds()).to.equal(302400); 
  });
 });

