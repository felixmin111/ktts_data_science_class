import { merge } from 'lodash-es'

/**
 * Returns a copy of `source` with the translated text of `translation` laid over it. Arrays merge
 * by index, so a translation only repeats the structure, never the code or answers.
 */
export function localize<T extends object>(source: T, translation: object | undefined): T {
  return translation ? merge({}, source, translation) : source
}
