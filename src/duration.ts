// ISO_8601 DURATION represenation
export class Duration {
  readonly PERIOD_DESIGNATOR: string = 'P'
  readonly TIME_DESIGNATOR: string = 'T'
  readonly YEAR_DESIGNATOR: string = 'Y'
  readonly MONTH_DESIGNATOR: string = 'M'
  readonly DAY_DESIGNATOR: string = 'D'
  readonly HOUR_DESIGNATOR: string = 'H'
  readonly MINUTE_DESIGNATOR: string = 'M'
  readonly SECOND_DESIGNATOR: string = 'S'

  // maps of day and time component
  private dayMap: Map<string, number>
  private timeMap: Map<string, number>

  constructor () {
    // init empty maps
    this.dayMap = this.createDayMap()
    this.timeMap = this.createTimeMap()
  }

  private createDayMap (): Map<string, number> {
    const dayMap: Map<string, number> = new Map()
    dayMap.set(this.YEAR_DESIGNATOR, 0)
    dayMap.set(this.MONTH_DESIGNATOR, 0)
    dayMap.set(this.DAY_DESIGNATOR, 0)
    return dayMap
  }

  private createTimeMap (): Map<string, number> {
    const timeMap: Map<string, number> = new Map()
    timeMap.set(this.HOUR_DESIGNATOR, 0)
    timeMap.set(this.MINUTE_DESIGNATOR, 0)
    timeMap.set(this.SECOND_DESIGNATOR, 0)
    return timeMap
  }

  parseDayComponent (str: string): Duration {
    this.dayMap = this.parseComponent(this.dayMap, str)
    return this
  }

  parseTimeComponent (str: string): Duration {
    this.timeMap = this.parseComponent(this.timeMap, str)
    return this
  }

  // TODO: P0.5Y
  // TODO:  "PT36H" could be used as well as "P1DT12H"
  private parseComponent (
    map: Map<string, number>,
    str: string
  ): Map<string, number> {
    console.log(str)
    var splits
    for (const key of map.keys()) {
      // if param is present
      if (str.includes(key)) {
        splits = str.split(key)

        str = splits[1]
        map.set(key, parseInt(splits[0])) // TODO: parseInt checks?
      }
    }

    console.log(map.entries()) // TODO: remove: debug
    return map
  }

  getTotalSeconds (): number {
    const seconds = this.timeMap.get(this.SECOND_DESIGNATOR) || 0
    const minutes = this.timeMap.get(this.MINUTE_DESIGNATOR) || 0
    const hours = this.timeMap.get(this.HOUR_DESIGNATOR) || 0

    const days = this.dayMap.get(this.DAY_DESIGNATOR) || 0
    const months = this.dayMap.get(this.MONTH_DESIGNATOR) || 0
    const years = this.dayMap.get(this.YEAR_DESIGNATOR) || 0

    // TODO: months and years are variable!!
    return (
      seconds +
      minutes * 60 +
      hours * 60 * 60 +
      days * 24 * 60 * 60 +
      months * 30 * 24 * 60 * 60 +
      years * 12 * 30 * 24 * 60 * 60
    )
  }
}
