import { DateParser } from './dateParser'
import { TimeConverter } from './timeConverter'

/**
 * Designators are characters used to identify properties inside a ISO_8601 Duration representation
 */
enum DESIGNATORS {
  /**
   * The Period designator signals the start of the Duration representation  
   * It indicates that the following string represents a 
   * duration of time rather than a specific point in time.
   */
  PERIOD = 'P',
  TIME = 'T',
  YEAR = 'Y',
  MONTH = 'M',
  WEEK = 'W',
  DAY = 'D',
  HOUR = 'H',
  MINUTE = 'M',
  SECOND = 'S'
}

/**
 * Error messages for ISO_8601 Duration parsing
 */
enum ERROR_MSG {
  INVALID_FORMAT = 'Invalid format for ISO_8601 Duration',
  BANNED_PARAM = 'Blacklisted parameter detected'
}

/**
 * Model component representing an ISO_8601 Duration
 */
export class Duration {
  public static readonly DESIGNATORS = DESIGNATORS
  public static readonly ERROR_MSG = ERROR_MSG

  public readonly to: TimeConverter

  public readonly seconds
  public readonly minutes
  public readonly hours
  public readonly days
  public readonly weeks
  public readonly months
  public readonly years

  constructor (
    years: number,
    months: number,
    weeks: number,
    days: number,
    hours: number,
    minutes: number,
    seconds: number
  ) {
    this.years = years
    this.months = months
    this.weeks = weeks
    this.days = days
    this.hours = hours
    this.minutes = minutes
    this.seconds = seconds

    this.to = new TimeConverter(this)
  }

  /**
   * Initialize a Duration object by cloning another Duration object
   * @param obj object to clone from
   * @returns new Instance of {@link Duration} cloned from the given object
   */
  public static copy (obj: Duration): Duration {
    return new Duration(
      obj.years,
      obj.months,
      obj.weeks,
      obj.days,
      obj.hours,
      obj.minutes,
      obj.seconds
    )
  }

  /**
   * Initialize a Duration object by parsing a ISO_8601 string
   * @param str ISO_8601 string to parse
   * @param debug whether to print the internal state of attribute maps on creation
   * @returns new instance of {@link Duration} built from the parsed string
   */
  public static from (str: string, debug: boolean = false): Duration {
    return new DateParser(debug).build(str)
  }
}
