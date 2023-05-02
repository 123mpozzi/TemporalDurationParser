import { Duration } from './duration'

/**
 * Represent a format in which a ISO_8601 Duration string can be represented
 */
enum FORMAT_TYPE {
  CLASSIC,
  WEEKS,
  COMBINED,
}

/**
 * Component responsible for parsing the string and adding data to the Duration model
 *
 * 3 types of parsing
 * - classic  
 *   `P[n]Y[n]M[n]DT[n]H[n]M[n]S`
 * - weeks  
 *   `P[n]W`
 * - combined  
 *   `P0003-06-04T12:30:05`
 *
 * The last one is not yet implemented, here is its description:  
 * 
 * Alternatively, a format for duration based on combined date and time
 * representations may be used by agreement between the communicating parties either
 * in the basic format PYYYYMMDDThhmmss or in the extended format
 * P[YYYY]-[MM]-[DD]T[hh]:[mm]:[ss]. For example, the first duration shown above
 * would be "P0003-06-04T12:30:05". However, individual date and time values cannot
 * exceed their moduli (e.g. a value of 13 for the month or 25 for the hour would
 * not be permissible).
 *
 */
export class DateParser {
  private readonly debug: boolean

  // maps of day and time component
  /**
   * {@link Map} representation of the Day component  
   * 
   * eg. `3Y0M4D` becomes `{ [ 'Y', 3 ], [ 'M', 0 ], [ 'W', 0 ], [ 'D', 4 ] }`
   */
  private dayMap: Map<string, number>
  /**
   * {@link Map}  representation of the Time component  
   * 
   * eg. `01M1.2S` becomes `{ [ 'H', 0 ], [ 'M', 1 ], [ 'S', 1.2 ] }`
   */
  private timeMap: Map<string, number>

  constructor (debug: boolean = false) {
    this.debug = debug
    // init maps with values set to 0
    this.dayMap = this.initDayMap()
    this.timeMap = this.initTimeMap()
  }

  /**
   * Initialize an internal {@link Map}  used to represent the Day component.  
   * 
   * This is useful because I can easily distinguish between *months* and
   * *minutes*, which have the same `'M'` designator
   * @returns zero-filled {@link Map} with keys representing attributes of the Day component
   */
  private initDayMap (): Map<string, number> {
    const dayMap: Map<string, number> = new Map()
    dayMap.set(Duration.DESIGNATORS.YEAR, 0)
    dayMap.set(Duration.DESIGNATORS.MONTH, 0)
    dayMap.set(Duration.DESIGNATORS.WEEK, 0)
    dayMap.set(Duration.DESIGNATORS.DAY, 0)
    return dayMap
  }

  /**
   * Initialize an internal {@link Map}  used to represent the Time component.  
   * 
   * This is useful because I can easily distinguish between *months* and
   * *minutes*, which have the same `'M'` designator
   * @returns zero-filled {@link Map} with keys representing attributes of the Time component
   */
  private initTimeMap (): Map<string, number> {
    const timeMap: Map<string, number> = new Map()
    timeMap.set(Duration.DESIGNATORS.HOUR, 0)
    timeMap.set(Duration.DESIGNATORS.MINUTE, 0)
    timeMap.set(Duration.DESIGNATORS.SECOND, 0)
    return timeMap
  }

  /**
   * Fill the internal {@link dayMap} with data from Temporal.Duration's day component
   * @param str Temporal.Duration's day component (substring before the `'T'`)
   */
  private parseDayComponent (str: string): void {
    this.dayMap = this.parseComponent(this.dayMap, str)
  }

  /**
   * Fill the internal {@link timeMap} with data from Temporal.Duration's time component
   * @param str Temporal.Duration's time component (substring after the `'T'`)
   */
  private parseTimeComponent (str: string): void {
    this.timeMap = this.parseComponent(this.timeMap, str)
  }

  /**
   * Parse a component of the classic format: either the Day component or the Time component
   * @param map the {@link Map} to fill with the parsed values
   * @param str string to parse attributes from
   * @returns the {@link Map} filled with parsed attributes
   */
  private parseComponent (
    map: Map<string, number>,
    str: string
  ): Map<string, number> {
    if (this.debug === true) console.log('\ncomponent: ' + str)
    let splits
    for (const key of map.keys()) {
      // if param is present
      if (str.includes(key)) {
        splits = str.split(key)

        str = splits[1]
        map.set(key, parseFloat(splits[0]))
      }
    }

    if (this.debug === true) console.log(map.entries())
    return map
  }

  /**
   * Parse the classic format: `P[n]Y[n]M[n]DT[n]H[n]M[n]S`
   * @param str string to parse
   * @throws on invalid ISO_8601 format {@link RangeError}
   */
  private parseClassicFormat(str: string): void {
    if (str.includes(Duration.DESIGNATORS.TIME)) {
      const splits = str.split(Duration.DESIGNATORS.TIME)

      if (splits.length == 2) {
        this.parseDayComponent(splits[0])
        this.parseTimeComponent(splits[1])
      } else {
        // invalid
        throw new RangeError(Duration.ERRORS.INVALID_FORMAT)
      }
    } else {
      // there is no Time component
      this.parseDayComponent(str)
    }
  }

  /**
   * Parse the weeks format: `P[n]W`
   * @param str string to parse
   */
  private parseWeeksFormat (str: string): void {
    if (this.debug === true) console.log('\ncomponent: ' + str)
    this.dayMap.set(Duration.DESIGNATORS.WEEK, parseFloat(str))
    if (this.debug === true) console.log(this.dayMap.entries())
  }

  /**
   * Parse the string
   * @param str string to parse
   * @param formatType {@link FORMAT_TYPE} of the ISO_8601 string
   */
  private parseFormat(str: string, formatType: FORMAT_TYPE) {
    if (formatType === FORMAT_TYPE.WEEKS) {
      this.parseWeeksFormat(str)
    } else {
      this.parseClassicFormat(str)
    }
  }

  /**
   * Logic used to identify which format the string to parse is written in
   * @param str string to parse
   * @returns the {@link FORMAT_TYPE} of ISO_8601
   */
  private identifyFormat(str: string): FORMAT_TYPE {
    if (str.includes(Duration.DESIGNATORS.WEEK)) {
      return FORMAT_TYPE.WEEKS;
    } else {
      return FORMAT_TYPE.CLASSIC;
    }
  }

  /**
   * Build a {@link Duration} object by fetching values from the internal maps
   * @param str 
   * @returns model filled with attributes from {@link dayMap} and {@link timeMap} 
   * @throws on invalid ISO_8601 format {@link RangeError}
   */
  public build (str: string): Duration {
    // P signals the start of the duration representation
    // it indicates that the following string represents a
    // duration of time rather than a specific point in time.
    if (!str || str[0] != Duration.DESIGNATORS.PERIOD || str.length < 3)
      throw new RangeError(Duration.ERRORS.INVALID_FORMAT)
    str = str.substring(1) // skip P

    const formatType = this.identifyFormat(str);
    this.parseFormat(str, formatType);

    return this.createModel()
  }

  /**
   * Create a {@link Duration} model with the attributes inside {@link dayMap} and {@link timeMap}
   * @returns resulting model
   */
  private createModel (): Duration {
    const seconds = this.timeMap.get(Duration.DESIGNATORS.SECOND) || 0
    const minutes = this.timeMap.get(Duration.DESIGNATORS.MINUTE) || 0
    const hours = this.timeMap.get(Duration.DESIGNATORS.HOUR) || 0

    const days = this.dayMap.get(Duration.DESIGNATORS.DAY) || 0
    const weeks = this.dayMap.get(Duration.DESIGNATORS.WEEK) || 0
    const months = this.dayMap.get(Duration.DESIGNATORS.MONTH) || 0
    const years = this.dayMap.get(Duration.DESIGNATORS.YEAR) || 0

    return new Duration(years, months, weeks, days, hours, minutes, seconds)
  }
}
