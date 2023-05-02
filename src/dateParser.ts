import { Duration } from './duration'

/**
 * Component responsible for parsing the string and adding data to the Duration model
 *
 * 3 types of parsing
 * -normal
 * -weeks
 * -agreements, with '-'
 */

export class DateParser {
  private readonly debug: boolean
  public static readonly ERR_INVALIDFORMAT = 'Invalid format for ISO_8601 Duration'

  // maps of day and time component
  private dayMap: Map<string, number>
  private timeMap: Map<string, number>

  constructor (debug: boolean = false) {
    this.debug = debug
    // init empty maps
    this.dayMap = this.createDayMap()
    this.timeMap = this.createTimeMap()
  }

  private createDayMap (): Map<string, number> {
    const dayMap: Map<string, number> = new Map()
    dayMap.set(Duration.DESIGNATORS.YEAR, 0)
    dayMap.set(Duration.DESIGNATORS.MONTH, 0)
    dayMap.set(Duration.DESIGNATORS.DAY, 0)
    return dayMap
  }

  private createTimeMap (): Map<string, number> {
    const timeMap: Map<string, number> = new Map()
    timeMap.set(Duration.DESIGNATORS.HOUR, 0)
    timeMap.set(Duration.DESIGNATORS.MINUTE, 0)
    timeMap.set(Duration.DESIGNATORS.SECOND, 0)
    return timeMap
  }

  private parseDayComponent (str: string): void {
    this.dayMap = this.parseComponent(this.dayMap, str)
  }

  private parseTimeComponent (str: string): void {
    this.timeMap = this.parseComponent(this.timeMap, str)
  }

  // TODO: P0.5Y
  // TODO:  "PT36H" could be used as well as "P1DT12H"
  private parseComponent (
    map: Map<string, number>,
    str: string
  ): Map<string, number> {
    if (this.debug === true) console.log('\ncomponent: ' + str)
    var splits
    for (const key of map.keys()) {
      // if param is present
      if (str.includes(key)) {
        splits = str.split(key)

        str = splits[1]
        map.set(key, parseFloat(splits[0])) // TODO: parseInt checks?
      }
    }

    if (this.debug === true) console.log(map.entries())
    return map
  }

  // throw new RangeError('message')
  public build (str: string): Duration {
    // P signals the start of the duration representation
    // it indicates that the following string represents a duration of time
    // rather than a specific point in time.
    if (!str || str[0] != Duration.DESIGNATORS.PERIOD || str.length < 3) {
      throw new RangeError(DateParser.ERR_INVALIDFORMAT)
    }
    str = str.substring(1) // skip P

    if (str.includes(Duration.DESIGNATORS.TIME)) {
      const splits = str.split(Duration.DESIGNATORS.TIME)

      if (splits.length == 2) {
        this.parseDayComponent(splits[0])
        this.parseTimeComponent(splits[1])
      } else {
        // invalid
        throw new RangeError(DateParser.ERR_INVALIDFORMAT)
      }
    } else {
      // no Time component
      this.parseDayComponent(str)
    }

    return this.createModel()
  }

  private createModel (): Duration {
    const seconds = this.timeMap.get(Duration.DESIGNATORS.SECOND) || 0
    const minutes = this.timeMap.get(Duration.DESIGNATORS.MINUTE) || 0
    const hours = this.timeMap.get(Duration.DESIGNATORS.HOUR) || 0

    const days = this.dayMap.get(Duration.DESIGNATORS.DAY) || 0
    const months = this.dayMap.get(Duration.DESIGNATORS.MONTH) || 0
    const years = this.dayMap.get(Duration.DESIGNATORS.YEAR) || 0
    return new Duration(years, months, days, hours, minutes, seconds)
  }
}
