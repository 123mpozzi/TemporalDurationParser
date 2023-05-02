import { Duration } from './duration'

/**
 * Multipliers used to convert attributes into seconds
 */
enum MULTIPLIERS {
  SECONDS = 1,
  MINUTES = 60,
  HOURS = 60 * 60,
  DAYS = 24 * 60 * 60,
  WEEKS = 7 * 24 * 60 * 60,
  MONTHS = 30 * 24 * 60 * 60,
  YEARS = 12 * 30 * 24 * 60 * 60,
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
      throw new RangeError(Duration.ERRORS.BANNED_PARAM)

    // TODO: months and years are variable!!
    return (
      this.duration.seconds +
      this.duration.minutes * MULTIPLIERS.MINUTES +
      this.duration.hours * MULTIPLIERS.HOURS +
      this.duration.days * MULTIPLIERS.DAYS +
      this.duration.weeks * MULTIPLIERS.WEEKS +
      this.duration.months * MULTIPLIERS.MONTHS +
      this.duration.years * MULTIPLIERS.YEARS
    )
  }
}
