// TODO: Alternatively, a format for duration based on combined date and time representations may be used by agreement between the communicating parties either in the basic format PYYYYMMDDThhmmss or in the extended format P[YYYY]-[MM]-[DD]T[hh]:[mm]:[ss]. For example, the first duration shown above would be "P0003-06-04T12:30:05". However, individual date and time values cannot exceed their moduli (e.g. a value of 13 for the month or 25 for the hour would not be permissible).

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
    DAY = 'D',
    HOUR = 'H',
    MINUTE = 'M',
    SECOND = 'S',
}

enum ERRORS {
    INVALID_FORMAT = 'Invalid format for ISO_8601 Duration',
    BANNED_PARAM = 'Blacklisted parameter detected',
}

// TODO: weeks!! W

// TODO: represent everything internally via variables(days,weeks,seconds), and then try to parse the different formats (1: standard, 2: via weeks, 3: via 'agreement' -> the one with '-')

// ISO_8601 DURATION represenation
export class Duration {
  public static readonly DESIGNATORS = DESIGNATORS;
  public static readonly ERRORS = ERRORS;

  public readonly seconds
  public readonly minutes
  public readonly hours
  public readonly days
  public readonly months
  public readonly years

  // it is lazy: it does not check on constructor, it just initializes its internal variables
  // checks are on parseDuration();
  constructor (years: number, months: number, days: number, hours: number, minutes: number, seconds: number) {
    this.years = years;
    this.months = months
    this.days= days
    this.hours = hours
    this.minutes = minutes
    this.seconds = seconds
  }

  public static fromObj(obj: Duration): Duration {
    return new Duration(obj.years, obj.months, obj.days, obj.hours, obj.minutes, obj.seconds);
  }

  public static from(str: string): Duration {
    return new DateParser().build(str);
  }

  public toSeconds(monthsBanned: boolean = true): number {
    return TimeConverter.toSeconds(this, monthsBanned);
  }
}
