/**
 * Component responsible for handling time conversions
 */

import { Duration } from './duration'

export class TimeConverter {
  public static toSeconds (obj: Duration, monthsBanned: boolean = true): number {
    // the month value cannot be used for the conversion and shall result in an error if not set to 0
    if (obj.months > 0 && monthsBanned === true)
      throw new RangeError(Duration.ERRORS.BANNED_PARAM)

    // TODO: months and years are variable!!
    return (
      obj.seconds +
      obj.minutes * 60 +
      obj.hours * 60 * 60 +
      obj.days * 24 * 60 * 60 +
      obj.weeks * 7 * 24 * 60 * 60 +
      obj.months * 30 * 24 * 60 * 60 +
      obj.years * 12 * 30 * 24 * 60 * 60
    )
  }
}
