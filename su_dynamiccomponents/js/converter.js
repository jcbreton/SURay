//  Copyright 2012, Trimble Navigation Limited
//  All Rights Reserved.

/**
 * @fileoverview DynamicComponent-specific unit conversion support functions.
 * The data structures and methods here are used in both the configure and
 * manager dialogs to convert units.
 *
 * This file is used inside SketchUp as a local javascript library. On SketchUp
 * for the Mac, it runs inside Safari and on SketchUp for PC it runs inside IE.
 * These are the only browsers this is ever used in.
 */

// Declare su namespace.
var su = window.su;

// Declare skp namespace.
var skp = window.skp;

// Declare mgr namespace.
var mgr = window.mgr;

// Define a "conv" object where we can hang our functionality.
var conv = {};

/**
 * Default number of decimal places to show at format time.
 * @type {number}
 */
conv.DEFAULT_FORMAT_DECIMAL_PLACES = 3;

/**
 * Array of objects that describe the supported units.
 * @type {Array}
 */
conv.units = [
  {
    name: 'DEFAULT',
    label: 'User\'s default template units',
    group: 'LENGTH',
    configOnly: true
  },
  {
    name: 'INTEGER',
    label: 'Whole Number, no units',
    group: 'INTEGER',
    configOnly: true,
    defaultFormulaUnit: 'FLOAT'
  },
  {
    name: 'FLOAT',
    label: 'Decimal Number, no units',
    group: 'FLOAT'
  },
  {
    name: 'PERCENT',
    label: 'Percentage',
    group: 'FLOAT',
    test: '^[\\d\\.,\\-\\s]+\\%[^\\w]*$',
    template: '{value}%',
    conversion: 100,
    configOnly: true,
    defaultFormulaUnit: 'FLOAT'
  },
  {
    name: 'BOOLEAN',
    label: 'True/False',
    group: 'BOOLEAN',
    test: '^(true|false)$',
    configOnly: true,
    defaultFormulaUnit: 'FLOAT'
  },
  {
    name: 'STRING',
    label: 'Arbitrary Text, no units',
    group: 'STRING'
  },
  {
    name: 'INCHES',
    label: 'Inches',
    template: '{value}&quot;',
    group: 'LENGTH',
    test: '^\d*\s*[^\\\']\s*\\d*\\s*\\"'
  },
  {
    name: 'FEET',
    label: 'Decimal Feet',
    template: "{value}'",
    group: 'LENGTH',
    conversion: 0.0833333333333,
    test: '^[\\d\\.,\\-\\s]+\\\'[\\d\\.,\\-\\s\\\\/"]*$',
    configOnly: true,
    defaultFormulaUnit: 'INCHES'
  },
  {
    name: 'MILLIMETERS',
    label: 'Millimeters',
    template: '{value} mm',
    group: 'LENGTH',
    conversion: 25.4,
    test: '^[\\d\\.,\\-\\s]+mm[^\\w]*$',
    configOnly: true,
    defaultFormulaUnit: 'CENTIMETERS'
  },
  {
    name: 'CENTIMETERS',
    label: 'Centimeters',
    template: '{value} cm',
    conversion: 2.54,
    group: 'LENGTH',
    test: '^[\\d\\.,\\-\\s]+cm[^\\w]*$'
  },
  {
    name: 'METERS',
    label: 'Meters',
    template: '{value} m',
    group: 'LENGTH',
    conversion: .0254,
    test: '^[\\d\\.,\\-\\s]+m[^\\w]*$',
    configOnly: true,
    defaultFormulaUnit: 'CENTIMETERS'
  },
  {
    name: 'DEGREES',
    label: 'Degrees',
    template: '{value}&deg;',
    group: 'ANGLE',
    configOnly: true,
    defaultFormulaUnit: 'FLOAT'
  },
  {
    name: 'DOLLARS',
    label: 'Dollars',
    group: 'CURRENCY',
    test: '\\$\\d',
    configOnly: true,
    defaultFormulaUnit: 'FLOAT'
  },
  {
    name: 'EUROS',
    label: 'Euros',
    group: 'CURRENCY',
    configOnly: true,
    defaultFormulaUnit: 'FLOAT'
  },
  {
    name: 'YEN',
    label: 'Yen',
    group: 'currency',
    configOnly: true,
    defaultFormulaUnit: 'FLOAT'
  },
  {
    name: 'POUNDS',
    label: 'Pounds (weight)',
    template: '{value} lbs',
    group: 'WEIGHT',
    test: '\\d\\s*lbs',
    configOnly: true,
    defaultFormulaUnit: 'FLOAT'
  },
  {
    name: 'KILOGRAMS',
    label: 'Kilograms',
    template: '{value} kg',
    group: 'WEIGHT',
    conversion: 0.45359237,
    test: '\\d\\s*kg',
    configOnly: true,
    defaultFormulaUnit: 'FLOAT'
  },
  {
    name: 'YARDS',
    label: 'Yards',
    template: '{value} yd',
    group: 'LENGTH',
    conversion: 0.0277778,
    test: '^[\\d\\.,\\-\\s]+yd[^\\w]*$',
    configOnly: true,
    defaultFormulaUnit: 'INCHES'
  }
];

/**
 * A friendly hash index into our conv.units, to allow us to use easy lookups
 * like conv.unitsHash['CENTIMETERS'].
 * @type {Object}
 */
conv.unitsHash = {
 'DEFAULT': conv.units[0],
 'INTEGER': conv.units[1],
 'FLOAT': conv.units[2],
 'PERCENT': conv.units[3],
 'BOOLEAN': conv.units[4],
 'STRING': conv.units[5],
 'INCHES': conv.units[6],
 'FEET': conv.units[7],
 'MILLIMETERS': conv.units[8],
 'CENTIMETERS': conv.units[9],
 'METERS': conv.units[10],
 'DEGREES': conv.units[11],
 'DOLLARS': conv.units[12],
 'EUROS': conv.units[13],
 'YEN': conv.units[14],
 'POUNDS': conv.units[15],
 'KILOGRAMS': conv.units[16],
 'YARDS': conv.units[17]
};

/**
 * Array of objects that describe the supported unit groups.
 * @type {Array.<Object>}
 */
conv.groups = [
 {name: 'STRING', label: 'Text', base: 'STRING'},
 {name: 'LENGTH', label: 'Length', base: 'INCHES'},
 {name: 'INTEGER', label: 'Whole Number', base: 'INTEGER'},
 {name: 'FLOAT', label: 'Decimal Number', base: 'FLOAT'},
 {name: 'ANGLE', label: 'Angle', base: 'DEGREES'},
 {name: 'CURRENCY', label: 'Currency', base: 'DOLLARS'},
 {name: 'WEIGHT', label: 'Weight', base: 'POUNDS'}
];

/**
 * A friendly hash index into our conv.groups, to allow us to use easy lookups
 * like conv.groupsHash['LENGTH'].
 * @type {Object}
 */
conv.groupsHash = {
 'STRING': conv.groups[0],
 'LENGTH': conv.groups[1],
 'INTEGER': conv.groups[2],
 'FLOAT': conv.groups[3],
 'ANGLE': conv.groups[4],
 'CURRENCY': conv.groups[5],
 'WEIGHT': conv.groups[6]
};

/**
 * Tests a user-entered string for any matches against out list of unit tests.
 * For example, if a user entered a value like "16'", this would return "FEET".
 * @param {string} string The value to test.
 * @param {boolean} opt_defaultIfConfigOnly If true, then configOnly matches
 *     will default down to their approriate defaultFormulaUnit.
 * @return {string} The matching unit type.
 */
conv.recognizeUnits = function(string, opt_defaultIfConfigOnly) {
  var unit;
  var testExpression;
  var foundUnit;

  // Force conversion to string object.
  var stringToTest = string + '';

  // Loop across our units to run our tests.
  for (var i = 0; i < conv.units.length; i++) {
    unit = conv.units[i];
    if (su.isValid(unit.test)) {
      testExpression = new RegExp(unit.test, 'i');
      if (testExpression.test(stringToTest)) {
        foundUnit = unit.name
        break;
      }
    }
  }

  // Let's convert configOnly units down to the appropriate formulaUnit match
  // if opt_defaultIfConfigOnly is true.
  if (opt_defaultIfConfigOnly == true && su.notEmpty(foundUnit)) {
    foundUnit = su.ifEmpty(conv.unitsHash[foundUnit].defaultFormulaUnit,
        foundUnit)
  }

  // If there are no matches, then it counts as a string.
  return su.ifEmpty(foundUnit, 'STRING');
};

/**
 * Takes a string or number value and converts it into the appropriate base
 * units. For example, a call of parseIntoBase(25.4, 'MILLIMETERS') would
 * return 1.0, since inches are the base unit for millimeters.
 * @param {string|number} value The value to convert.
 * @param {string} units The units name to convert from.
 * @return {string|number} The converted value, or '' if that value is empty.
 */
conv.toBase = function(value, units) {
  if (su.isEmpty(value)) {
    return '';
  }

  var unit = conv.unitsHash[units];
  if (su.notValid(unit) || units == 'STRING') {
    return value;
  }

  // See if there is a toBase function. If so, call that.
  var functionName = units.toLowerCase() + 'ToBase';
  if (su.canCall(conv, functionName)) {
    return conv[functionName](value);
  }

  var numberValue = conv.toNumber(value);
  if (su.notValid(unit.conversion)) {
    return numberValue;
  }
  return numberValue / unit.conversion;
};

/**
 * Takes a string or number value and converts it into the passed units from
 * the appropriate base.
 * For example, a call of fromBase(1.0, 'MILLIMETERS') would return 25.4,
 * since inches are the base unit for millimeters.
 * @param {string|number} value The value to convert.
 * @param {string} units The units name to convert into.
 * @return {string|number} The converted value.
 */
conv.fromBase = function(value, units) {
  var unit = conv.unitsHash[units];
  if (su.notValid(unit) || units == 'STRING') {
    return value;
  }
  var numberValue = conv.toNumber(value);
  if (su.notValid(unit.conversion)) {
    return value;
  }
  return numberValue * unit.conversion;
};

/**
 * Takes a value and displays it in the passed unit in a pretty format.
 * For example, a call of format(2.53, 'CENTIMETERS', 1, true) would return
 * 2.5cm or 2,5cm (depending on user's decimal delimiter).
 * @param {string|number} value The value to format.
 * @param {string} units The units name to convert to.
 * @param {number} opt_decimalPlaces Number of decimal places to round to.
 * @param {boolean} opt_useTemplate Whether to apply the unit template,
 *     defaults to true.
 * @param {string} opt_decimalDelimiter A string containing the decimal
 *     delimiter to format with, defaults to '.'.
 * @return {string|number} The converted value.
 */
conv.format = function(value, units, opt_decimalPlaces, opt_useTemplate,
    opt_decimalDelimiter) {
  var decimalPlaces = su.ifEmpty(opt_decimalPlaces,
      conv.DEFAULT_FORMAT_DECIMAL_PLACES);
  var decimalDelimiter = su.ifEmpty(opt_decimalDelimiter, '.');

  // It's bad practice to treat params as vars, so reassign and adjust to
  // handle user template default unit choice.
  var unit = (units == 'DEFAULT') ? skp.units() : units;

  var displayValue = value;

  if (unit != 'STRING') {
    displayValue = conv.roundDecimalPoints(displayValue, decimalPlaces);
    displayValue = displayValue + '';
    displayValue = displayValue.replace(/\./, decimalDelimiter);
  }

  if (opt_useTemplate === false || unit == 'STRING') {
    return displayValue;
  } else {
    // See if there is a formatting function. If so, call that.
    var functionName = 'format' + units.substr(0, 1).toUpperCase() +
        units.substr(1, units.length).toLowerCase();
    if (su.canCall(conv, functionName)) {
      displayValue = conv[functionName](value);
      displayValue = displayValue.replace(/\./, decimalDelimiter);
      return displayValue;
    }

    var template = su.ifEmpty(conv.unitsHash[units].template, '{value}');
    displayValue = template.replace(/{value}/gi, displayValue);
    displayValue = displayValue.replace(/\./, decimalDelimiter);
    return displayValue;
  }
};

/**
 * Takes a user entered string and converts it to a given unit. This has some
 * extra smarts around only doing conversion if the two units are from the
 * same group. If they're not, then no conversion is done. (If you type 6cm
 * into a weight field, we just parse it down to 6.)
 * @param {string} value The value to convert.
 * @param {string} targetUnits The unit we want the value in.
 * @param {string} opt_decimalDelimiter Optional decimal delimiter to parse
 *     in context of. For example, if ',' is passed, then the value 5,5 will be
 *     correctly interpreted as 5.5.
 * @return {string|number} The converted value, unformatted.
 */
conv.parseTo = function(value, targetUnits, opt_decimalDelimiter) {
  if (su.isEmpty(value)) {
    return '';
  }
  var cleanValue = value + '';

  // If our value is being parsed down to a number, clean up the user-entered
  // string to use periods for decimal delimiters so JS can understand it.
  if (targetUnits != 'STRING') {
    if (opt_decimalDelimiter == ',') {
      cleanValue = cleanValue.replace(/\./, '');
      cleanValue = cleanValue.replace(/\,/, '.');
    }
    if (targetUnits == 'DOLLARS' || targetUnits == 'YEN' ||
      targetUnits == 'EUROS') {
      // Strip off leading non-digit characters, to allow for entry with
      // currency amounts at the front.
      cleanValue = cleanValue.replace(/^[^\d\-]/, '');
    }
  }
  // Figure out the units involved.
  var valueUnits = conv.recognizeUnits(cleanValue);

  // If there were no specific unit match based on the string entered, then
  // best choice is to assume they entered the target units.
  if (valueUnits == 'STRING') {
    valueUnits = targetUnits;
  }
  var valueInBase = conv.toBase(cleanValue, valueUnits);
  var valueGroup = conv.unitsHash[valueUnits].group;
  var targetGroup = conv.unitsHash[targetUnits].group;

  // If these two units are in the same group, then we know how to convert.
  // If they're not, then we'll just return a clean (untemplated) value in
  // the original units.
  if (valueGroup == targetGroup) {
    return conv.fromBase(valueInBase, targetUnits);
  } else if (targetUnits == 'STRING') {
    return value;
  } else {
    return conv.toNumber(cleanValue);
  }
};

/**
 * Rounds the fractional portion of a value to the desired number of digits.
 * This method differs from toFixed in that it returns a string and explicitly
 * chops off trailing zeroes. So if you pass it "75.0", as Ruby is wont to do,
 * it will return a nice "75".
 * @param {string|number} value The value to process.
 * @param {number} digits The number of fractional digits to preserve.
 * @return {string|number} The newly processed value.
 */
conv.roundDecimalPoints = function(value, digits) {
  if (su.isNumber(value)) {
    value = conv.toNumber(value);
    var returnVal = value.toFixed(digits);
    if (digits > 0) {
      // Strip off trailing zeroes and trailing decimal.
      returnVal = returnVal.replace(/0+$/, '');
      returnVal = returnVal.replace(/\.$/, '');
    }
    return returnVal;
  }

  if (su.isString(value)) {
    // Note that we will only ever hit this point of making a recursive call
    // if the original passed value is not a number. So by running toNumber
    // here we're guaranteeing that we won't have an infinite loop.
    return conv.roundDecimalPoints(conv.toNumber(value), digits);
  } else {
    return 0;
  }
};

/**
 * Processes anything into a number.
 * @param {string|number} value The value to process.
 * @return {number} The newly processed value.
 */
conv.toNumber = function(value) {
  var strippedValue = value + '';
  strippedValue = strippedValue.replace(/\,/gi, '.');
  var returnValue = parseFloat(strippedValue);
  if (isNaN(returnValue)) {
    returnValue = 0;
  }
  return returnValue;
};

/**
 * Formats a currency value. NOTE that no currency conversion is performed.
 * @param {string|number} value The currency value to format.
 * @param {string} opt_prefix The currency character to start with.
 * @param {string} opt_suffix The currency character to end with.
 * @param {string} opt_dividerChar The character to split long strings with,
 *     typically ','.
 * @param {string} opt_decimalDelimiter The character to use for the decimal
 *     char typically '.'.
 * @return {string} The formatted value, or '' if the value is empty.
 */
conv.formatCurrency = function(value, opt_prefix, opt_suffix, opt_dividerChar,
    opt_decimalDelimiter) {
  if (su.isEmpty(value)) {
    return '';
  }
  var prefix = su.ifEmpty(opt_prefix, '');
  var suffix = su.ifEmpty(opt_suffix, '');
  var decimal = su.ifEmpty(opt_decimalDelimiter, skp.decimalDelimiter());

  // Get our numeric values.
  var val = conv.toNumber(value);

  var whole = Math.floor(val);
  // Compute fraction, 0-padding if < 10.
  var fraction = Math.round((val - whole) * 100);
  if (fraction == 100) {
    fraction = 0;
    whole += 1;
  }
  fraction = (fraction < 10) ? '0' + fraction : fraction;

  if (!su.isEmpty(opt_dividerChar)) {
    whole = whole + '';
    var formattedWhole = '';
    var count = 0;
    for (var i = whole.length - 1; i >= 0; i--) {
      if (count == 3) {
        formattedWhole = opt_dividerChar + formattedWhole;
        count = 0;
      }
      count++;
      formattedWhole = whole.charAt(i) + formattedWhole;
    }
  } else {
    formattedWhole = whole;
  }
  if (whole > 999 && fraction == '00') {
    return prefix + formattedWhole + suffix;
  } else {
    return prefix + formattedWhole + decimal + fraction + suffix;
  }
};

/**
 * Does a floating-point aware assessment of whether two values are identical
 * enough to count as equal. This must be smart enough to compare a string to
 * a number and return true if the string contains a number that is close
 * enough to pass.
 * @param {string|number} value1 The 1st value to compare.
 * @param {string|number} value2 The 2nd value to compare.
 * @return {boolean} Whether they are equal within a reasonable tolerance.
 */
conv.isEqual = function(value1, value2) {
  if (value1 == value2) {
    return true;
  } else if (conv.containsNumber(value1) && conv.containsNumber(value2)) {
    if (Math.abs(conv.toNumber(value1) - conv.toNumber(value2)) < .0000001) {
      return true;
    }
  }
  return false;
};

/**
 * Checks a string to see if it contains a number. For example, '1.234'
 * returns true, whereas 'SketchUp' returns false.
 * @param {string} value The value to check.
 * @return {boolean} Whether it contains a number.
 */
conv.containsNumber = function(value) {
  var stringValue = value + '';
  return stringValue.match(/^\d+\.*\d*$/);
};

/**
 * Takes a user-entered string and attempts to return its value
 * as a float, parsing for fractions such as 4 5/8 or 4-5/8. Note that this
 * method will raise an error if a division by zero is attempted.
 * @param {string} value The units string, such as "INCHES".
 * @return {number} The parsed value.
 */
conv.parseFraction = function(value) {
  var wholeNumber = 0;

  // Look for a slash to indicate a fraction.
  if (value.match(/\//)) {
    var splitValues = value.split(/\//);
    var dividend = splitValues[0];
    var divisor = splitValues[1];

    // Clean leading spaces from the dividend to ease regular expression
    // matching below.
    dividend = dividend.replace(/^\s*/, '');

    // Check the dividend for white space. If we find these then
    // we must have a compound fraction like "5 5/16".
    if (dividend.match(/\d[\s\-]*\d/)) {
      splitValues = dividend.split(/\b[\s\-](?=\d)/);
      wholeNumber = splitValues[0];
      dividend = splitValues[1];
    }
    var returnValue;
    var wholeNumber = parseFloat(wholeNumber);
    var fraction = parseFloat(dividend) / parseFloat(divisor);
    if (wholeNumber < 0) {
      returnValue = wholeNumber - fraction;
    } else {
      returnValue = wholeNumber + fraction;
    }
    return returnValue;
  } else {
    return parseFloat(value);
  }
};

/**
 *  Unit-specific formatting functions.
 */

/**
 * Returns nicely formatted string for our INTEGER unit.
 * @param {number} value The value to format.
 * @return {string} The newly formatted value.
 */
conv.formatInteger = function(value) {
  if (su.isEmpty(value)) {
    return '';
  } else {
    return Math.floor(conv.toNumber(value), 0) + '';
  }
};

/**
 * Returns nicely formatted string for our EUROS unit.
 * @param {number} value The value to format.
 * @return {string} The newly formatted value.
 */
conv.formatBoolean = function(value) {
  if (conv.toNumber(value) > 0) {
    return su.translateString('TRUE');
  } else {
    return su.translateString('FALSE');
  }
};

/**
 * Returns nicely formatted string for our DOLLARS unit.
 * @param {number} value The value to format.
 * @return {string} The newly formatted value.
 */
conv.formatDollars = function(value) {
  return conv.formatCurrency(value, '$');
};

/**
 * Returns nicely formatted string for our YEN unit.
 * @param {number} value The value to format.
 * @return {string} The newly formatted value.
 */
conv.formatYen = function(value) {
  return conv.formatCurrency(value, '&#165;');
};

/**
 * Returns nicely formatted string for our EUROS unit.
 * @param {number} value The value to format.
 * @return {string} The newly formatted value.
 */
conv.formatEuros = function(value) {
  return conv.formatCurrency(value, '&#8364;');
};

/**
 *  Unit-specific toBase functions.
 */

/**
 * Converts an entered value to the appropriate base units.
 * @param {string|number} value The value to format.
 * @return {number} The newly formatted value.
 */
conv.booleanToBase = function(value) {
  var stringValue = value + '';
  if (stringValue.toLowerCase() == 'true') {
    return 1;
  } else if (stringValue.toLowerCase() == 'false') {
    return 0;
  } else {
    var numberValue = conv.toNumber(value);
    if (numberValue > 0) {
      return 1;
    } else {
      return 0;
    }
  }
};

/**
 * Converts an entered value to the appropriate base units.
 * @param {string|number} value The value to format.
 * @return {number} The newly formatted value.
 */
conv.feetToBase = function(value) {
  var stringValue = value + '';
  var splitValues = stringValue.split(/\'/);
  var feet = su.ifEmpty(splitValues[0], '0');
  var inches = su.ifEmpty(splitValues[1], '0');
  // Parse the remaining strings for fractions.
  feet = conv.parseFraction(feet);
  inches = conv.parseFraction(inches);
  if (feet < 0) {
    return feet * 12 - inches;
  } else {
    return feet * 12 + inches;
  }
};
