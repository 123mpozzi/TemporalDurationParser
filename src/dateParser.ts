import { DESIGNATORS, ERROR_MSG } from './internal'
import type { Duration } from './internal'

/**
 * Represent a format in which a ISO_8601 Duration string can be represented
 */
enum FORMAT_TYPE {
  CLASSIC,
  WEEKS,
  COMBINED
}

/**
 * Parser of the ISO_8601 Duration's {@link FORMAT_TYPE.CLASSIC} format:  
 * `P[n]Y[n]M[n]DT[n]H[n]M[n]S`
 */
class ClassicParser {
  /**
   * Parse either the DAY or the TIME component of the classic format.
   * 
   * For each designator in the component: parse its value and add it to the given map.
   * @param map the {@link Map} to update
   * @param str string representing the component
   * @param debug whether to print the internal maps used to represent the Duration attributes
   * @returns the {@link Map} with updated values
   */
  private static parseComponent (
    map: Map<string, number>,
    str: string,
    debug: boolean = false
  ): Map<string, number> {
    if (debug === true) console.log('\ncomponent: ' + str)

    for (const key of map.keys()) {  // for each attribute
      if (str.includes(key)) {  // if attribute is present
        const splits = str.split(key)

        str = splits[1]  // set to the remaining substring which still need parsing
        map.set(key, parseFloat(splits[0]))  // update map with its parsed value
      }
    }

    if (debug === true) console.log(map.entries())
    return map
  }

  /** @see {@link DateParser.parse} */
  public static parse(str: string, keyMaps: Array<Array<DESIGNATORS>>, debug: boolean = false): Array<Map<string, number>> {
    let dayMap = DateParser.initMap(keyMaps[0]);
    let timeMap = DateParser.initMap(keyMaps[1]);

    if (str.includes(DESIGNATORS.TIME)) {  // Time component is present: parse it
      const splits = str.split(DESIGNATORS.TIME)

      if (splits.length == 2)
        timeMap = ClassicParser.parseComponent(timeMap, splits[1], debug)
      else
        throw new RangeError(ERROR_MSG.INVALID_FORMAT)
    }
    
    dayMap = ClassicParser.parseComponent(dayMap, str, debug)  // always parse Day component

    return [dayMap, timeMap]
  }
}

/**
 * Parser of the ISO_8601 Duration's {@link FORMAT_TYPE.WEEKS} format:  
 * `P[n]W`
 */
class WeeksParser {
  // TODO: throws on invalid string
  /** @see {@link DateParser.parse} */
  public static parse(str: string, keyMaps: Array<Array<DESIGNATORS>>, debug: boolean = false): Array<Map<string, number>> {
    let dayMap = DateParser.initMap(keyMaps[0]);
    let timeMap = DateParser.initMap(keyMaps[1]);  // will be empty in this format

    if (debug === true) console.log('\ncomponent: ' + str)
    dayMap.set(DESIGNATORS.WEEK, parseFloat(str))
    if (debug === true) console.log(dayMap.entries())
    
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
  public static initMap (keysArr: Array<DESIGNATORS>): Map<string, number> {
    const map: Map<string, number> = new Map()

    for (const d of keysArr)
      map.set(d, 0)

    return map
  }

  /**
   * Logic used to identify the format of the ISO_8601 string
   * @param str ISO_8601 string
   * @returns the {@link FORMAT_TYPE} of ISO_8601
   */
  private static identifyFormat (str: string): FORMAT_TYPE {
    if (str.includes(DESIGNATORS.WEEK))
      return FORMAT_TYPE.WEEKS
    else
      return FORMAT_TYPE.CLASSIC
  }

  /**
   * Parse an ISO_8601 Duration string
   * @param str ISO_8601 Duration string
   * @param keyMaps contains two arrays of keys representing the DAY and the TIME components respectively 
   * @param debug whether to print the internal maps used to represent the Duration attributes
   * @throws on invalid ISO_8601 Duration format {@link RangeError}
   * @returns DAY and TIME maps filled with values
   */
  private static parse(str: string, keyMaps: Array<Array<DESIGNATORS>>, debug: boolean = false): Array<Map<string, number>> {
    const formatType = DateParser.identifyFormat(str);

    if(formatType === FORMAT_TYPE.CLASSIC)
      return ClassicParser.parse(str, keyMaps, debug);
    else
      return WeeksParser.parse(str, keyMaps, debug);
  }

  /** @see {@link DateParser.parse} */
  public static build (str: string, keyMaps: Array<Array<DESIGNATORS>>, debug: boolean = false): Array<Map<string, number>> {
    if (!str || str[0] != DESIGNATORS.PERIOD || str.length < 3)
      throw new RangeError(ERROR_MSG.INVALID_FORMAT)
    str = str.substring(1)  // skip P

    // Identify the format and parse the ISO_8601 string
    const [dayMap, timeMap] = this.parse(str, keyMaps, debug);
    return [dayMap, timeMap];
  }
}
