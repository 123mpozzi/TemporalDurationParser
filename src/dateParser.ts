import { Duration } from './duration'

/**
 * Represent a format in which a ISO_8601 Duration string can be represented
 */
enum FORMAT_TYPE {
  CLASSIC,
  WEEKS,
  COMBINED
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

  /**
   * {@link Map} representation of the DAY component
   *
   * eg. `3Y0M4D` becomes `{ [ 'Y', 3 ], [ 'M', 0 ], [ 'W', 0 ], [ 'D', 4 ] }`
   */
  private dayMap: Map<string, number>
  /**
   * {@link Map}  representation of the TIME component
   *
   * eg. `01M1.2S` becomes `{ [ 'H', 0 ], [ 'M', 1 ], [ 'S', 1.2 ] }`
   */
  private timeMap: Map<string, number>

  constructor (debug: boolean = false) {
    this.debug = debug

    const dayMapKeys = [
      Duration.DESIGNATORS.YEAR,
      Duration.DESIGNATORS.MONTH,
      Duration.DESIGNATORS.WEEK,
      Duration.DESIGNATORS.DAY
    ]
    this.dayMap = this.initMap(dayMapKeys)

    const timeMapKeys = [
      Duration.DESIGNATORS.HOUR,
      Duration.DESIGNATORS.MINUTE,
      Duration.DESIGNATORS.SECOND
    ]
    this.timeMap = this.initMap(timeMapKeys)
  }

  /**
   * Initialize an internal {@link Map}  used to represent either
   * the TIME or DAY component of the Duration string.
   *
   * Having different maps make it simple to distinguish between designators
   * with the same character identifier, like *months* and *minutes*, both
   * identified by `'M'`.
   * 
   * @param arr Array of {@link Duration.DESIGNATORS} to use as keys of the map
   * @returns zero-filled {@link Map} with `arr` values as keys
   */
  private initMap (arr: Array<any>): Map<string, number> {
    const map: Map<string, number> = new Map()

    for (const d of arr)
      map.set(d, 0)

    return map
  }
  
  /**
   * Parse either the DAY or the TIME component of the classic format.
   * 
   * For each designator in the component: parse its value and add it to the given map.
   * @param map the {@link Map} to update
   * @param str string representing the component
   * @returns the {@link Map} with updated values
   */
  private parseComponent (
    map: Map<string, number>,
    str: string
  ): Map<string, number> {
    if (this.debug === true) console.log('\ncomponent: ' + str)

    for (const key of map.keys()) {  // for each attribute
      if (str.includes(key)) {  // if attribute is present
        const splits = str.split(key)

        str = splits[1]  // set to the remaining substring which still need parsing
        map.set(key, parseFloat(splits[0]))  // update map with its parsed value
      }
    }

    if (this.debug === true) console.log(map.entries())
    return map
  }

  /**
   * Parse the {@link FORMAT_TYPE.CLASSIC} format: `P[n]Y[n]M[n]DT[n]H[n]M[n]S`
   * @param str ISO_8601 string
   * @throws on invalid ISO_8601 format {@link RangeError}
   */
  private parseClassicFormat (str: string): void {
    if (str.includes(Duration.DESIGNATORS.TIME)) {  // Time component is present: parse it
      const splits = str.split(Duration.DESIGNATORS.TIME)

      if (splits.length == 2)
        this.timeMap = this.parseComponent(this.timeMap, splits[1])
      else
        throw new RangeError(Duration.ERROR_MSG.INVALID_FORMAT)
    }
    
    this.dayMap = this.parseComponent(this.dayMap, str)  // always parse Day component
  }

  /**
   * Parse the {@link FORMAT_TYPE.WEEKS} format: `P[n]W`
   * @param str ISO_8601 string
   * // TODO: throws on invalid string
   */
  private parseWeeksFormat (str: string): void {
    if (this.debug === true) console.log('\ncomponent: ' + str)
    this.dayMap.set(Duration.DESIGNATORS.WEEK, parseFloat(str))
    if (this.debug === true) console.log(this.dayMap.entries())
  }

  /**
   * Parse ISO_8601 string of given format
   * @param str ISO_8601 string
   * @param formatType {@link FORMAT_TYPE} of the ISO_8601 string
   */
  private parseFormat (str: string, formatType: FORMAT_TYPE) {
    if (formatType === FORMAT_TYPE.WEEKS)
      this.parseWeeksFormat(str)
    else
      this.parseClassicFormat(str)
  }

  /**
   * Logic used to identify the format of the ISO_8601 string
   * @param str ISO_8601 string
   * @returns the {@link FORMAT_TYPE} of ISO_8601
   */
  private identifyFormat (str: string): FORMAT_TYPE {
    if (str.includes(Duration.DESIGNATORS.WEEK))
      return FORMAT_TYPE.WEEKS
    else
      return FORMAT_TYPE.CLASSIC
  }

  /**
   * Build a {@link Duration} object by fetching values from the internal maps
   * after parsing an ISO_8601 string
   * @param str ISO_8601 string
   * @returns model filled with attributes from {@link dayMap} and {@link timeMap}
   * @throws on invalid ISO_8601 format {@link RangeError}
   */
  public build (str: string): Duration {
    if (!str || str[0] != Duration.DESIGNATORS.PERIOD || str.length < 3)
      throw new RangeError(Duration.ERROR_MSG.INVALID_FORMAT)
    str = str.substring(1)  // skip P

    // Identify the format and parse the ISO_8601 string
    this.parseFormat(str, this.identifyFormat(str))

    return this.createModel()
  }

  /**
   * Create a {@link Duration} model and fill it with the attributes
   * inside {@link dayMap} and {@link timeMap}
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
