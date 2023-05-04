import { expect } from "chai";
import { Duration } from "../src/internal";
import { MULTIPLIER_2SEC } from "../src/internal";

describe('TimeConverter', () => {
  it('test custom multipliers', () => {
    const customMonthMultiplier: number = MULTIPLIER_2SEC.DAYS * 30.42;  // avg days in a month
    const customMonthMultiplierW: number = MULTIPLIER_2SEC.WEEKS * 4;  // rough average
    const monthsTest: Duration = Duration.from('P1M');
    expect(monthsTest.to.seconds(false, customMonthMultiplier)).to.equal(2628288);
    expect(monthsTest.to.seconds(false, customMonthMultiplierW)).to.equal(2419200);

    const customYearMultiplier: number = MULTIPLIER_2SEC.DAYS * 365;
    const customYearMultiplierW: number = MULTIPLIER_2SEC.WEEKS * 52;
    const yearsTest: Duration = Duration.from('P1Y');
    expect(yearsTest.to.seconds(false, MULTIPLIER_2SEC.MONTHS, customYearMultiplier)).to.equal(31536000);
    expect(yearsTest.to.seconds(false, MULTIPLIER_2SEC.MONTHS, customYearMultiplierW)).to.equal(31449600);
  });
 });
