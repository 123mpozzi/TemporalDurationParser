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
}
