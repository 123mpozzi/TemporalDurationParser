import { expect } from 'chai'
import { Duration } from '../src/internal'

describe('Duration', () => {
  it('test correct declaration of properties', () => {
    expect(Duration.from('PT1M1.2S').seconds).to.equal(1.2)

    const dur = Duration.from('P11MT1M1S')
    expect(dur.months).to.equal(11)
    expect(dur.minutes).to.equal(1)
    expect(dur.seconds).to.equal(1)
    expect(dur.years).to.equal(0)
    expect(dur.weeks).to.equal(0)
  })

  it('test correct construction from object', () => {
    const prev = Duration.from('P1Y1M1DT1H1M1.1S')
    const clone = Duration.copy(prev)
    expect(clone.months).to.equal(prev.months)
    expect(clone.minutes).to.equal(prev.minutes)
    expect(clone.hours).to.equal(prev.hours)
    expect(clone.seconds).to.equal(prev.seconds)
    expect(clone.years).to.equal(prev.years)
    expect(clone.weeks).to.equal(prev.weeks)
    expect(clone.days).to.equal(prev.days)
  })
})
