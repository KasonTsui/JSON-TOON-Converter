/**
 * Converts a parsed JS value into TOON format string.
 * TOON: no whitespace, unquoted object keys, quoted string values.
 */
function valueToToon(value) {
  if (value === null) return 'null'
  if (typeof value === 'boolean') return String(value)
  if (typeof value === 'number') return String(value)
  if (typeof value === 'string') return JSON.stringify(value)

  if (Array.isArray(value)) {
    return '[' + value.map(valueToToon).join(',') + ']'
  }

  if (typeof value === 'object') {
    const pairs = Object.entries(value).map(([k, v]) => {
      // Use unquoted key if it's a valid identifier, else fallback to quoted
      const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : JSON.stringify(k)
      return key + ':' + valueToToon(v)
    })
    return '{' + pairs.join(',') + '}'
  }

  return String(value)
}

/**
 * Converts a JSON string to TOON format.
 * Throws if the input is not valid JSON.
 */
export function jsonToToon(jsonString) {
  if (!jsonString || !jsonString.trim()) return ''
  const parsed = JSON.parse(jsonString)
  return valueToToon(parsed)
}

/**
 * Converts a TOON string back to formatted JSON.
 * Adds quotes around unquoted object keys before parsing.
 * Throws if the input cannot be parsed.
 */
export function toonToJson(toonString) {
  if (!toonString || !toonString.trim()) return ''

  // Add quotes to unquoted keys: handles {key: or ,key: patterns
  // Key must start with a letter, underscore, or $, followed by word chars
  const quoted = toonString.replace(
    /([{,])\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g,
    '$1"$2":'
  )

  const parsed = JSON.parse(quoted)
  return JSON.stringify(parsed, null, 2)
}

/**
 * Approximates token count using character count / 4, rounded up.
 */
export function approximateTokens(text) {
  if (!text) return 0
  return Math.ceil(text.length / 4)
}
