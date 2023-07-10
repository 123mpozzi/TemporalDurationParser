import { expect } from 'chai'
import { Duration, MULTIPLIER_2SEC } from '../src/internal'

describe('TimeConverter', () => {
  it('test custom multipliers', () => {
    const customMonthMultiplier: number = MULTIPLIER_2SEC.DAYS * 30 // rough average
    const customMonthMultiplierW: number = MULTIPLIER_2SEC.WEEKS * 4 // rough average
    const monthsTest: Duration = Duration.from('P1M')
    expect(monthsTest.to.seconds(customMonthMultiplier)).to.equal(86400 * 30)
    expect(monthsTest.to.seconds(customMonthMultiplierW)).to.equal(2419200)

    const customYearMultiplier: number = MULTIPLIER_2SEC.DAYS * 365
    const customYearMultiplierW: number = MULTIPLIER_2SEC.WEEKS * 52
    const yearsTest: Duration = Duration.from('P1Y')
    expect(yearsTest.to.seconds(MULTIPLIER_2SEC.MONTHS, customYearMultiplier)).to.equal(31536000)
    expect(yearsTest.to.seconds(MULTIPLIER_2SEC.MONTHS, customYearMultiplierW)).to.equal(31449600)
  })

  it('test other time conversions', () => {
    const oneDay: Duration = Duration.from('P1D')
    expect(oneDay.to.seconds()).to.equal(86400)
    expect(oneDay.to.minutes()).to.equal(1440)
    expect(oneDay.to.hours()).to.equal(24)

    const oneMonth: Duration = Duration.from('P1M')
    expect(oneMonth.to.seconds()).to.closeTo(30.437 * 86400, 0.01)
    expect(oneMonth.to.minutes()).to.closeTo(30.437 * 24 * 60, 0.01)
    expect(oneMonth.to.hours()).to.closeTo(30.437 * 24, 0.01)
    expect(oneMonth.to.days()).to.closeTo(30.437, 0.01)
    expect(oneMonth.to.weeks()).to.closeTo(30.437 / 7, 0.01)
    expect(oneMonth.to.months()).to.equal(1)
    expect(oneMonth.to.years()).to.closeTo(1 / 12, 0.01)

    const customYearMultiplier: number = MULTIPLIER_2SEC.DAYS * 365
    const customYearMultiplierW: number = MULTIPLIER_2SEC.WEEKS * 52
    expect(oneMonth.to.years(MULTIPLIER_2SEC.MONTHS, customYearMultiplier)).to.closeTo(
      oneMonth.to.days() / 365,
      0.01
    )
    expect(oneMonth.to.years(MULTIPLIER_2SEC.MONTHS, customYearMultiplierW)).to.closeTo(
      oneMonth.to.weeks() / 52,
      0.01
    )
  })
})
