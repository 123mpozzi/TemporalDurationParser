import { Duration, ERROR_MSG } from './internal'

/**
 * Multipliers used to convert attributes into seconds
 */
enum MULTIPLIER_2SEC {
  SECONDS = 1,
  MINUTES = 60 * SECONDS,
  HOURS = 60 * MINUTES,
  DAYS = 24 * HOURS,
  WEEKS = 7 * DAYS,
  MONTHS = 30 * DAYS,
  YEARS = 12 * MONTHS,
}

/**
 * Component responsible for handling time conversions in ISO_8601 Duration
 */
export class TimeConverter {

  private readonly duration: Duration

  constructor (duration: Duration) {
    this.duration = duration
  }

  /**
   * Sum the attributes of a Duration object to calculate the total seconds
   * @param monthsBanned whether the month attribute is banned (a {@link RangeError} will be thrown if not set to `0`)
   * @returns total Duration time in seconds
   * @throws on using banned parameters {@link RangeError}
   */
  public seconds (monthsBanned: boolean = true): number {
    // the month value cannot be used for the conversion and shall result in an error if not set to 0
    if (this.duration.months > 0 && monthsBanned === true)
      throw new RangeError(ERROR_MSG.BANNED_PARAM)

    // TODO: months and years are variable!!
    return (
      this.duration.seconds +
      this.duration.minutes * MULTIPLIER_2SEC.MINUTES +
      this.duration.hours * MULTIPLIER_2SEC.HOURS +
      this.duration.days * MULTIPLIER_2SEC.DAYS +
      this.duration.weeks * MULTIPLIER_2SEC.WEEKS +
      this.duration.months * MULTIPLIER_2SEC.MONTHS +
      this.duration.years * MULTIPLIER_2SEC.YEARS
    )
  }
}
