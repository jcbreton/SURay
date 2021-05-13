//  Copyright 2012, Trimble Navigation Limited
//  License: All Rights Reserved.

/**
 * @fileoverview Configuration panel support routines. NOTE that this file
 * relies on the dcbridge.js file having been included as a prerequisite as
 * well as the components.js base routines common to all component dialogs.
 */

/**
 * Configurator object used as a namespace.
 * @type {Object}
 */
var cfg = {};

// Export the su namespace. See dcbridge.js for definition.
var su = window.su;

// Export the skp namespace. See dcbridge.js for definition.
var skp = window.skp;

// Export conv namespace. See converter.js for definition.
var conv = window.conv;

// Export comp namespace. See components.js for definition.
var comp = window.comp;

// Export the $ function. See dcbridge.js for definition.
var $ = window.$;

/**
 * Object used to store a list of attribute values that are changed as the
 * user chooses each options.
 * @type {Object}
 */
cfg.changedValues = {};

/**
 * Container for the root entity being configured.
 * @type {null}
 */
cfg.rootEntity = null;

/**
 * Placeholder for last custom style sheet link, used to assist with removal.
 * @type {null}
 * @private
 */
cfg.lastCustomCSS_ = null;

/**
 * A limit after which we show a confirm dialog rather than trying to merge
 * attributes directly. the goal here is to avoid having select-all or
 * fence operations which select large numbers of elements from triggering
 * slowdowns due to the config panel trying to merge big attribute sets.
 * @type {number}
 */
cfg.CONFIRM_SIZE = 50;

/**
 * How many decimal places to show when the user is editing a configure value.
 * @type {number}
 */
cfg.DEFAULT_FORMAT_DECIMAL_PLACES = 3;

/**
 * Initializes the configuration panel with content from the current
 * selection.
 */
cfg.init = function() {

  // Store the loaded HTML so we can reset it on refresh.
  cfg.originalHTML = $('original-html').value;

  su.callRuby('pull_information',
    {'onsuccess': 'su.handlePullInformationSuccess',
    'oncomplete': 'cfg.initRootEntity'});

};

/**
 * Initializes the root entity data and updates the user interface as a
 * downstream activity, ensuring the content of the configuration panel is
 * current with the root entity data found.
 * @param {string} queryid The unique ID of the invocation that triggered
 *     this callback.
 */
cfg.initRootEntity = function(queryid) {

  cfg.ZERO_ENTITIES_MESSAGE = '<div class="no-selection-head">' +
    su.translateString('No Components Selected') + '</div>' +
    '<div class="no-selection-content">' +
    su.translateString(
        'Select one or more components to view their options.') +
    '</div>';

  cfg.ZERO_OPTIONS_MESSAGE =
    su.translateString('There are no options to choose on this component.');

  cfg.NO_MATCHING_MESSAGE =
    su.translateString('There are no matching options to choose ' +
    'across this selection.');

  comp.pullSelectionIds(
    {'oncomplete': 'cfg.handlePullSelectionIdsComplete'});
};

/**
 * Initializes the user interface, relying on data in the cfg.rootEntity
 * object to provide content values.
 */
cfg.initUI = function() {
  var root;
  var value;
  var units;
  var arr;
  var totalFields;
  var attrs;
  var name;
  var img;
  var formLabel;
  var hasFoundValue;
  var selectedString;
  var optarr;
  var width;
  var height;
  var filePath;
  var localPath;

  // Keep ESCAPE from closing the panel. ENTER applies any changes.
  comp.installKeyHandler('down', function(evt) {
    var keycode = su.getKeyCode(evt);
    if (keycode == su.ESCAPE_KEY) {
      su.preventDefault(evt);
    } else if (keycode == su.ENTER_KEY) {
      var applyButton = $('applyButton');
      if (su.isValid(applyButton)) {
        if (applyButton.disabled == false) {
          cfg.doApply();
        }
      }
    }
  });

  cfg.clearCustomStyle();

  root = cfg.rootEntity;
  if (su.notValid(root)) {
    su.setContent(document.body, cfg.ZERO_ENTITIES_MESSAGE);
    return;
  }

  su.setContent(document.body, cfg.originalHTML);

  arr = [];

  // If our root object contains a file variable then strip the
  // filename off of its end to arrive at an absolute, local path to
  // where we will look for CSS or image content.
  if (su.isValid(root.file)) {
    filePath = su.unescapeHTML(root.file + '');
    filePath = filePath.replace(/\\/gi, '/');
    localPath = filePath.substring(0, filePath.lastIndexOf('/') + 1);
  } else {
    localPath = '';
  }

  // Translate the submit button.
  $('applyButton').value = su.translateString('Apply');

  // Handle top heading (name). Show the count message as the default.
  value = root.name || su.translateString('Unnamed Component');
  su.setContent('config-head', comp.formatContent(value));

  // Handle subheading (summary).
  value = comp.getAttributeValue(root, 'summary') || '';
  if (su.isEmpty(value) == false) {
    su.setContent('config-subhead', comp.formatContent(value));
    su.show('config-subhead')
  } else {
    su.hide('config-subhead')
  }

  value = comp.getAttributeValue(root, 'msrp');
  if (su.isEmpty(value) == false) {
    units = comp.getAttributeUnits(root, 'msrp') || 'DOLLARS';
    value = conv.format(conv.fromBase(value, units), units,
      cfg.DEFAULT_FORMAT_DECIMAL_PLACES, true, skp.decimalDelimiter());
    if (cfg.$single == false) {
      value += ' ' + su.translateString('total');
    }
    su.setContent('config-msrp', comp.formatContent(value));
    su.show('config-msrp')
  } else {
    su.hide('config-msrp')
  }

  value = comp.getAttributeValue(root, 'description') || '';
  if (su.isEmpty(value) == false) {
    su.setContent('config-description', comp.formatContent(value));
    su.show('config-description')
  } else {
    su.hide('config-description')
  }

  value = comp.getAttributeValue(root, 'creator') || '';
  if (su.isEmpty(value) == false) {
    su.setContent('config-creator', su.translateString('by ') +
      comp.formatContent(value));
    su.show('config-creator')
  } else {
    su.hide('config-creator')
  }

  value = comp.getAttributeValue(root, 'itemcode') || '';
  if (su.isEmpty(value) == false) {
    su.setContent('config-itemcode', comp.formatContent(value));
    su.show('config-itemcode')
  } else {
    su.hide('config-itemcode')
  }

  value = comp.getAttributeValue(root, 'imageurl');
  if (su.notEmpty(value)) {
    // If the image path is just a filename (no folders) then append the
    // local skp path to try for a local load.
    if (value.indexOf('\\') == -1 && value.indexOf('/') == -1) {
      value = localPath + value;
    }
  } else {
    value = skp.tempPath() + '/config-thumb.png?' + Math.random();
  }

  arr.length = 0;
  arr.push('<img id="thumbnail" src="', value, '" alt="',
    su.translateString('Component'), '" class="config-thumb');
  if (cfg.$single == false) {
    arr.push('-multiselect');
  }
  arr.push('"/>');
  su.setContent('config-image', arr.join(''));

  // This checks to see if the image loads. If there is a load error, then
  // we will set the path of our image to the default thumb path.
  img = new Image;
  img.onerror = function() {
      $('thumbnail').src = skp.tempPath() + '/config-thumb.png?' + Math.random();
    };
  img.src = value;

  // Handle attribute table.
  totalFields = 0;
  arr.length = 0;
  arr.push('<table cellspacing="0"><tbody>');

  attrs = root.attributeDictionaries[comp.DICTIONARY];

  // Note that attrs is an Object, not an array, so using for (name in attrs)
  // is okay in this case.
  for (name in attrs) {

    // Do not show attributes that start with an underscore,
    // these are used internally for maintaining UI state.
    var attr = comp.getAttribute(root, name);

    // Material is always forced to a unit type of 'STRING' to ensure
    // compatibility with older component versions.
    if (name.toLowerCase() == 'material') {
      attr.units = 'STRING';
    }

    if (name.indexOf('_') != 0 &&
        attr.access != 'NONE' &&
        attr.access != undefined) {

      formLabel = su.sanitizeHTML(su.ifEmpty(attr.formlabel, attr.label));

      arr.push('<tr>',
        '<td class="config-label"><nobr>', formLabel, '</nobr></td>',
        '<td class="config-cell">');

      value = su.sanitizeHTML(attr.value);
      value = su.escapeHTML(value);

      if (attr.access != 'LIST') {
        var units = su.ifEmpty(attr.units, 'STRING');
        if (units == 'DEFAULT') {
          units = skp.units();
        }
        value = conv.fromBase(attr.value, units);
        value = conv.format(value + '', units,
          cfg.DEFAULT_FORMAT_DECIMAL_PLACES, true, skp.decimalDelimiter());
      }

      if (attr.access == 'VIEW') {
        totalFields++;
        arr.push('<input type="text" class="config-field-readonly" value="',
          value, '" readonly="readonly" />');
      } else if (attr.access == 'TEXTBOX') {
        totalFields++;
        arr.push('<input type="text" class="config-field" value="',
          value,
          '" onkeypress="$(\'applyButton\').disabled=false;" ',
          'onblur="cfg.doStoreChanges(', root.id, ',\'', name,
          '\',this,\'', attr.units, '\')" name="', name, '"/>');
      } else if (attr.access == 'LIST') {
        totalFields++;
        arr.push('<select class="config-field" value="', value,
          '" onkeypress="$(\'applyButton\').disabled=false;" ',
          'onchange="cfg.doStoreChanges(', root.id, ',\'', name,
          '\',this,\'', attr.units, '\')" name="', name, '">');

        var options = su.ifEmpty(attr.options, '');
        if (su.isString(options)) {
          options = su.unescapeHTML(options);
        }
        var valuePairs = options.split('&');
        hasFoundValue = false;

        optarr = [];
        for (var valuePairID = 0; valuePairID < valuePairs.length;
            valuePairID++) {
          var valuePair = valuePairs[valuePairID];

          if (su.notEmpty(valuePair)) {
            var nameValueArray = valuePair.split('=');
            selectedString = '';
            value = nameValueArray[1].toLowerCase();
            value = unescape(su.escapeHTML(value));
            if (conv.isEqual(attr.value.toLowerCase(), value) ||
              ('=' + attr.formula).toLowerCase() == value ||
              ('=&quot;' + attr.value + '&quot;').toLowerCase() == value) {
              selectedString = ' selected="selected" ';
              hasFoundValue = true;
            }
            value = unescape(nameValueArray[1]);
            value = su.escapeHTML(value);
            optarr.push('<option value="',
              value,
              '" ', selectedString, '>', unescape(nameValueArray[0]),
              '</option>');
          }
        }

        if (hasFoundValue == false) {
          optarr.unshift('<option value="', value, '"></option>');
        }

        arr.push(optarr.join(''));
        arr.push('</select>');
      }

      arr.push('</td></tr>');
    }
  }
  arr.push('</tbody></table>');

  if (totalFields > 0) {
    su.show('config-options');
    su.setContent('config-error', '')
  } else {
    su.hide('config-options');
    if (cfg.$single == false) {
      su.setContent('config-error', cfg.NO_MATCHING_MESSAGE)
    } else {
      su.setContent('config-error', cfg.ZERO_OPTIONS_MESSAGE)
    }
  }

  su.setContent('config-options', arr.join(''));

  document.getElementById('content').style.top =
    su.elementHeight(document.getElementById('header')) + 'px';

  // Resize our window to the author's specifications, or default to a
  // standard size if none is provided.
  width = su.ifEmpty(comp.getAttributeValue(root, 'dialogwidth'), 345);
  height = su.ifEmpty(comp.getAttributeValue(root, 'dialogheight'), 560);
  su.callRuby('set_dialog_properties', {'width': width, 'height': height});

  cfg.updateLayout();
};

/**
 * Responds to requests (usually initiated via the UI) to apply any changes
 * made to the configuration panel so they appear in SketchUp.
 */
cfg.doApply = function() {
  var key;
  var parts;
  var entityID;
  var attribute;
  var value;
  var noRedraw;
  var attributeCount = 0;
  var changes;
  var elem;
  var name;

  // Current field isn't always picked up if the user didn't tab out but
  // instead just hit return...so grab its value.
  if (su.isValid(elem = document.activeElement)) {
    name = elem.getAttribute('id') || elem.getAttribute('name');
    if (su.notEmpty(name) && (name != 'applyButton')) {
      // Force the blur of the currently selected element to ensure that
      // storeChanges for that value is fired.
      elem.blur();
    }
  }

  // If the changed value list doesn't have values then we can simply return.
  if (su.isEmpty(su.getKeys(cfg.changedValues))) {
    return;
  }

  // The changed values hash can carry the data to be serialized for
  // transmission over the bridge, we just need to include the entities.
  comp.pushAttributeSet(cfg.entityIds, cfg.changedValues);
  cfg.changedValues = {};

};

/**
 * Responds to requests (usually initiated via the UI) to cancel any changes
 * made to the configuration values and close the dialog window.
 */
cfg.doCancel = function() {
  su.callRuby('do_close');
};

/**
 * Stores a changed value in the configuration panels set of changes so they
 * can be pushed to SketchUp for display at the appropriate time.
 * @param {string} nodeID The ID of the element being updated.
 * @param {string} attribute The name of the attribute to modify.
 * @param {Element} field The field whose value is being committed.
 * @return {boolean} True to allow default event handling to continue.
 */
cfg.doStoreChanges = function(nodeID, attribute, field) {
  var defaultValue;
  var displayValue;
  var div;
  var baseValue;

  // Get the entity and unit.
  var entity = su.findEntity(nodeID, cfg.rootEntity);
  var units = su.ifEmpty(comp.getAttributeUnits(entity, attribute), 'STRING');
  if (units == 'DEFAULT') {
    units = skp.units();
  }

  // If this is a list box, then store the value of the field. Otherwise, it
  // must be a text box, so scrub whatever was entered into a valid value.
  if (su.isValid(field.selectedIndex)) {
    baseValue = field.value;
  } else {
    // Take the entered value and turn it into the appropriate base 
    // units. (For example, lengths are always stored in inches, regardless
    // of the unit they are displayed in.)
    var enteredValue = conv.parseTo(field.value, units, skp.decimalDelimiter());
    baseValue = conv.toBase(enteredValue, units);
  }

  cfg.changedValues[nodeID + '__' + attribute] = baseValue + '';
  // If it's a text box we're displaying, format the string.
  if (field.type == 'text') {
    displayValue = conv.format(conv.fromBase(baseValue, units), units,
      cfg.DEFAULT_FORMAT_DECIMAL_PLACES, true, skp.decimalDelimiter());
    // Using this innerHTML trick unescapes the &FFF; style unicode
    // characters so they display properly in a form field.
    div = document.createElement('div');
    div.innerHTML = displayValue;
    displayValue = div.innerHTML;

    field.value = displayValue;
  }

  $('applyButton').disabled = false;
  return true;
};

/**
 * Toggles the simplification of the Classifier attributes.
 * @param {Element} checkbox The checkbox element that controlled the toggle.
 */
cfg.doToggleSimplify = function(checkbox) {
  su.info.simplify = checkbox.checked;
  su.callRuby('do_set_simplify', {'checked': checkbox.checked });
};

/**
 * Returns an Array of key paths, dot-separated key names which represent
 * the paths to descendant objects in the object provided. For example, a
 * nested object {a: {b: 'foo'}} would return ['a', 'a.b'] for key paths.
 * @param {Object} anObject The object to recursively iterate.
 * @param {String} opt_prefix A prefix, passed from the prior invocation
 *     internally. to maintain the key string. Do not pass this value
 *     yourself.
 * @return {Array} The list of key paths for anObject.
 */
cfg.$getKeyPaths = function(anObject, opt_prefix) {
  var arr;
  var i;
  var len;
  var key;
  var slot;

  arr = [];
  if (su.isScalar(anObject)) {
    return arr;
  } else if (su.isJSArray(anObject)) {
    // For arrays we want keys to preserve [i] as part of the path so we can
    // look back and realize we had an array in the data structure.
    len = anObject.length;
    for (i = 0; i < len; i++) {
      key = opt_prefix ? opt_prefix + '[' + i + ']' : '[' + i + ']';
      arr.push(key);
      slot = anObject[i];
      if ((slot != null) && (slot.constructor === Object)) {
        arr = arr.concat(cfg.$getKeyPaths(slot, key));
      }
    }
    return arr;
  } else {
    for (i in anObject) {
      key = opt_prefix ? opt_prefix + '.' + i : i;
      arr.push(key);
      slot = anObject[i];
      if ((slot != null) && (slot.constructor === Object)) {
        arr = arr.concat(cfg.$getKeyPaths(slot, key));
      }
    }
    return arr;
  }
};

/**
 * Responds to notifications that the configuration panel is being resized.
 */
cfg.handleResize = function() {
  cfg.updateLayout();
};

/**
 * Updates the layout of the panel. Note that this is only actively used by IE
 * as Safari's CSS engine can manage the interface automatically.
 */
cfg.updateLayout = function() {
  var elem;

  if (su.IS_MAC) {
    return;
  }

  elem = $('content');
  if (su.isValid(elem)) {
    try {
      elem.style.height = (su.elementGetBorderBox('background').height -
          su.elementGetBorderBox('header').height - 
          su.elementGetBorderBox('footer').height) + 'px';
    } catch (e) {
      // Ignore when new value(s) aren't viable.
    }
  }
};

/**
 * Handles success notification from the Ruby pull_attribute_tree function
 * and triggers initial UI construction based on the selection attribute
 * data provided by that routine.
 * @param {string} queryid The unique ID of the invocation that triggered
 *     this callback.
 */
cfg.handlePullAttributesComplete = function(queryid) {
  var obj;
  var arr;
  var len;
  var count;
  var keys;
  var key;
  var i;
  var j;
  var len2;
  var dict;
  var items;
  var item;
  var root;
  var last;
  var source;
  var attrs;
  var attr;
  var name;
  var msrp;

  // By default we clear any changed attribute list. This is updated for
  // multiple selection to auto-dirty shared values.
  cfg.changedValues = {};

  // Keep a running total of the cost of the selection.
  msrp = 0;

  if (su.notValid(obj = su.getRubyResponse(queryid))) {
    alert(su.translateString('No attribute data returned.'));
  }

  if (su.notValid(arr = obj['entities'])) {
    alert(su.translateString('No entity data returned.'));
  }

  len = arr.length;
  cfg.$count = len;

  switch (len) {
  case 0:
    // Empty selection, nothing to configure but we'll want to redraw.
    cfg.$single = null;
    cfg.rootEntity = null;
    break;
  case 1:
    // Single selection, most common case.
    cfg.$single = true;
    cfg.rootEntity = arr[0];

    // Place this component's name attribute into the root for display.
    cfg.rootEntity.name = su.ifEmpty(comp.getAttributeValue(cfg.rootEntity,
        'name'), cfg.rootEntity.name);
    break;
  default:
    // Multiple-selection. have to merge attributes into a common root
    // entity that will allow the user to edit a group en-masse.
    cfg.$single = false;
    count = 0;
    dict = {};

    // Get a list of keys for each object that represent the set of nested
    // object names which might be shared. 
    for (i = 0; i < len; i++) {

      obj = arr[i];
      // Note that we don't bother with objects that aren't components with
      // dynamic attribute subcontent.
      if (su.notValid(obj) || (obj.typename != 'ComponentInstance')) {
        continue;
      }
      if (su.notValid(attrs = comp.getAttributes(obj))) {
        continue;
      }

      msrp += parseFloat(su.ifEmpty(comp.getAttributeValue(obj, 'msrp'), 0));

      // Count the valid ones for later filtering.
      count++;
      keys = cfg.$getKeyPaths(obj);

      // Inject the keys/counts into our dictionary of known keys.
      len2 = keys.length;
      for (j = 0; j < len2; j++) {
        key = keys[j];
        dict[key] = (dict[key] || 0) + 1;
      }
    }

    // Now we remove those that are shared, leaving the list we should
    // prune from a prototypical instance.
    items = su.getItems(dict);
    len = items.length;
    for (i = 0; i < len; i++) {
      item = items[i];
      if (item[1] == count) {
        try {
          delete dict[item[0]];
        } catch (e) {
          // Ignore errors.
        }
      }
    }

    // Sort the remaining keys so shortest go first, which ensures that
    // we remove from the top down in the next loop.
    keys = su.getKeys(dict);
    keys.sort(function(a, b) {
      if (a.length < b.length) {
        return -1;
      } else if (a.length == b.length) {
        if (a < b) {
          return -1;
        } else if (a == b) {
          return 0;
        } else {
          return 1;
        };
      } else {
        return 1;
      }
    });

    // The optimization here is that we only need to remove the top-most
    // slot for each key, so a set of keys which all start with 'x.' can be
    // simplified to 'x'.
    len = keys.length;
    for (i = 0; i < len; i++) {
        key = keys[i];
        if ((last != null) && (key.indexOf(last) == 0)) {
          keys[i] = null;
        };
        last = key;
    };

    // We'll use the first selected object as the prototype.
    root = arr[0];

    len = keys.length;
    for (i = 0; i < len; i++) {
      key = keys[i];
      if (key == null) {
        continue;
      };
      try {
        source = 'delete root.' + key;
        eval(source);
      } catch (e) {
        // Ignore errors.
      }
    }

    cfg.rootEntity = root;
    root.name = cfg.$count + ' ' + su.translateString('Components');

    // Mapping root entity leaves to the changedValues data effectively
    // dirties the entire set of shared attributes so we can immediately
    // apply changes to all selected items without having to edit each one.
    cfg.changedValues = {};
    attrs = root.attributeDictionaries[comp.DICTIONARY];

    // Note that attrs is an Object, not an array, so using for/in looping
    // is okay in this case.
    for (name in attrs) {
      attr = comp.getAttribute(root, name);
      if (name.indexOf('_') != 0 &&
          attr.access != 'NONE' &&
          attr.access != undefined) {
          cfg.changedValues[name] = attr.value;
      }
    }

    comp.setAttributeValue(root, 'msrp', msrp);
    break;
  }

  cfg.initUI();

  comp.pullAttributes({'selection_ids': cfg.selectionIds,
      'dictionary': 'all_dictionaries',
      'oncomplete': 'cfg.handlePullClassifierDictionaries'});
};


/**
 * Checks if the given collection of entities all have the same schema type
 * applied.
 * @param {array} entities The collection of entities to compare.
 * @return {boolean}
 */
cfg.allClassifierTypesAreTheSame = function(entities) {
  var types = null;
  for (var i = 0; i < entities.length; i++) {
    var entity = entities[i];

    var dicts = entity.attributeDictionaries;
    if (!dicts) { continue; }

    var schemaTypes = dicts.AppliedSchemaTypes;
    if (!schemaTypes) { continue; }

    var schemaTypeNames = cfg.schemaTypeNames(schemaTypes);

    if (types === null) {
      types = schemaTypeNames;
    } else if (!cfg.schemaTypeNamesAreTheSame(types, schemaTypeNames)) {
      return false
    }
  }
  return true;
};


/**
 * Returns the schema type names for a given schema type collection.
 * @param {array} schemaTypes The schema type collection.
 * @return {array} Array of schema type names.
 */
cfg.schemaTypeNames = function(schemaTypes) {
  var names = [];
  for (var schemaType in schemaTypes) { 
    var schemaName = schemaTypes[schemaType];
    names.push(schemaName);
  };
  return names.sort();
};


/**
 * Compares two arrays of schema type names.
 * @param {array} names1 The first array of schema names.
 * @param {array} names2 The second array of schema names.
 * @return {boolean}
 */
cfg.schemaTypeNamesAreTheSame = function(names1, names2) {
  if (names1.length != names2.length) {
    return false;
  }
  for (var j = 0; j < names1.length; j++) {
    if (names1[j] != names2[j]) {
      return false;
    }
  }
  return true;
};


/**
 * Handles success notification from the Ruby pull_attribute_tree function
 * that gets all of the classification attributes.
 * @param {string} queryid The unique ID of the invocation that triggered
 *     this callback.
 */
cfg.handlePullClassifierDictionaries = function(queryid) {
  var obj;
  if (su.notValid(obj = su.getRubyResponse(queryid))) {
    alert(su.translateString('No classifier data returned.'));
  }

  // TODO(thomthom): Do we want to display a message that the selection contains
  // a mismatch of classification types? At the moment it just doesn't give any
  // indication that there is classifier data when there is valid DC data.
  // When there is no valid DC data and classifier data there is a warning.
  if (!cfg.allClassifierTypesAreTheSame(obj.entities)) {
    return;
  }

  var root = obj.entities[0];
  var dicts = root.attributeDictionaries || {};
  var schemaTypes = dicts.AppliedSchemaTypes;

  var arr = [];

  if (!schemaTypes) {
    return;
  }
  
  su.show('config-options');
  su.hide('config-error');

  for (var schemaName in schemaTypes) { 
    var schemaType = schemaTypes[schemaName];
    var schemaTypeShortName = schemaType.split(':').pop();
    var atts = dicts[schemaName];
    var path = cfg.escapePathComponent(schemaName);
    arr.push(cfg.attributeTreeToForm(atts, root,
        schemaName + ': ' + schemaTypeShortName, 0, path + '.'));
  };

  // Add simplify option.
  if (arr.length > 0) {
    var checked = (su.info.simplify) ? 'checked="checked" ' : '';
    var simplify = '<div id="simplify">' + 
      '<label>' + su.translateString('Simplify') + ': ' +
      '<input type="checkbox"' +
        checked +
        'onclick="cfg.doToggleSimplify(this);" />' +
      '</label></div>';
    document.getElementById('config-options').innerHTML += simplify;
  }

  document.getElementById('config-options').innerHTML += arr.join('');

  // TODO(scott): Remove this code. Only being used for debugging right now.
  /*
  var pop = window.createPopup();
  var popBody = pop.document.body;
  popBody.style.backgroundColor = "lightyellow";
  popBody.style.border = "solid black 1px";
  popBody.style.fontSize = "10px";
  popBody.innerHTML = '<pre>' + JSON.stringify(obj, '', 2);
  pop.show(0, 400, 320, 100, document.body);
  */
};


/**
 * In order to handle schemas and attribute names with periods they must be
 * escaped. The extreme number of backslashes is because the escaped strings
 * are injected and evaluated into the HTML page - doubleing the required
 * number of escapes.
 *
 * Example:
 *   "gbXML5\.10.controlZoneIdRef.value"
 *   This becomes:
 *     "gbXML5\\.10.controlZoneIdRef.value"
 *   Which by the time it arrives to Ruby it becomes:
 *     "gbXML5\.10.controlZoneIdRef.value"
 *   Which finally the Ruby side parses as:
 *     ["gbXML5.10", "controlZoneIdRef", "value"]
 *
 * @param {string} component The schema or attribute name to be escaped.
 */
cfg.escapePathComponent = function(component) {
  return component.replace(/\\/g, '\\\\\\\\').replace(/\./g, '\\\\.');
};


/**
 * Handler for events that modify classification fields. Marks the "apply"
 * button so it's clickable.
 * @param {Element} input The HTML input element that was changed.
 */
cfg.onClassifierChanged = function(input) {
  $('applyButton').disabled = false;
};


/**
 * Handler for focus event on classification fields. Ensures that the
 * field in question is not "hidden" inside a collapsed portion of the
 * attribute tree.
 * @param {Element} input The HTML input element that was focused.
 */
cfg.onClassifierFocus = function(input) {
  var tableNode = input.parentNode.parentNode.parentNode;
  var groupNode = tableNode.parentNode.parentNode.parentNode;
  if (!groupNode) {
    return;
  }
  if (groupNode.className == 'classifier-group-collapsed') {
    groupNode.className = 'classifier-group-visible';
  }
};


/**
 * Handler for focus event on classification fields. Ensures that the
 * field in question is not "hidden" inside a collapsed portion of the
 * attribute tree.
 * @param {Element} titleDiv The HTML div element that was clicked.
 */
cfg.toggleClassifierGroup = function(titleDiv) {
  if (titleDiv.parentNode.className == 'classifier-group-collapsed') {
    titleDiv.parentNode.className = 'classifier-group-visible';
  } else {
    titleDiv.parentNode.className = 'classifier-group-collapsed';
  }
};


/**
 * Custom sort function for attribute names. Puts lowercase attributes first.
 * @param {string} a The first attribute name.
 * @param {string} b The second attribute name.
 * @return {number} The sort result, -1 or 1.
 */
cfg.classifierAttributeSort = function (a, b) {
  var fixedA = a;
  var fixedB = b;

  if (fixedA.substr(0, 1).toLowerCase() == fixedA.substr(0, 1)) {
    fixedA = '_' + fixedA;
  }
  if (fixedB.substr(0, 1).toLowerCase() == fixedB.substr(0, 1)) {
    fixedB = '_' + fixedB;
  }

  if (fixedA.toLowerCase() < fixedB.toLowerCase()) {
    return -1;
  } else {
    return 1;
  }
};


/**
 * Generates an HTML form representing a given classification attribute
 * set.
 * @param {Object} atts A hash of attributes or attribute info.
 * @param {Object} root The root entity.
 * @param {string} title The "name" of this attribute or attribute set.
 * @param {number} depth The depth of the recursion, with 0 being the root.
 * @param {string} path The dot-syntax "path" to the current attribute
 *     dictionary. Will be something like 'ifcXML4.instanceAttributes.'.
 * @return {string} The HTML code.
 */
cfg.attributeTreeToForm = function(atts, root, title, depth, path) {
  var depth = depth || 0;
  var arr = [];

  var groupClass = 'classifier-group-collapsed';
  if (depth == 0) {
    groupClass = 'classifier-group-visible';
  }

  arr.push('<br/><div class="', groupClass, '">',
    '<div class="classifier-group-title classifier-subgroup-title-', depth,
    '" onclick="cfg.toggleClassifierGroup(this)">', title, '</div>',
    '<div class="classifier-group-padding">');

  arr.push('<table cellspacing="0"><tbody>');

  // First put our names into two sortable lists. We show the simple
  // classification attributes before we show the complex ones.
  var simpleAttNames = [];
  var complexAttNames = [];
  for (var name in atts) {
    var attr = atts[name];
    var value = attr.value;
    if (value === undefined) {
      if (typeof attr == 'object') {
        complexAttNames.push(name);
      }
    } else {
      simpleAttNames.push(name);
    }
  }

  // Now sort using our custom algorithm.
  simpleAttNames.sort(cfg.classifierAttributeSort);
  complexAttNames.sort(cfg.classifierAttributeSort);

  // Loop across our simple attributes to make editable fields.
  for (var i = 0; i < simpleAttNames.length; i++) {
    var name = simpleAttNames[i];
    var attr = atts[name];
    var value = attr.value;

    arr.push('<tr><td class="config-label"><nobr>', su.sanitizeHTML(name),
        '</nobr></td><td class="config-cell">');

    if (attr.options) {
      arr.push('<select class="config-field" value="', value, '"',
          ' onfocus="cfg.onClassifierFocus(this)" ',
          ' onkeypress="cfg.onClassifierChanged(this)" ',
          ' onchange="cfg.onClassifierChanged(this)" ',
          ' onblur="cfg.doStoreChanges(', root.id, ',\'', path + name,
          '\',this,\'string\')" name="', name, '">');
      
      var hasFoundValue = false;
      var optarr = [];
      for (var j = 0; j < attr.options.length; j++) {
        var optionValue = attr.options[j];

        var selectedString = '';
        if (conv.isEqual(attr.value, optionValue)) {
          selectedString = ' selected="selected" ';
          hasFoundValue = true;
        }
        optarr.push('<option value="',
          su.sanitizeHTML(optionValue),
          '" ', selectedString, '>', su.sanitizeHTML(optionValue),
          '</option>');
      }

      if (!hasFoundValue) {
        optarr.unshift('<option value="', su.sanitizeHTML(value), '">',
            su.sanitizeHTML(value), '</option>');
      }
      arr.push(optarr.join(''));
      arr.push('</select>');
    } else {
      arr.push('<input type="text" class="config-field" value="',
          value, '"',
          ' onfocus="cfg.onClassifierFocus(this)" ',
          ' onkeypress="cfg.onClassifierChanged(this)" ',
          ' onblur="cfg.onClassifierChanged(this)" ',
          ' onchange="cfg.doStoreChanges(', root.id, ',\'', path + name,
          '\',this,\'string\')" name="', name, '"/>');
    }
    arr.push('</td></tr>');
  }
  arr.push('</tbody></table>');

  // Complex attributes have sub-attributes. Recurse down into these.
  for (var i = 0; i < complexAttNames.length; i++) {
    var name = complexAttNames[i];
    var attr = atts[name];
    var escaped_name = cfg.escapePathComponent(name);
    arr.push(cfg.attributeTreeToForm(attr, root, su.sanitizeHTML(name),
        depth + 1, path + escaped_name + '.'));
  }

  arr.push('</div></div>');

  return arr.join('');
};


/**
 * Responds to notification that the pullSelectionIds call has succeeded on
 * our behalf. Changes to the current selection will trigger this routine so
 * that the configuration panel remains slaved to the current selection.
 * @param {string} queryid The unique ID of the invocation that triggered
 *     this callback.
 * @param {string} idlist An optional comma-delimited list of specific
 *     IDs to process as the selection set.
 */
cfg.handlePullSelectionIdsComplete = function(queryid, idlist) {
  var ids;
  var list;
  var len;

  // NOTE that we don't leave these purely on the comp object since we
  // share that dataset with the manager panel and it may be altering our
  // data if it changes focus.
  ids = idlist || comp.selectionIds;

  // ID is no selection ID? Clear all cached ID sets.
  if (ids == -1) {
    ids = '';
    comp.selectionIds = null;
    cfg.entityIds = null;
  } else {
    cfg.entityIds = ids;
  }

  if (su.isEmpty(ids)) {
    cfg.clearCustomStyle();
    su.setContent(document.body, cfg.ZERO_ENTITIES_MESSAGE);
    return;
  }

  list = ids.split(',');
  len = list.length;
  if (len == 0) {
    // No length? No selection -- 0 entities selected.
    cfg.clearCustomStyle();
    su.setContent(document.body, cfg.ZERO_ENTITIES_MESSAGE);
    return;
  } else if (len > cfg.CONFIRM_SIZE) {
    // Over the limit, have to confirm and then either cancel or
    // continue.
    if (!confirm('Merging multiple items might be slow. Continue?')) {
      cfg.clearCustomStyle();
      su.setContent(document.body, len + ' entities selected.');
      return;
    }
  }

  cfg.selectionIds = ids;
  comp.pullAttributes({'selection_ids': cfg.selectionIds,
    'oncomplete': 'cfg.handlePullAttributesComplete'});
};

/**
 * Clears any custom style sheet that may be current for the configuration
 * panel.
 */
cfg.clearCustomStyle = function() {
  // Remove any custom style sheet regardless of selection size so we
  // don't have leftover UI even on an empty selection.
  if (su.notEmpty(cfg.lastCustomCSS_)) {
    su.removeStylesheet(document, cfg.lastCustomCSS_);
    cfg.lastCustomCSS_ = null;
  }
};
