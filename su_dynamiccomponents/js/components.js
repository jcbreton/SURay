//  Copyright 2012, Trimble Navigation Limited
//  License: All Rights Reserved.

/**
 * @fileoverview  DynamicComponent-specific WebDialog support functions. The
 * operations provided here are shared by both author and consumer panel
 * code (configurator and manager).
 */

// Declare su namespace.
var su = window.su;

// Declare skp namespace.
var skp = window.skp;

// Declare conv namespace.
var conv = window.conv;

// Declare mgr namespace.
var mgr = window.mgr;

// Define a "components" object we can hang our functionality on.
var comp = {};

// Common user-interface visible strings.
comp.DICTIONARY = 'dynamic_attributes';
comp.FORMULA_PREFIX = '=';
comp.FORM_DESIGN_GROUP = 'Form Design';
comp.METADATA_GROUP = 'Component Info';
comp.BEHAVIORS_GROUP = 'Behaviors';

// Reserved attribute metadata.
comp.RESERVED = {
  name: { label: 'Name', group: comp.METADATA_GROUP, unitGroup: 'STRING',
    summary: 'Friendly name of the object.'},
  summary: { label: 'Summary', group: comp.METADATA_GROUP, unitGroup: 'STRING',
    summary: 'Brief summary text of the component.'},
  description: { label: 'Description', group: comp.METADATA_GROUP,
    unitGroup: 'STRING', summary: 'Description of the component.'},
  itemcode: { label: 'ItemCode', group: comp.METADATA_GROUP,
    unitGroup: 'STRING', summary: 'Unique numeric identifier.'},

  x: { label: 'X', group: 'Position', unitGroup: 'LENGTH',
    summary: 'Position along the red axis, in inches.',
    hasLiveValue: true, color: '#B20000'},
  y: { label: 'Y', group: 'Position', unitGroup: 'LENGTH',
    summary: 'Position along the green axis, in inches.',
    hasLiveValue: true, color: '#00B200'},
  z: { label: 'Z', group: 'Position', unitGroup: 'LENGTH',
    summary: 'Position along the blue axis, in inches.',
    hasLiveValue: true, color: '#0000B2'},

  lenx: { label: 'LenX', group: 'Size', unitGroup: 'LENGTH',
    summary: 'Size along the red axis, in inches.',
    hasLiveValue: true, color: '#B20000'},
  leny: { label: 'LenY', group: 'Size', unitGroup: 'LENGTH',
    summary: 'Size along the green axis, in inches.',
    hasLiveValue: true, color: '#00B200'},
  lenz: { label: 'LenZ', group: 'Size', unitGroup: 'LENGTH',
    summary: 'Size along the blue axis, in inches.',
    hasLiveValue: true, color: '#0000B2'},

  rotx: { label: 'RotX', group: 'Rotation', unitGroup: 'ANGLE',
    summary: 'Rotation about the red axis, in degrees.',
    hasLiveValue: true, color: '#B20000'},
  roty: { label: 'RotY', group: 'Rotation', unitGroup: 'ANGLE',
    summary: 'Rotation about the green axis, in degrees.',
    hasLiveValue: true, color: '#00B200'},
  rotz: { label: 'RotZ', group: 'Rotation', unitGroup: 'ANGLE',
    summary: 'Rotation about the blue axis, in degrees.',
    hasLiveValue: true, color: '#0000B2'},

  material: { label: 'Material', group: comp.BEHAVIORS_GROUP,
    hasLiveValue: true, summary: 'Such as &quot;Green&quot; or ' +
      '&quot;#FF0000&quot;.', unitGroup: 'STRING', units: 'STRING' },
  scaletool: { label: 'ScaleTool', group: comp.BEHAVIORS_GROUP,
    summary: 'Controls which scale tool handles appear.' },
  hidden: { label: 'Hidden', group: comp.BEHAVIORS_GROUP,
    unitGroup: 'BOOLEAN', units: 'BOOLEAN',
    summary: 'If greater than 0, component will be hidden.' },
  onclick: { label: 'onClick', group: comp.BEHAVIORS_GROUP,
    unitGroup: 'STRING',
    summary: 'Contains scripting commands that run when clicked.'},
  copies: { label: 'Copies', group: comp.BEHAVIORS_GROUP,
    unitGroup: 'INTEGER', units: 'INTEGER',
    summary: 'How many duplicates of this part to create.'},

  copy: { label: 'COPY', group: 'Read Only',
    summary: 'COPY is a readonly attribute that contains the part&#39;s ' +
      'copy number.', isHidden: true},

  imageurl: { label: 'ImageURL', group: comp.FORM_DESIGN_GROUP,
    unitGroup: 'STRING', units: 'STRING',
    summary: 'Contains a URL to a thumbnail image.'},
  dialogwidth: { label: 'DialogWidth', group: comp.FORM_DESIGN_GROUP,
    unitGroup: 'INTEGER', defaultValue: '345', units: 'INTEGER',
    summary: 'Width of the Component Options dialog in pixels.'},
  dialogheight: { label: 'DialogHeight', group: comp.FORM_DESIGN_GROUP,
    unitGroup: 'INTEGER', defaultValue: '560', units: 'INTEGER',
    summary: 'Height of the Component Options dialog in pixels.'}
};


/**
 * Installs a handler for keydown in a cross-browser (IE and WebKit) fashion.
 * @param {string} eventName The event name in one of three formats: short,
 *     standard, and long. For example, the keydown event can be expressed as
 *     'down', 'keydown', or 'onkeydown'.
 * @param {Function} handler The function used to respond to keydown events.
 */
comp.installKeyHandler = function(eventName, handler) {
  var name = eventName.toLowerCase();

  switch (name)
  {
    case 'down':
    case 'keydown':
    case 'onkeydown':
      name = 'keydown';
      break;
    case 'press':
    case 'keypress':
    case 'onkeypress':
      name = 'keypress';
      break;
    case 'up':
    case 'keyup':
    case 'onkeyup':
      name = 'keyup';
      break;
    default:
      // Not in the valid list, that's a problem.
      su.raise(su.translateString('Invalid value for event name: ') +
          eventName);
      return;
  }

  // Now we do the actual handler installation in a platform-specific way.
  if (su.IS_MAC) {
    document.documentElement.addEventListener(name, handler, true);
  } else {
    document.documentElement.attachEvent('on' + name, handler);
  }
};

/**
 * Converts a value to the default magnitude for the units provided. Here are 
 * some example string patterns that can be parsed:
 * - Feet inches, such as 6' 5 1/2", or 6' 5", or 1'4-1/2"
 * - Fractional inches, such as 3/4", or 1-5/8", or 12 1/2"
 * - Decimal millimeters and meters, such as 45mm, or 6.4 m, or 12.1 mm
 * We returns zero if the value can't be parsed into anything useful, since
 * the user could enter anything, such as "bob", and the best recourse we have
 * is to return 0. The one exception to this is if the user is editing a field
 * that is inherently a string, in which case we simply return the string.
 * @param {string|number} value The value to convert.
 * @param {string} units The units to convert to.
 * @return {string|number} The formatted value.
 */
comp.convertToDefault = function(value, units) {
  var val;

  // Necessary to handle unicode characters entered directly into the text
  // field. (Except for a few characters which we allow).
  val = encodeURIComponent(value);
  val = val.replace(/\%3D/gi, '=');
  val = val.replace(/\%2C/gi, ',');
  val = val.replace(/\%22/gi, '"');
  val = val.replace(/\%20/gi, ' ');
  val = val.replace(/\%2F/gi, '/');
  val = val.replace(/\%../gi, '');

  if (units == 'STRING') {
    return val;
  }

  var returnVal = comp.parseLengthIntoInches(val, units);
  if (su.isNumber(returnVal)) {
    return returnVal;
  } else {
    return 0;
  }

};

/**
 * Takes a user-entered length string and attempts to return its value in 
 * inches, as a float.
 * @param {string} value The units string, such as "INCHES". (The full list
 *     of valid unit types can be verified in manager.js).
 * @param {string} defaultUnits The units to default to if none are 
 *     found inside the string.
 * @return {number} The length in inches.
 */
comp.parseLengthIntoInches = function(value, defaultUnits) {
  var units;
  var returnValue = parseFloat(value);

  if (value.indexOf("'") > -1) {
    units = 'FEET'
  } else if (value.match(/\d\s*cm/i)) {
    units = 'CENTIMETERS'
  } else if (value.match(/\d\s*mm/i)) {
    units = 'MILLIMETERS'
  } else if (value.match(/\d\s*m/i)) {
    units = 'METERS'
  } else if (value.match(/\d\s*\"/i)) {
    units = 'INCHES'
  } else {
    units = defaultUnits;
  }

  switch (units) {
    case 'FEET':
      var splitValues = value.split(/\'/)
      var feet = su.ifEmpty(splitValues[0], '0');
      var inches = su.ifEmpty(splitValues[1], '0');
      // Parse the remaining strings for fractions.
      feet = comp.parseFraction(feet);
      inches = comp.parseFraction(inches);
      return feet * 12 + inches;

    case 'METERS':
      return parseFloat(value) * 39.3700787;
    case 'MILLIMETERS':
      return parseFloat(value) / 25.4;
    case 'CENTIMETERS':
      return parseFloat(value) / 2.54;
    case 'INCHES':
      return comp.parseFraction(value);
    default:
      return parseFloat(value);
  }

};

/**
 * Takes a user-entered string and attempts to return its value  
 * as a float, parsing for fractions such as 4 5/8 or 4-5/8. Note that this
 * method will raise an error if a division by zero is attempted.
 * @param {string} value The units string, such as "INCHES".
 * @return {number} The parsed value.
 */
comp.parseFraction = function(value) {
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
    return parseFloat(wholeNumber) + parseFloat(dividend) / parseFloat(divisor);
  } else {
    return parseFloat(value);
  }
};

/**
 * Escapes text to avoid problems with embedded quotes.
 * @param {string} text The string to escape.
 * @return {string} The escaped string.
 */
comp.escapeQuotes = function(text) {
  return text.replace(/"/g, '&quot;'
    ).replace(/'/g, '&apos;');
};

/**
 * Takes a user entered string, and calculates an appropriate "base" value
 * that matches an attribute. For example, if the attribute in question is "X",
 * and that attribute has its formulaunits set to "INCHES", then text entry
 * of "25.4mm" would return 1.0.
 * @param {string|number} value The value to convert.
 * @param {Object} entity The entity to look in.
 * @param {string} attribute Name of the attribute.
 * @return {string|number} The base value.
 */
comp.parseToBase = function(value, entity, attribute) {
  var units = comp.getAttributeFormulaUnits(entity, attribute, true);
  var enteredValue = conv.parseTo(value, units);
  var baseValue = conv.toBase(enteredValue, units);
  return baseValue;
};

/**
 * Takes an attribute and displays it in its correctly formatted, unitized
 * value.
 * @param {Object} entity The entity to look in.
 * @param {string} attribute Name of the attribute.
 * @param {number} opt_decimalPlaces Number of decimal places to round to.
 * @return {string|number} The converted value.
 */
comp.getAttributeFormattedValue = function(entity, attribute,
    opt_decimalPlaces) {
  var attr = comp.getAttribute(entity, attribute);
  var units = comp.getAttributeFormulaUnits(entity, attribute, true);
  var convertedValue = conv.fromBase(attr.value, units);
  var value = conv.format(convertedValue, units, opt_decimalPlaces);
  return value;
};

/**
 * Processes a string of text which will ultimately become part of an
 * element's content. This means the string undergoes certain filtering for
 * potentially insecure content as well as entity processing as needed.
 * @param {string} text The text to format.
 * @return {string} The reformatted text.
 */
comp.formatContent = function(text) {

  // Force convert to string in case undefined is passed.
  text = su.ifEmpty(text, '');

  text = su.sanitizeHTML(text);

  // Alter the string that is to displayed as HTML so that any links open in a
  // new window via Ruby. Otherwise links would open inside the config window.
  text = text.replace(/\&quot;/gi, '"');
  text = text.replace(/href=(?=[^\"])/gi, 'href=skp:do_open_url@url=');
  text = text.replace(/href=\"/gi, 'href="skp:do_open_url@url=');
  return text;
};

/**
 * Rounds the fractional portion of a value to the desired number of digits.
 * @param {string|number} value The value to process.
 * @param {number} digits The number of fractional digits to preserve.
 * @return {number} The newly processed value.
 */
comp.roundDecimalPoints = function(value, digits) {
  if (su.isNumber(value)) {
    var returnVal = value.toFixed(digits) + '';
    if (digits > 0) {
      // Strip off trailing zeroes and trailing decimal.
      returnVal = returnVal.replace(/0+$/, '');
      returnVal = returnVal.replace(/\.$/, '');
    }
    return parseFloat(returnVal);
  }

  if (su.isString(value)) {
    return comp.roundDecimalPoints(parseFloat(value), digits);
  } else {
    return 0;
  }
};

//  --------------------------------------------------------------------------
//  Attribute Management
//  --------------------------------------------------------------------------

/**
 * Returns the named attribute object from an object's dynamic component
 * attribute list.
 * @param {Object} entity The object to search.
 * @param {string} attribute The specific attribute name to locate.
 * @return {Object} A SketchUp Attribute object.
 */
comp.getAttribute = function(entity, attribute) {
  return su.getAttribute(entity, comp.DICTIONARY, attribute);
};

/**
 * Returns the dictionary of component-specific attributes for an entity.
 * @param {Object} entity The object to search.
 * @return {Object} The entity's dynamic component attribute dictionary.
 */
comp.getAttributes = function(entity) {
  return su.getDictionary(entity, comp.DICTIONARY);
};

/**
 * Returns the named attribute's access setting from the entity's
 * attribute dictionaries.
 * @param {Object} entity The object to search for dictionary data.
 * @param {string} attribute The name of the specific attribute to locate.
 * @return {Object} The units of the named attribute.
 */
comp.getAttributeAccess = function(entity, attribute) {
  var attr;

  attr = comp.getAttribute(entity, attribute);
  if (su.isValid(attr)) {
    return attr.access;
  }
};

/**
 * Returns the named attribute's error setting from the entity's
 * attribute dictionaries.
 * @param {Object} entity The object to search for dictionary data.
 * @param {string} attribute The name of the specific attribute to locate.
 * @return {Object} The units of the named attribute.
 */
comp.getAttributeError = function(entity, attribute) {
  var attr;

  attr = comp.getAttribute(entity, attribute);
  if (su.isValid(attr)) {
    return attr.error;
  }
};

/**
 * Returns the named attribute's form label from the entity's
 * attribute dictionaries.
 * @param {Object} entity The object to search for dictionary data.
 * @param {string} attribute The name of the specific attribute to locate.
 * @return {Object} The units of the named attribute.
 */
comp.getAttributeFormLabel = function(entity, attribute) {
  var attr;

  attr = comp.getAttribute(entity, attribute);
  if (su.isValid(attr)) {
    return attr.formlabel;
  }
};

/**
 * Returns the named attribute's error value from the entity's attribute
 * dictionaries.
 * @param {Object} entity The object to search for dictionary data.
 * @param {string} attribute The name of the specific attribute to locate.
 * @return {Object} The error property of the named attribute.
 */
comp.getAttributeError = function(entity, attribute) {
  var attr;

  attr = comp.getAttribute(entity, attribute);
  if (su.isValid(attr)) {
    return '' + attr.error;
  } else {
    return '';
  }
};

/**
 * Returns the named attribute's formula from the entity's attribute
 * dictionaries.
 * @param {Object} entity The object to search for dictionary data.
 * @param {string} attribute The name of the specific attribute to locate.
 * @return {Object} The units of the named attribute.
 */
comp.getAttributeFormula = function(entity, attribute) {
  var attr;

  attr = comp.getAttribute(entity, attribute);
  if (su.isValid(attr)) {
    return attr.formula;
  }
};

/**
 * Returns the named attribute's label from the entity's attribute
 * dictionaries.
 * @param {Object} entity The object to search for dictionary data.
 * @param {string} attribute The name of the specific attribute to locate.
 * @return {Object} The units of the named attribute.
 */
comp.getAttributeLabel = function(entity, attribute) {
  var attr;

  attr = comp.getAttribute(entity, attribute);
  if (su.isValid(attr)) {
    return attr.label;
  }
};

/**
 * Returns the named attribute's options setting from the entity's
 * attribute dictionaries.
 * @param {Object} entity The object to search for dictionary data.
 * @param {string} attribute The name of the specific attribute to locate.
 * @return {Object} The options value of the named attribute.
 */
comp.getAttributeOptions = function(entity, attribute) {
  var attr;

  attr = comp.getAttribute(entity, attribute);
  if (su.isValid(attr)) {
    return attr.options;
  }
};

/**
 * Returns the named attribute's unit setting from the entity's
 * attribute dictionaries.
 * @param {Object} entity The object to search for dictionary data.
 * @param {string} attribute The name of the specific attribute to locate.
 * @return {Object} The units value of the named attribute.
 */
comp.getAttributeUnits = function(entity, attribute) {
  var attr;

  attr = comp.getAttribute(entity, attribute);
  if (su.isValid(attr)) {
    return attr.units;
  }
};

/**
 * Returns the named attribute's value from the entity's attribute
 * dictionaries.
 * @param {Object} entity The object to search for dictionary data.
 * @param {string} attribute The name of the specific attribute to locate.
 * @return {Object} The value of the named attribute.
 */
comp.getAttributeValue = function(entity, attribute) {
  var attr;

  attr = comp.getAttribute(entity, attribute);
  if (su.isValid(attr)) {
    return attr.value;
  }
};

/**
 * Returns the named attribute's formulaunits from the entity's attribute
 * dictionaries.
 * @param {Object} entity The object to search for dictionary data.
 * @param {string} attribute The name of the specific attribute to locate.
 * @param {boolean} useDefaults Defines whether length attributes should 
 *     return the default _lengthunit or "STRING" if no formulaunit is set.
 * @return {Object} The value of the named attribute.
 */
comp.getAttributeFormulaUnits = function(entity, attribute, useDefaults) {
  var attr = comp.getAttribute(entity, attribute);
  if (su.isValid(attr)) {
    var units = attr.formulaunits;
    if (useDefaults == true && su.isValid(comp.RESERVED[attribute])) {
      units = su.ifEmpty(units, comp.RESERVED[attribute].units);
      if (comp.RESERVED[attribute].unitGroup == 'LENGTH') {
        units = su.ifEmpty(units, comp.lengthUnits(entity));
      }
    }
    // If no unit is set, default to STRING as the catch all.
    if (useDefaults == true) {
      units = su.ifEmpty(units, 'STRING');
    }
    return units;
  }
};

/**
 * Returns true if the named attribute exists in an object's dynamic
 * component attribute list.
 * @param {Object} entity The object to search.
 * @param {string} attribute The specific attribute name to locate.
 * @return {boolean} True if the named attribute exists.
 */
comp.hasAttribute = function(entity, attribute) {
  return su.hasAttribute(entity, comp.DICTIONARY, attribute);
};

/**
 * Returns the lengthUnits attached to a given entity, defaulting to INCHES.
 * @param {Object} entity The object to search.
 * @return {string} The units string, such as INCHES or CENTIMETERS.
 */
comp.lengthUnits = function(entity) {
  var lengthUnits = comp.getAttributeValue(entity, '_lengthunits');
  lengthUnits = su.ifEmpty(lengthUnits, 'INCHES');
  return lengthUnits;
};

/**
 * Strips any units indicators from a string.
 * @param {string|number} measurement The value to strip.
 * @return {string} The value stripped of everything but numbers, decimals,
 *     or the negative (-) sign.
 */
comp.stripUnits = function(measurement) {
  // Strip off escaped characters and all non-digit or non-decimal characters.
  var returnValue = measurement + '';
  returnValue = returnValue.replace(/\&.+\;/gi, '');
  returnValue = returnValue.replace(/[^0-9,\.]/gi, '');
  return returnValue;
};

/**
 * Retrieves the live value for an attribute from SketchUp.
 * @param {Object} entity The object to pull attribute data for.
 * @param {string} attribute The name of the attribute to fetch data for.
 * @param {string} success The name of any onsuccess callback.
 * @param {string} failure The name of any onfailure callback.
 * @param {string} complete The name of any oncomplete callback.
 */
comp.pullLiveValue = function(entity, attribute, success, failure, complete) {
  su.callRuby('pull_live_value',
    {'id': entity.id,
    'name': attribute,
    'onfailure': failure,
    'onsuccess': success,
    'oncomplete': complete});
};

/**
 * Pushes all aspects of an attribute across the Ruby/JavaScript bridge.
 * @param {Object} entity The object whose attribute should be pushed.
 * @param {string} attribute The name of the attribute to push.
 * @param {Function} opt_onComplete An optional function to call on
 *     completion.
 */
comp.pushAttribute = function(entity, attribute, opt_onComplete) {
  var attr;
  var params;

  if (su.notValid(entity)) {
    su.raise(su.translateString('Invalid entity. Attribute push cancelled.'));
    return;
  }

  attr = comp.getAttribute(entity, attribute);
  if (su.notValid(attr)) {
    su.raise(su.translateString('Attribute not found: ') + attribute);
    return;
  }

  params = {'id': entity.id,
    'dictionary': 'dynamic_attributes',
    'name': attribute,
    'value': comp.getAttributeValue(entity, attribute),
    'formula': comp.getAttributeFormula(entity, attribute),
    'label': comp.getAttributeLabel(entity, attribute),
    'access': comp.getAttributeAccess(entity, attribute),
    'options': comp.getAttributeOptions(entity, attribute),
    'formlabel': comp.getAttributeFormLabel(entity, attribute),
    'units': comp.getAttributeUnits(entity, attribute),
    'formulaunits': comp.getAttributeFormulaUnits(entity, attribute, false),
    'canDeleteFormlabel': true
  };

  // If this is being called inside the manager, then send down the root
  // entityID so it is always redrawn.
  if (mgr != undefined) {
    params['redraw_id'] = mgr.rootEntity.id;
  }

  if (su.isDefined(opt_onComplete)) {
    params['oncomplete'] = opt_onComplete;
  }
  su.callRuby('push_attribute', params);
};

/**
 * Pushes a new name for an attribute across the ruby bridge
 * @param {Object} entity The object whose attribute should be pushed.
 * @param {string} attribute The name of the attribute to push.
 * @param {string} newName The attribute's new name.
 * @param {string} newLabel The label value to use for the attribute.
 * @param {Function} opt_onComplete An optional function to call on
 *     completion.
 */
comp.pushRename = function(entity, attribute, newName, newLabel, 
    opt_onComplete) {
  var attr;
  var params;

  if (su.notValid(entity)) {
    su.raise(su.translateString('Invalid entity. Attribute push cancelled.'));
    return;
  }

  attr = comp.getAttribute(entity, attribute);
  if (su.notValid(attr)) {
    su.raise(su.translateString('Attribute not found: ') + attribute);
    return;
  }

  params = {'id': entity.id,
    'dictionary': 'dynamic_attributes',
    'name': attribute,
    'new_name': newName,
    'new_label': newLabel};

  if (su.isDefined(opt_onComplete)) {
    params['oncomplete'] = opt_onComplete;
  }
  su.callRuby('push_rename', params);
};

/**
 * Commits a set of attribute values to one or more entities by pushing their
 * IDs and values across the Ruby/JavaScript bridge.
 * @param {string|Array} entities The SketchUp entity IDs being updated.
 * @param {Object} attributes A set of key/value pairs (in object form)
 *     whose values should be pushed.
 * @param {Function} opt_onComplete An optional function to call on
 *     completion.
 * @param {boolean} opt_noRedraw True to force no redrawing on completion.
 */
comp.pushAttributeSet = function(entities, attributes, opt_onComplete,
    opt_noRedraw) {
  var params;
  var items;
  var len;
  var i;
  var j;
  var name;
  var parts;
  var value;
  var formula;
  var subItems;

  params = {};

  items = su.getItems(attributes);

  len = items.length;
  for (i = 0; i < len; i++) {
    // We use escaped key/value content as pairs, which are iterated over on
    // the other side of the bridge.
    name = items[i][0];
    if ((/__/).test(name)) {
      parts = name.split('__');
      name = parts[parts.length - 1];
    }
    value = items[i][1];

    // If just a string is passed, then assume it contains the value, or a
    // formula if it starts with an '='. If it's not a string, then assume it
    // is an associative array broken our into our "meta" attributes.
    if (su.isString(value)) {
      params[name + '__value'] = value;
      // Formulas start with a specific prefix (typically '=').
      if (value.indexOf(comp.FORMULA_PREFIX) == 0) {
        formula = value.slice(comp.FORMULA_PREFIX.length);
        params[name + '__formula'] = formula;
      }
    } else {
      subItems = su.getItems(value);
      for (j = 0; j < subItems.length; j++) {
        params[name + '__' + subItems[j][0]] = subItems[j][1];
      }
    }
  }

  // Now we have a few "administrative" attributes to put in the query.
  params['$ids'] = entities;

  if (opt_noRedraw == true) {
    params['$no_redraw'] = 1;
   }

  if (su.isDefined(opt_onComplete)) {
    params['oncomplete'] = opt_onComplete;
  }

  su.callRuby('push_attribute_set', params);

};

/**
 * Commits an attribute to the SketchUp model by pushing the attribute value
 * across the Ruby/JavaScript bridge.
 * @param {string} entityID The SketchUp entity ID being updated.
 * @param {string} attribute The name of the attribute to update.
 * @param {Object} value The value to set for the attribute.
 * @param {Function} opt_onComplete An optional function to call on
 *     completion.
 * @param {boolean} opt_noRedraw True to force no redrawing on completion.
 */
comp.pushAttributeValue = function(entityID, attribute, value, opt_onComplete,
    opt_noRedraw) {

  var params;
  var formula;

  params = {};

  params['dictionary'] = comp.DICTIONARY;

  if (opt_noRedraw == true) {
    params['no_redraw'] = 1;
  }

  params['id'] = entityID;
  params['name'] = attribute;
  params['value'] = value;

  // Formulas start with a specific prefix (typically '=').
  if (value.indexOf(comp.FORMULA_PREFIX) == 0) {
    formula = value.slice(comp.FORMULA_PREFIX.length);
    params['formula'] = formula;
  }

  if (su.isDefined(opt_onComplete)) {
    params['oncomplete'] = opt_onComplete;
  };

  su.callRuby('push_attribute', params);
};

/**
 * Pushes an entity across the Ruby/JavaScript bridge.
 * @param {string} id The ID of the entity to push. 
 * @param {Event} evt The native event, if available.
 * @return {boolean} False, to preserve UI which invokes this function.
 */
comp.pushSelection = function(id, evt) {
  if (su.canCall(evt, 'stopPropagation')) {
    evt.stopPropagation();
  } else if (su.isValid(window.event)) {
    window.event.cancelBubble = true;
  }

  // If no id was passed, then default to an empty string. This tells SketchUp
  // to clear the selection when it receives this callback.
  id = su.ifEmpty(id, '');
  su.callRuby('push_selection', {'id': id});

  // Return false to avoid having UI-initiated calls clear the panel.
  return false;
};

/**
 * Removes a particular aspect (the key) of an attribute. The target attribute
 * dictionary is the components dictionary.
 * @param {Object} entity The object to search for the attribute
 *     dictionary.
 * @param {string} attribute The name of the attribute to update.
 * @param {string} key The name of the aspect to update.
 * @return {boolean} True if the operation succeeded, false otherwise.
 */
comp.removeAttribute = function(entity, attribute, key) {
  return su.removeAttribute(entity, comp.DICTIONARY, attribute, key);
};

/**
 * Sets a particular aspect (the key) of an attribute. The target attribute
 * dictionary is the components dictionary. NOTE that the dictionary and
 * attribute are created if necessary.
 * @param {Object} entity The object to search for the attribute
 *     dictionary.
 * @param {string} attribute The name of the attribute to update.
 * @param {string} key The name of the aspect to update.
 * @param {Object} value The value to set for the key.
 * @return {Object} The value after the set has been processed.
 */
comp.setAttribute = function(entity, attribute, key, value) {
  return su.setAttribute(entity, comp.DICTIONARY, attribute, key, value);
};

/**
 * Sets the access value for the entity attribute provided.
 * @param {Object} entity The object to search for dictionary data.
 * @param {string} attribute The name of the specific attribute to locate.
 * @param {string} value The new value to set for the property.
 * @return {Object} The value after the set has been processed.
 */
comp.setAttributeAccess = function(entity, attribute, value) {
  return comp.setAttribute(entity, attribute, 'access', value);
};

/**
 * Sets the error value for the entity attribute provided.
 * @param {Object} entity The object to search for dictionary data.
 * @param {string} attribute The name of the specific attribute to locate.
 * @param {string} value The new value to set for the property.
 * @return {Object} The value after the set has been processed.
 */
comp.setAttributeError = function(entity, attribute, value) {
  return comp.setAttribute(entity, attribute, 'error', value);
};

/**
 * Sets the form label for the entity attribute provided.
 * @param {Object} entity The object to search for dictionary data.
 * @param {string} attribute The name of the specific attribute to locate.
 * @param {string} value The new value to set for the property.
 * @param {string} accessLevel The access level of the attribute.
 * @return {Object} The value after the set has been processed.
 */
comp.setAttributeFormLabel = function(entity, attribute, value, accessLevel) {
  if (accessLevel === 'NONE') {
    return comp.removeAttribute(entity, attribute, 'formlabel');
  } else {
    return comp.setAttribute(entity, attribute, 'formlabel', value);
  }
};

/**
 * Sets the formula value for the entity attribute provided.
 * @param {Object} entity The object to search for dictionary data.
 * @param {string} attribute The name of the specific attribute to locate.
 * @param {string} value The new value to set for the property.
 * @return {Object} The value after the set has been processed.
 */
comp.setAttributeFormula = function(entity, attribute, value) {
  return comp.setAttribute(entity, attribute, 'formula', value);
};

/**
 * Sets the label for the entity attribute provided.
 * @param {Object} entity The object to search for dictionary data.
 * @param {string} attribute The name of the specific attribute to locate.
 * @param {string} value The new value to set for the property.
 * @return {Object} The value after the set has been processed.
 */
comp.setAttributeLabel = function(entity, attribute, value) {
  return comp.setAttribute(entity, attribute, 'label', value);
};

/**
 * Sets the options value for the entity attribute provided.
 * @param {Object} entity The object to search for dictionary data.
 * @param {string} attribute The name of the specific attribute to locate.
 * @param {string} value  The new value to set for the property.
 * @return {Object} The value after the set has been processed.
 */
comp.setAttributeOptions = function(entity, attribute, value) {
  return comp.setAttribute(entity, attribute, 'options', value);
};

/**
 * Sets the units value for the entity attribute provided.
 * @param {Object} entity The object to search for dictionary data.
 * @param {string} attribute The name of the specific attribute to locate.
 * @param {string} value The new value to set for the property.
 * @return {Object} The value after the set has been processed.
 */
comp.setAttributeUnits = function(entity, attribute, value) {
  return comp.setAttribute(entity, attribute, 'units', value);
};

/**
 * Sets the value property for the entity attribute provided.
 * @param {Object} entity The object to search for dictionary data.
 * @param {string} attribute The name of the specific attribute to locate.
 * @param {string} value The new value to set for the property.
 * @return {Object} The value after the set has been processed.
 */
comp.setAttributeValue = function(entity, attribute, value) {
  return comp.setAttribute(entity, attribute, 'value', value);
};

/**
 * Sets the formulaUnits value for the entity attribute provided.
 * @param {Object} entity The object to search for dictionary data.
 * @param {string} attribute The name of the specific attribute to locate.
 * @param {string} value The new formulaUnits to set for the property.
 * @return {Object} The value after the set has been processed.
 */
comp.setAttributeFormulaUnits = function(entity, attribute, value) {
  return comp.setAttribute(entity, attribute, 'formulaunits', value);
};

/**
 * Pulls attribute data from the current SketchUp selection object,
 * populating the root entity used by other component panel routines.
 * You can provide an oncomplete handler to process the results, which are
 * placed in the comp.rootEntity property for consumption.
 * @param {Object} request An object whose key/value pairs provide
 *   parameters to the call.
 */
comp.pullAttributes = function(request) {
  //  default the success and failure handlers to update rootEntity data
  su.addIfAbsent(request, 'onsuccess', 'comp.handlePullAttributesSuccess');
  su.addIfAbsent(request, 'onfailure', 'comp.handlePullAttributesFailure');

  su.callRuby('pull_attribute_tree', request);
};

/**
 * Handles failure notification from the Ruby pull_attribute_tree function,
 * reporting an error in the configuration panel to notify the user.
 * @param {string} queryid The unique ID of the invocation that triggered
 *   this callback.
 */
comp.handlePullAttributesFailure = function(queryid) {
  comp.rootEntity = null;
};

/**
 * Handles success notification from the Ruby pull_attribute_tree function
 * and triggers initial UI construction based on the selection attribute
 * data provided by that routine.
 * @param {string} queryid The unique ID of the invocation that triggered
 *     this callback.
 */
comp.handlePullAttributesSuccess = function(queryid) {
  comp.rootEntity = su.getRubyResponse(queryid);
};

/**
 * Pulls a list of comma-separated entity IDs from the current selection in
 * the current active model. The resulting selection IDs are placed in the
 * comp.selectionIds property for consumption as a comma-delimited string.
 * @param {Object} request An object whose key/value pairs provide
 *     parameters to the call.
 */
comp.pullSelectionIds = function(request){
  // Default the success and failure handlers to update rootEntity data.
  su.addIfAbsent(request, 'onsuccess', 'comp.handlePullSelectionIdsSuccess');
  su.addIfAbsent(request, 'onfailure', 'comp.handlePullSelectionIdsFailure');
  su.callRuby('pull_selection_ids', request);
};

/**
 * Handles failure notification from the Ruby pull_selection_ids function,
 * reporting an error in the configuration panel to notify the user.
 */
comp.handlePullSelectionIdsFailure = function() {
  comp.selectionIds = null;
};

/**
 * Handles success notification from the Ruby pull_attribute_tree function
 * and triggers initial UI construction based on the selection attribute
 * data provided by that routine.
 * @param {string} queryid The unique ID of the invocation that triggered
 *     this callback.
 */
comp.handlePullSelectionIdsSuccess = function(queryid) {
  var obj;
  var ids;

  //  clear the selection IDs until we can recompute the list
  comp.selectionIds = null;

  if (su.notValid(obj = su.getRubyResponse(queryid))) {
    return;
  }

  if (su.notValid(ids = obj['selection_ids'])) {
    return;
  }

  comp.selectionIds = ids;
};
