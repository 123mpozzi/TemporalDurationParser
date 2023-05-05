import { DateParser } from './internal'
import { TimeConverter } from './internal'

/**
 * Designators are characters used to identify properties inside a ISO_8601 Duration representation
 */
export enum DESIGNATORS {
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
export enum ERROR_MSG {
  INVALID_FORMAT = 'Invalid format for ISO_8601 Duration',
  BANNED_PARAM = 'Blacklisted parameter detected'
}

/**
 * Model component representing an ISO_8601 Duration
 */
export class Duration {
  /** Keys used to represent a {@link Map} of the DAY component */
  private static readonly dayMapKeys = [
    DESIGNATORS.YEAR,
    DESIGNATORS.MONTH,
    DESIGNATORS.WEEK,
    DESIGNATORS.DAY
  ]
  /** Keys used to represent a {@link Map} of the TIME component */
  private static readonly timeMapKeys = [
    DESIGNATORS.HOUR,
    DESIGNATORS.MINUTE,
    DESIGNATORS.SECOND
  ]

  public readonly to: TimeConverter

  public readonly seconds: number
  public readonly minutes: number
  public readonly hours: number
  public readonly days: number
  public readonly weeks: number
  public readonly months: number
  public readonly years: number

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
    const [dayMap, timeMap] = DateParser.build(str, [this.dayMapKeys, this.timeMapKeys], debug)
    return this.fromMaps(dayMap, timeMap);
  }

  /**
   * Initialize a Duration object from maps representing the DAY and TIME components
   * @param dayMap the {@link Map} of the DAY component
   * @param timeMap the {@link Map} of the TIME component
   * @returns new instance of {@link Duration}
   */
  public static fromMaps(dayMap: Map<string, number>, timeMap: Map<string, number>): Duration {
    const seconds = timeMap.get(DESIGNATORS.SECOND) || 0
    const minutes = timeMap.get(DESIGNATORS.MINUTE) || 0
    const hours = timeMap.get(DESIGNATORS.HOUR) || 0

    const days = dayMap.get(DESIGNATORS.DAY) || 0
    const weeks = dayMap.get(DESIGNATORS.WEEK) || 0
    const months = dayMap.get(DESIGNATORS.MONTH) || 0
    const years = dayMap.get(DESIGNATORS.YEAR) || 0

    return new this(years, months, weeks, days, hours, minutes, seconds);
  }
}
