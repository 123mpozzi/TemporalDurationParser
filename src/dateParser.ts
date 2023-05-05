import { DESIGNATORS, ERROR_MSG } from './internal'

/**
 * Represent a format in which a ISO_8601 Duration string can be represented
 */
enum FORMAT_TYPE {
  CLASSIC,
  WEEKS,
  COMBINED
}

/**
 * Initialize an internal {@link Map}  used to represent either
 * the TIME or DAY component of the Duration string.
 *
 * Having different maps make it simple to distinguish between designators
 * with the same character identifier, like *months* and *minutes*, both
 * identified by `'M'`.
 *
 * See the examples below.
 *
 * ---
 * DAYMAP
 * `3Y0M4D`
 * maps into
 * `{ [ 'Y', 3 ], [ 'M', 0 ], [ 'W', 0 ], [ 'D', 4 ] }`
 * ---
 * TIMEMAP
 * `01M1.2S`
 * maps into
 * `{ [ 'H', 0 ], [ 'M', 1 ], [ 'S', 1.2 ] }`
 * ---
 * @param keysArr Array of {@link Duration.DESIGNATORS} to use as keys of the map
 * @returns zero-filled {@link Map} with `keysArr` values as keys
 */
const initMap = (keysArr: DESIGNATORS[]): Map<string, number> => {
  const map = new Map<string, number>()

  for (const d of keysArr) map.set(d, 0)

  return map
}

interface Parser {
  /**
   * Parse an ISO_8601 Duration string
   * @param str ISO_8601 Duration string
   * @param keyMaps contains two arrays of keys representing the DAY and the TIME components respectively
   * @param debug whether to print the internal maps used to represent the Duration attributes
   * @throws on invalid ISO_8601 Duration format {@link RangeError}
   * @returns DAY and TIME maps filled with values
   */
  parse: (str: string, keyMaps: DESIGNATORS[][], debug: boolean) => Array<Map<string, number>>
}

/**
 * Parser implementation for ISO_8601 Duration's {@link FORMAT_TYPE.CLASSIC} format:
 * `P[n]Y[n]M[n]DT[n]H[n]M[n]S`
 */
class ClassicParser implements Parser {
  /**
   * Parse either the DAY or the TIME component of the classic format.
   *
   * For each designator in the component: parse its value and add it to the given map.
   * @param map the {@link Map} to update
   * @param str string representing the component
   * @param debug whether to print the internal maps used to represent the Duration attributes
   * @returns the {@link Map} with updated values
   */
  parseComponent(map: Map<string, number>, str: string, debug: boolean = false): Map<string, number> {
    if (debug) console.log('\ncomponent: ' + str)

    for (const key of map.keys()) {
      // for each attribute
      if (str.includes(key)) {
        // if attribute is present
        const splits = str.split(key)

        str = splits[1] // set to the remaining substring which still need parsing
        map.set(key, parseFloat(splits[0])) // update map with its parsed value
      }
    }

    if (debug) console.log(map.entries())
    return map
  }

  /** @see {@link Parser.parse} */
  parse(str: string, keyMaps: DESIGNATORS[][], debug: boolean = false): Array<Map<string, number>> {
    let dayMap = initMap(keyMaps[0])
    let timeMap = initMap(keyMaps[1])

    if (str.includes(DESIGNATORS.TIME)) {
      // Time component is present: parse it
      const splits = str.split(DESIGNATORS.TIME)
      str = splits[0] // update dayMap string

      if (splits.length === 2) timeMap = this.parseComponent(timeMap, splits[1], debug)
      else throw new RangeError(ERROR_MSG.INVALID_FORMAT)
    }

    dayMap = this.parseComponent(dayMap, str, debug) // always parse Day component

    return [dayMap, timeMap]
  }
}

/**
 * Parser implementation for ISO_8601 Duration's {@link FORMAT_TYPE.WEEKS} format:
 * `P[n]W`
 */
class WeeksParser implements Parser {
  // TODO: throws on invalid string
  /** @see {@link Parser.parse} */
  parse(str: string, keyMaps: DESIGNATORS[][], debug: boolean = false): Array<Map<string, number>> {
    const dayMap = initMap(keyMaps[0])
    const timeMap = initMap(keyMaps[1]) // will be empty in this format

    if (debug) console.log('\ncomponent: ' + str)
    dayMap.set(DESIGNATORS.WEEK, parseFloat(str))
    if (debug) console.log(dayMap.entries())

    return [dayMap, timeMap]
  }
}

/**
 * Parser implementation for ISO_8601 Duration's {@link FORMAT_TYPE.COMBINED} format:
 * `P[n]W`
 */
class CombinedParser implements Parser {
  // TODO: throws on invalid string
  /** @see {@link Parser.parse} */
  parse(str: string, keyMaps: DESIGNATORS[][], debug: boolean = false): Array<Map<string, number>> {
    const dayMap = initMap(keyMaps[0])
    const timeMap = initMap(keyMaps[1])

    // TODO: implement

    return [dayMap, timeMap]
  }
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
  /**
   * Logic used to identify the format of the ISO_8601 string
   * @param str ISO_8601 string
   * @returns the {@link FORMAT_TYPE} of ISO_8601
   */
  private static identifyFormat(str: string): FORMAT_TYPE {
    // TODO: combined check
    if (str.includes(DESIGNATORS.WEEK)) return FORMAT_TYPE.WEEKS
    else return FORMAT_TYPE.CLASSIC
  }

  /** @see {@link Parser.parse} */
  public static build(
    str: string,
    keyMaps: DESIGNATORS[][],
    debug: boolean = false
  ): Array<Map<string, number>> {
    if (!str || str[0] !== DESIGNATORS.PERIOD || str.length < 3)
      throw new RangeError(ERROR_MSG.INVALID_FORMAT)
    str = str.substring(1) // skip P

    const parserMap = new Map([
      [FORMAT_TYPE.CLASSIC, new ClassicParser()],
      [FORMAT_TYPE.WEEKS, new WeeksParser()],
      [FORMAT_TYPE.COMBINED, new CombinedParser()]
    ])

    // Identify which parser to use
    const format = DateParser.identifyFormat(str)
    const parser = parserMap.get(format)
    if (parser == null) throw new RangeError(`Invalid format: ${format}`)

    const [dayMap, timeMap] = parser.parse(str, keyMaps, debug)
    return [dayMap, timeMap]
  }
}
