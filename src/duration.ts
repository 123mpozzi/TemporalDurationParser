import { DateParser } from "./dateParser";
import { TimeConverter } from "./timeConverter";

/**
 * Model component representing an ISO_8601 Duration
 */

enum DESIGNATORS {
    PERIOD = 'P',
    TIME = 'T',
    YEAR = 'Y',
    MONTH = 'M',
    WEEK = 'W',
    DAY = 'D',
    HOUR = 'H',
    MINUTE = 'M',
    SECOND = 'S',
}

enum ERRORS {
    INVALID_FORMAT = 'Invalid format for ISO_8601 Duration',
    BANNED_PARAM = 'Blacklisted parameter detected',
}

// ISO_8601 DURATION represenation
export class Duration {
  public static readonly DESIGNATORS = DESIGNATORS;
  public static readonly ERRORS = ERRORS;

  public readonly seconds
  public readonly minutes
  public readonly hours
  public readonly days
  public readonly weeks
  public readonly months
  public readonly years

  constructor (years: number, months: number, weeks: number, days: number, hours: number, minutes: number, seconds: number) {
    this.years = years;
    this.months = months
    this.weeks = weeks;
    this.days= days
    this.hours = hours
    this.minutes = minutes
    this.seconds = seconds
  }

  public static copy(obj: Duration): Duration {
    return new Duration(obj.years, obj.months, obj.weeks, obj.days, obj.hours, obj.minutes, obj.seconds);
  }

  public static from(str: string, debug: boolean = false): Duration {
    return new DateParser(debug).build(str);
  }

  public toSeconds(monthsBanned: boolean = true): number {
    return TimeConverter.toSeconds(this, monthsBanned);
  }
}
