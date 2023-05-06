import { expect } from 'chai'
import { Duration, MULTIPLIER_2SEC } from '../src/internal'

describe('TimeConverter', () => {
  it('test custom multipliers', () => {
    const customMonthMultiplier: number = MULTIPLIER_2SEC.DAYS * 30.42 // avg days in a month
    const customMonthMultiplierW: number = MULTIPLIER_2SEC.WEEKS * 4 // rough average
    const monthsTest: Duration = Duration.from('P1M')
    expect(monthsTest.to.seconds(false, customMonthMultiplier)).to.equal(2628288)
    expect(monthsTest.to.seconds(false, customMonthMultiplierW)).to.equal(2419200)

    const customYearMultiplier: number = MULTIPLIER_2SEC.DAYS * 365
    const customYearMultiplierW: number = MULTIPLIER_2SEC.WEEKS * 52
    const yearsTest: Duration = Duration.from('P1Y')
    expect(yearsTest.to.seconds(false, MULTIPLIER_2SEC.MONTHS, customYearMultiplier)).to.equal(31536000)
    expect(yearsTest.to.seconds(false, MULTIPLIER_2SEC.MONTHS, customYearMultiplierW)).to.equal(31449600)
  })

  it('test other time conversions', () => {
    const oneDay: Duration = Duration.from('P1D')
    expect(oneDay.to.seconds()).to.equal(86400)
    expect(oneDay.to.minutes()).to.equal(1440)
    expect(oneDay.to.hours()).to.equal(24)

    const oneMonth: Duration = Duration.from('P1M')
    expect(oneMonth.to.seconds(false)).to.equal(30 * 86400)
    expect(oneMonth.to.minutes(false)).to.equal(30 * 24 * 60)
    expect(oneMonth.to.hours(false)).to.equal(30 * 24)
    expect(oneMonth.to.days(false)).to.equal(30)
    expect(oneMonth.to.weeks(false)).to.closeTo(30 / 7, 0.01)
    expect(oneMonth.to.months(false)).to.equal(1)
    expect(oneMonth.to.years(false)).to.closeTo(1 / 12, 0.01)

    const customYearMultiplier: number = MULTIPLIER_2SEC.DAYS * 365
    const customYearMultiplierW: number = MULTIPLIER_2SEC.WEEKS * 52
    expect(oneMonth.to.years(false, MULTIPLIER_2SEC.MONTHS, customYearMultiplier)).to.closeTo(
      oneMonth.to.days(false) / 365,
      0.01
    )
    expect(oneMonth.to.years(false, MULTIPLIER_2SEC.MONTHS, customYearMultiplierW)).to.closeTo(
      oneMonth.to.weeks(false) / 52,
      0.01
    )
  })
})
