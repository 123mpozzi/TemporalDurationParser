import { expect } from "chai";
import {  Duration } from "../src/duration";
import rewire from 'rewire'

const rewiredModule = rewire('../src/dateParser')
const rewiredParses = rewiredModule.__get__('DateParser')

describe('parseDuration', () => {
  it('test parsing time component', () => {
    expect(new rewiredParses().parseTimeComponent('1M1S').createModel().toSeconds()).to.equal(61);
    expect(new rewiredParses().parseTimeComponent('1M1.2S').createModel().toSeconds()).to.equal(61.2);
  });

  it('test throw error on invalid formats', () => {
    // non funziona il test perché non ho ben capito come usare 'bind' per controllare
    // che l'errore sia proprio lo stesso
    expect(function(){
      Duration.from('T1M1.2S').toSeconds();
    }).to.throw(new RangeError(Duration.ERRORS.INVALID_FORMAT));

    expect(function(){
      Duration.from('PT').toSeconds();
    }).to.throw(new RangeError(Duration.ERRORS.INVALID_FORMAT));
  });

  it('test throw error on months not set to 0', () => {
    // non funziona il test perché non ho ben capito come usare 'bind' per controllare
    // che l'errore sia proprio lo stesso
    expect(Duration.from('P11MT1M1S').toSeconds()).to.throw(new RangeError(Duration.ERRORS.BANNED_PARAM));
    expect(Duration.from('P9MT1M1S').toSeconds()).to.throw(new RangeError(Duration.ERRORS.BANNED_PARAM));
  });

  it('test normal strings', () => {
    expect(Duration.from('PT1M1.2S').toSeconds()).to.equal(61.2);
    expect(Duration.from('PT1M1S').toSeconds()).to.equal(61); 
    //expect(new Duration.parseDuration('P1Y1M1DT1H1M1.1S')).to.equal(61);
  });

  it('test minutes vs months (both have designator M)', () => {
    // non funziona il test perché non ho ben capito come usare 'bind' per controllare
    // che l'errore sia proprio lo stesso
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
 });

