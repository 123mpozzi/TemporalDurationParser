import { expect } from 'chai'
import { Duration, ERROR_MSG } from '../src/internal'

describe('DateParser', () => {
  it('test throw error on invalid formats', () => {
    let badCall = function (): void {
      Duration.from('PT').to.seconds()
    }
    expect(badCall).to.throw(RangeError, ERROR_MSG.INVALID_FORMAT)
    badCall = function () {
      Duration.from('T1M1.2S').to.seconds()
    }
    expect(badCall).to.throw(RangeError, ERROR_MSG.INVALID_FORMAT)
  })

  it('test normal strings', () => {
    expect(Duration.from('PT1M1.2S').to.seconds()).to.equal(61.2)
    expect(Duration.from('PT1M1S').to.seconds()).to.equal(61)
  })

  it('test minutes vs months (both have designator M)', () => {
    expect(Duration.from('P1M').to.months()).to.equal(1)
    expect(Duration.from('PT1M').to.seconds()).to.equal(60)
  })

  it('test zeros', () => {
    expect(Duration.from('PT0S').to.seconds()).to.equal(0)
    expect(Duration.from('P0D').to.seconds()).to.equal(0)
  })

  it('test fractional values', () => {
    expect(Duration.from('PT0.0021S').to.seconds()).to.equal(0.0021)
    expect(Duration.from('PT0.5H').to.seconds()).to.equal(1800)
  })

  it('test overflowing params', () => {
    expect(Duration.from('PT36H').to.seconds()).to.equal(129600)
    expect(Duration.from('PT1M120S').to.seconds()).to.equal(180)
  })

  it('test weeks format', () => {
    expect(Duration.from('P12W').to.seconds()).to.equal(7257600)
    expect(Duration.from('P0.5W').to.seconds()).to.equal(302400)
  })
})
