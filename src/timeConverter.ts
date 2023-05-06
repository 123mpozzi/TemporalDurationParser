import { type Duration, ERROR_MSG } from './internal'

/**
 * Multipliers used to convert attributes into seconds
 */
export enum MULTIPLIER_2SEC {
  SECONDS = 1,
  MINUTES = 60 * SECONDS,
  HOURS = 60 * MINUTES,
  DAYS = 24 * HOURS,
  WEEKS = 7 * DAYS,
  /**
   * Note that MONTHS are not fixed length, here they are represented as 30 \* DAYS
   */
  MONTHS = 30 * DAYS,
  /**
   * Note that YEARS are not fixed length, here they are represented as 12 \* MONTHS
   */
  YEARS = 12 * MONTHS
}

/**
 * Component responsible for handling time conversions in ISO_8601 Duration
 */
export class TimeConverter {
  private readonly duration: Duration

  constructor(duration: Duration) {
    this.duration = duration
  }

  /**
   * Sum the attributes of a Duration object to calculate the total seconds
   * @param monthsBanned whether the month attribute is banned (a {@link RangeError} will be thrown if not set to `0`)
   * @param monthsMultiplicator define a custom multiplicator to convert months into seconds
   * @param yearsMultiplicator define a custom multiplicator to convert years into seconds (eg. could use 365 * {@link MULTIPLIER_2SEC.DAYS})
   * @returns total Duration time in seconds
   * @throws on using banned parameters {@link RangeError}
   */
  public seconds(
    monthsBanned: boolean = true,
    monthsMultiplicator: number = MULTIPLIER_2SEC.MONTHS,
    yearsMultiplicator: number = MULTIPLIER_2SEC.YEARS
  ): number {
    // the month value cannot be used for the conversion and shall result in an error if not set to 0
    if (this.duration.months > 0 && monthsBanned) throw new RangeError(ERROR_MSG.BANNED_PARAM)

    return (
      this.duration.seconds +
      this.duration.minutes * MULTIPLIER_2SEC.MINUTES +
      this.duration.hours * MULTIPLIER_2SEC.HOURS +
      this.duration.days * MULTIPLIER_2SEC.DAYS +
      this.duration.weeks * MULTIPLIER_2SEC.WEEKS +
      this.duration.months * monthsMultiplicator +
      this.duration.years * yearsMultiplicator
    )
  }

  /** @see {@link seconds} */
  public minutes(
    monthsBanned: boolean = true,
    monthsMultiplicator: number = MULTIPLIER_2SEC.MONTHS,
    yearsMultiplicator: number = MULTIPLIER_2SEC.YEARS
  ): number {
    return (
      this.seconds(monthsBanned, monthsMultiplicator, yearsMultiplicator) /
      (MULTIPLIER_2SEC.MINUTES / MULTIPLIER_2SEC.SECONDS)
    )
  }

  /** @see {@link seconds} */
  public hours(
    monthsBanned: boolean = true,
    monthsMultiplicator: number = MULTIPLIER_2SEC.MONTHS,
    yearsMultiplicator: number = MULTIPLIER_2SEC.YEARS
  ): number {
    return (
      this.seconds(monthsBanned, monthsMultiplicator, yearsMultiplicator) /
      (MULTIPLIER_2SEC.HOURS / MULTIPLIER_2SEC.SECONDS)
    )
  }

  /** @see {@link seconds} */
  public days(
    monthsBanned: boolean = true,
    monthsMultiplicator: number = MULTIPLIER_2SEC.MONTHS,
    yearsMultiplicator: number = MULTIPLIER_2SEC.YEARS
  ): number {
    return (
      this.seconds(monthsBanned, monthsMultiplicator, yearsMultiplicator) /
      (MULTIPLIER_2SEC.DAYS / MULTIPLIER_2SEC.SECONDS)
    )
  }

  /** @see {@link seconds} */
  public weeks(
    monthsBanned: boolean = true,
    monthsMultiplicator: number = MULTIPLIER_2SEC.MONTHS,
    yearsMultiplicator: number = MULTIPLIER_2SEC.YEARS
  ): number {
    return (
      this.seconds(monthsBanned, monthsMultiplicator, yearsMultiplicator) /
      (MULTIPLIER_2SEC.WEEKS / MULTIPLIER_2SEC.SECONDS)
    )
  }

  /** @see {@link years} */
  public months(
    monthsBanned: boolean = true,
    monthsMultiplicator: number = MULTIPLIER_2SEC.MONTHS,
    yearsMultiplicator: number = MULTIPLIER_2SEC.YEARS
  ): number {
    return (
      this.seconds(monthsBanned, monthsMultiplicator, yearsMultiplicator) /
      (MULTIPLIER_2SEC.MONTHS / MULTIPLIER_2SEC.SECONDS)
    )
  }

  /**
   * @see {@link seconds}
   *
   * @example
   * // With custom multipliers:
   *
   * const oneMonth: Duration = Duration.from('P1M')
   * const yearAsDays: number = MULTIPLIER_2SEC.DAYS * 365
   * const yearAsWeeks: number = MULTIPLIER_2SEC.WEEKS * 52
   * // result is close (+- 0.01) to: oneMonth.to.days(false) / 365
   * oneMonth.to.years(false, MULTIPLIER_2SEC.MONTHS, yearAsDays)
   * // result is close (+- 0.01) to: oneMonth.to.weeks(false) / 52
   * oneMonth.to.years(false, MULTIPLIER_2SEC.MONTHS, yearAsWeeks)
   *
   */
  public years(
    monthsBanned: boolean = true,
    monthsMultiplicator: number = MULTIPLIER_2SEC.MONTHS,
    yearsMultiplicator: number = MULTIPLIER_2SEC.YEARS
  ): number {
    return (
      this.seconds(monthsBanned, monthsMultiplicator, yearsMultiplicator) /
      (MULTIPLIER_2SEC.YEARS / MULTIPLIER_2SEC.SECONDS)
    )
  }
}
