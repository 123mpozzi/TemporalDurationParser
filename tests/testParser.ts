import { expect } from "chai";
import {  Duration } from "../src/duration";

describe('DateParser', () => {
  it('test throw error on invalid formats', () => {
    let badCall = function () { Duration.from('PT').toSeconds(); };
    expect(badCall).to.throw(RangeError, Duration.ERRORS.INVALID_FORMAT);
    badCall = function () { Duration.from('T1M1.2S').toSeconds(); };
    expect(badCall).to.throw(RangeError, Duration.ERRORS.INVALID_FORMAT);
  });

  it('test throw error on months not set to 0', () => {
    let badCall = function () { Duration.from('P11MT1M1S').toSeconds(); };
    expect(badCall).to.throw(RangeError, Duration.ERRORS.BANNED_PARAM);
    badCall = function () { Duration.from('P9MT1M1S').toSeconds(); };
    expect(badCall).to.throw(RangeError, Duration.ERRORS.BANNED_PARAM);
  });

  it('test normal strings', () => {
    expect(Duration.from('PT1M1.2S').toSeconds()).to.equal(61.2);
    expect(Duration.from('PT1M1S').toSeconds()).to.equal(61);
  });

  it('test minutes vs months (both have designator M)', () => {
    let badCall = function () { Duration.from('P1M').toSeconds(); };
    expect(badCall).to.throw(RangeError, Duration.ERRORS.BANNED_PARAM);
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

