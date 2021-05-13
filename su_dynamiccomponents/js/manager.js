//  Copyright: Copyright 2012, Trimble Navigation Limited
//  License: All Rights Reserved.

/**
 * @fileoverview Manage Attributes panel support routines. NOTE that this
 * file relies on the dcbridge.js file having been included as well as the
 * components.js base routines common to all component dialogs.
 */

/**
 * The global manager namespace, containing functions, properties, and
 * constants specific to the Dynamic Components Manager panel.
 * @type {Object}
 */
var mgr = {};

// Export the su namespace. See dcbridge.js for definition.
var su = window.su;

// Export the skp namespace. See dcbridge.js for definition.
var skp = window.skp;

// Export comp namespace. See components.js for definition.
var comp = window.comp;

// Export conv namespace. See converter.js for definition.
var conv = window.conv;

// Export the $ function. See dcbridge.js for definition.
var $ = window.$;

// String constants used in the user interface in various places.
mgr.ENTER_NAME_STRING = 'Enter Name';
mgr.FALSE_STRING = 'FALSE';
mgr.TRUE_STRING = 'TRUE';
mgr.ERROR_PREFIX = '<span class="subformula-error">#</span> ';
mgr.APPLYING_ATTRIBUTE_MESSAGE = '<span id="applying-attribute-message">' +
    'Saving...' + '</span>';
mgr.DEFAULT_OPTION_LABEL = 'Enter Option Here';
mgr.DEFAULT_OPTION_VALUE = 'Enter Value';
mgr.ADD_ATTRIBUTE = 'Add attribute';

/**
 * How many decimal places to show when the user enters edit mode.
 * @type {number}
 */
mgr.DEFAULT_EDIT_DECIMAL_PLACES = 6;

/**
 * Maximum string length we will allow a component or group to be renamed to.
 * @type {number}
 */
mgr.MAX_NAME_LENGTH = 64;

/**
 * Value that is stored in the scaletool attribute when all handles are hidden.
 * @type {number}
 */
mgr.ALL_SCALE_HANDLES_HIDDEN = 127;

/**
 * The offset used for tab display in the component attributes panel.
 * @type {number}
 */
mgr.EDIT_FIELD_REFERENCE_TAB_HEIGHT = 15;

/**
 * The standard width of the editor cell border, used for offset
 * computations.
 * @type {number}
 */
mgr.BORDER_OFFSET = 3;

/**
 * The standard offset used for computations of edit field positioning.
 * @type {number}
 */
mgr.FIELD_OFFSET = 24;

/**
 * The position used when moving the editor cell offscreen for hiding.
 * @type {number}
 */
mgr.HIDDEN_EDITOR_TOP = -5000;

/**
 * The offset height necessary to ensure proper positioning of edit-panel.
 * This must be adjusted if markup layout is adjusted.
 * @type {number}
 */
mgr.HIGHLIGHT_EDIT_OFFSET = 85;

/**
 * Keycode for US ASCII 101 '='.
 * @type {number}
 */
mgr.EQUAL_KEY_STD = 61;

/**
 * Keycode for US ASCII 101 '=' on number pad.
 * @type {number}
 */
mgr.EQUAL_KEY_NUM = 187;

/**
 * Keycode for US ASCII 101 '@' (commat).
 * @type {number}
 */
mgr.COMMAT_KEY = 50;

/**
 * Access enumeration defining the alternatives for user atttribute access.
 * @type {Array}
 */
mgr.ACCESS = [
  {value: 'NONE', label: 'Users cannot see this attribute.'},
  {value: 'VIEW', label: 'Users can see this attribute.'},
  {value: 'TEXTBOX', label: 'Users can edit as a textbox.'},
  {value: 'LIST', label: 'Users can select from a list.', disabled: true}
];

/*
 * A list of the cells which should be treated as having an implicit formula
 * as their content.
 * @type {array}
 */
mgr.FORMULA_CELL_LABELS = ['onClick'];

/**
 * Offset to add when focusing on the 'current' field in a field list.
 * @type {number}
 */
mgr.FOCUS_CURRENT = 0;

/**
 * Offset to add when focusing on the 'next' field in a field list.
 * @type {number}
 */
mgr.FOCUS_NEXT = 1;

/**
 * Offset to add when focusing on the 'previous' field in a field list.
 * @type {number}
 */
mgr.FOCUS_PREVIOUS = -1;

/**
 * The tree instance which handles all rendering responsibilities.
 */
mgr.tree = null;

/**
 * The last DOM Element selected via either click or mouse movement. This
 * tracks the user's last selection to assist with redraw and editing.
 * @type {Element}
 */
mgr.lastElementSelected = null;

/**
 * Whether the manager is currently calling on SketchUp for Ruby data.
 * @type {boolean}
 */
mgr._calling = false;

/**
 * Whether the edit field is currently floating above the attribute tree.
 * @type {boolean}
 */
mgr._floating = false;

/**
 * The setTimeout/clearTimeout timer object used for smooth display updates.
 * @type {Object}
 */
mgr.finalScrollAdjustTimeout = null;

/**
 * The setTimeout/clearTimeout timer object used for smooth resize handling.
 * @type {Object}
 */
mgr.finalResizeAdjustTimeout = null;

// ---
// Initialization / Startup
// ---

/**
 * Initializes the Manage Attributes panel with content from the current
 * selection.
 */
mgr.init = function() {

  // Set up our initial state for less screen flashing on large DCs.
  mgr.updateLayout();

  mgr.SELECT_MESSAGE = '<div class="no-selection-head">' +
    su.translateString('Single Component Not Selected') + '</div>' +
    '<div class="no-selection-content">' +
    su.translateString(
        'Select a single component to view its attributes.') +
    '</div>';

  // Translate static parts of the UI.
  $('refresh-button').title = su.translateString('Refresh');
  $('settings-button').title = su.translateString('Toggle Formula View');
  $('tab-basic-title').innerHTML = su.translateString('Info');
  $('tab-function-title').innerHTML = su.translateString('Functions');

  // Start off requesting common SketchUp environment information. The
  // initRootEntity callback will then proceed to load entity data.
  mgr.callRuby('pull_information',
    {'onsuccess': 'su.handlePullInformationSuccess',
    'oncomplete': 'mgr.initRootEntity'});
};

/**
 * Initializes the root entity data and updates the user interface as a
 * downstream activity, ensuring the content of the configuration panel is
 * current with the root entity data found.
 * @param {string} queryid The unique ID of the invocation which triggered
 *     this callback.
 */
mgr.initRootEntity = function(queryid) {

  // Now that we have our su.info loaded, we can calculate our help URLs.
  // Note that there is a problem with loading double quotes from inside
  // a translated string, so to minimize the risk of dropping a translation,
  // the DC_HELP_URL is an unquoted parameter.
  var intro = su.translateString('Add attributes below to create your ' +
      'component options. Visit our <a href=DC_HELP_URL>getting started ' +
      'guide</a> for tutorials.');
  mgr.INTRO_STATUS = intro.replace(/DC_HELP_URL/gi,
    'skp:do_open_url@url=' + su.info['dc_help_url']);

  mgr.FUNCTIONS_URL = su.info['dc_functions_url'];

  mgr.SELECT_MESSAGE = '<div class="no-selection-head">' +
    su.translateString('Single Component Not Selected') + '</div>' +
    '<div class="no-selection-content">' +
    su.translateString(
        'Select a single component to view its attributes.') +
    '</div>';

  // Translate static parts of the UI.
  $('refresh-button').title = su.translateString('Refresh');
  $('settings-button').title = su.translateString('Toggle Formula View');
  $('tab-basic-title').innerHTML = su.translateString('Info');
  $('tab-function-title').innerHTML = su.translateString('Functions');

  // Effectively this is the same as a redraw, but without having an entity
  // in place yet.
  comp.pullAttributes({
    'deep': true,
    'oncomplete': 'mgr.handlePullAttributesComplete'
  });
};

/**
 * Invokes a function in Ruby defined as part of the SketchUp Ruby API or as
 * part of an included/required Ruby module. NOTE that this call is made in
 * an asynchronous fashion. Callbacks to the JavaScript are dependent on the
 * Ruby function being invoked. See SketchUp's js_callback Ruby method for
 * more information on how to return results to the invoking JavaScript.
 * @param {string} funcname The name of the Ruby function to invoke.
 * @param {string|Object} opt_request A pre-formatted URL-style query string
 *     or an object whose keys and values should be formatted into a URL
 *     query string.
 */
mgr.callRuby = function(funcname, opt_request) {

  mgr.isCalling(true);
  mgr.showCurtain();

  // Note that the call to the true bridge is last since it's async.
  su.callRuby(funcname, opt_request);
};

/**
 * Returns the current state of the manager's "calling sketchup" flag. When a
 * call to SketchUp is underway this flag will be true. You can set the value
 * of the flag by passing the new value as the first parameter.
 * @param {boolean} opt_flag An optional new value for the calling flag.
 * @return {boolean} True when a call is actively underway.
 */
mgr.isCalling = function(opt_flag) {
  if (su.isValid(opt_flag)) {
    mgr._calling = opt_flag;
  }

  return mgr._calling;
};

/**
 * Hides the semi-opaque event-trapping layer over the panel's document body.
 */
mgr.hideCurtain = function() {
  su.hide('curtain');
};

/**
 * Shows a semi-opaque layer over the panel's document body, trapping events.
 */
mgr.showCurtain = function() {
  var el = $('curtain');
  if (su.notValid(el)) {
    el = document.createElement('div');
    el.setAttribute('id', 'curtain');
    document.body.appendChild(el);
  }

  su.show(el);
};

/**
 * Respond to notifications that attributes related to the managed entity have
 * been retrieved.
 * @param {string} queryid The unique ID of the invocation which triggered
 *     this callback.
 */
mgr.handlePullAttributesComplete = function(queryid) {

  var obj;
  var arr;

  // Depress the refresh button.
  $('refresh-button').className = 'refresh-button';

  mgr.isCalling(false);
  mgr.hideCurtain();

  if (su.notValid(obj = su.getRubyResponse(queryid))) {
    alert(su.translateString('No attribute data returned.'));
  }

  if (su.notValid(arr = obj['entities'])) {
    alert(su.translateString('No entity data returned.'));
  }

  if (arr.length != 1) {
    // We need to hide the details panel and leave the functions tab to ensure
    // that pulldown controls do not "show through" the message-panel on IE.
    if (mgr.isDetailing()) {
      if (mgr.tree) {
        mgr.tree.hideDetailPanel();
      }
    }
    mgr.setTab('basic');

    su.show('message-panel');
    su.setContent('message-panel', mgr.SELECT_MESSAGE);
    return;
  } else {
    su.hide('message-panel');
  }

  // If the root entity has changed, meaning the user has selected another
  // DC than they had before, do some cleanup of the previous state.
  if (mgr.rootEntity != arr[0]) {
    if (mgr.isHighlighting()) {
       mgr.hideHighlight();
    }
  }

  // The manager (currently) works on single entity, so extract first item as
  // the rootEntity driving the attribute tree.
  mgr.rootEntity = arr[0];
  mgr.initUI();
};

/**
 * Initializes the user interface of the Manage Attributes panel based on
 * data in the mgr.rootEntity object acquired from the current selection.
 * This operation is invoked on panel startup as well as in response to edits
 * which need to push data to the Ruby side of the bridge so that the view can
 * be updated in response to attribute value changes.
 */
mgr.initUI = function() {

  mgr.tree = new AttributeTree('mgr.tree');

  // If we have already initialized, we can skip redrawing the entire UI and
  // instead redraw the mgr.tree.
  if (mgr.initDone == true) {
    mgr.tree.render();
    return;
  }
  mgr.initDone = true;

  // Keep ESCAPE from closing the panel and process top-level navigation
  // keys outside of any particular field (hence we don't use onkeydown).
  comp.installKeyHandler('down', mgr.tree.handleKeyDown);
  comp.installKeyHandler('press', mgr.tree.handleKeyPress);
  comp.installKeyHandler('up', mgr.tree.handleKeyUp);

  if ($('extras').getElementsByTagName('form').length == 0) {
    // Configure the extras content, which includes the editing field and the
    // various affordances for showing highlighting of the currently focused
    // field.
    var arr = [];

    // Open a form so input elements and textareas render properly.
    arr.push('<form name="edit-form" onsubmit="return false;">');

    // The editing panel and textarea used for text input.
    arr.push('<div id="edit-panel" class="edit-panel">');
    arr.push('<div id="edit-field-reference-tab"></div>');
    arr.push('<textarea id="edit-field" name="edit-field" class="edit-field"',
        ' onkeydown="', mgr.tree.id, '.handleKeyDown(this, event)"',
        ' onkeypress="', mgr.tree.id, '.handleKeyPress(this, event)"',
        ' onkeyup="', mgr.tree.id, '.handleKeyUp(this, event)"',
        ' oncut="mgr.updateEditorLayoutTimeout()"',
        ' onpaste="mgr.updateEditorLayoutTimeout()"',
        '/></textarea>');
    arr.push('</div>');

    // Close the form.
    arr.push('</form>');

    // The focus highlighting divs.
    arr.push('<div id="highlight-panel" class="highlight-panel"></div>');
    arr.push('<div id="highlight-line-top" class="highlight-line"></div>');
    arr.push('<div id="highlight-line-left" class="highlight-line"></div>');
    arr.push('<div id="highlight-line-right" class="highlight-line"></div>');
    arr.push('<div id="highlight-line-bottom" class="highlight-line"></div>');

    // The details button
    arr.push('<div id="details-button" title="', su.translateString('Details'),
      '" class="details-button" onclick="',
      mgr.tree.id, '.showDetailPanel()"></div>');

    // The delete button.
    arr.push('<div id="delete-button" title="', su.translateString('Delete'),
      '" class="delete-button" onclick="',
      mgr.tree.id, '.deleteAttribute()"></div>');

    // The function list panel.
    arr.push('<div id="list-panel" class="list-panel">',
        '<div id="list-sub-panel" class="list-sub-panel"></div></div>');

    // Complete the extras html content and inject it into the UI.
    var html = arr.join('');
    su.setContent('extras', html);
  }

  // Cache references to the edit panel and scroll panel for better
  // performance in routines below.
  mgr.editPanel = $('edit-panel');
  mgr.scrollPanel = $('scroll-panel');

  // Reset the active tab to be what it was when the user closed the panel.
  var activeTab;
  if (su.notEmpty(activeTab = su.retrieveFromCookie('activeTab'))) {
    mgr.setTab(activeTab);
  }

  // Draw the main attribute tree content next. This generates the actual
  // tree/spreadsheet UI elements.
  mgr.tree.render();

  // Update the status bar, which is defined in the original HTML content.
  mgr.setStatusBar(mgr.INTRO_STATUS);

  // Disable text selection across most content areas.
  var disableSelect = function(evt) { return false; };
  $('highlight-panel').onselectstart = disableSelect;
  $('header').onselectstart = disableSelect;
  $('tab-panel').onselectstart = disableSelect;
  $('list-panel').onselectstart = disableSelect;
  $('footer').onselectstart = disableSelect;
  $('message-panel').onselectstart = disableSelect;
  $('functions-panel').onselectstart = disableSelect;
  $('edit-field-reference-tab').onselectstart = disableSelect;

  mgr.scrollPanel.onselectstart = function(evt) {
    var ev = evt || window.event;
    var target = ev.target || ev.srcElement;

    // IE does not consistently return the nodeType one would expect, so the
    // TEXTAREA tag check is a workaround for IE.
    if (target.tagName == 'TEXTAREA') {
      return true;
    } else if (target.nodeType != Node.TEXT_NODE) {
      return false;
    }
  };

  mgr.scrollPanel.onscroll = function(evt) {

    window.clearTimeout(mgr.finalScrollAdjustTimeout);

    mgr.finalScrollAdjustTimeout = window.setTimeout(function() {
      mgr.floatEditorIfNecessary();
      if (mgr.isEditing()) {
        $('edit-field').focus();
      }
    }, 100);

    mgr.floatEditorIfNecessary();
  };

  // If the user is selecting from the big list of attributes and they click
  // outside onto the scroll panel hide the list panel the same way that
  // standard select controls hide their options.
  $('content').onmousedown = function(evt) {
    if (su.isVisible('list-panel') &&
      $('edit-field').value == su.translateString(mgr.ENTER_NAME_STRING)) {
      mgr.tree.hideEditPanels();
    }
  };

  // Build the interface for the functions tab/select list.
  arr = [];
  arr.push('<table class="function-summary-table" cellspacing="0">', '<tr><td>',
    '<select id="function-list" onchange="mgr.showFunctionSummary(this)">',
    '<option class="function-list-item">',
    su.translateString('Select a spreadsheet function...'),
    '</option>');

  // Generate an option for each available function as defined in the
  // components.js function list.
  for (var functionSetName in comp.functionList) {

    arr.push('<option class="function-list-head">',
        su.translateString(functionSetName));

    var functionArray = comp.functionList[functionSetName];
    for (var i = 0; i < functionArray.length; i++) {
      var functionData = functionArray[i];
      arr.push('<option value="', su.translateString(functionData.summary),
        '" class="function-list-item">&nbsp;',
        su.translateString(functionData.name), '</option>');
    }
  }

  // Close the select list and its enclosing table data cell.
  arr.push('</select></td>');

  // Next cell is the insert button which will inject the currently selected
  // function into the edit cell at the cursor location. Setting width to 1%
  // here keeps the input button pushed to the far right.
  arr.push('<td width="1%"><input type="button" disabled="true"',
    ' id="insert-button" onclick="mgr.insertFunction()"',
    ' class="submit-button" value="', su.translateString('insert'), '">',
    '</td></tr>',
    '</table>');

  // Below the select list/input button pair we keep another table whose
  // content is the summary text and a "more" link.
  arr.push('<table class="function-summary-table" cellspacing="0"><tr>',
    '<td><div id="function-summary"></div></td>',
    '<td id="function-insert-cell"><a href="skp:do_open_url@url=',
    // NOTE that this embedded URL has no quoting.
    mgr.FUNCTIONS_URL, '"><b>',
    su.translateString('more'), '&#187;</b></a>&nbsp;',
    '</td></tr></table>');

  $('functions-panel').innerHTML = arr.join('');

  // Hide any of the extras we don't want to be visible on first view.
  su.hide('details-panel');

  // If the user interface is being completely (re)built then we'll have to
  // reset any focus/highlighting that might have been in place. This is due
  // to the asynchronous nature of calls to the Ruby side of the bridge.
  window.setTimeout(function() {
    mgr.refocus();
  }, 0);

  mgr.updateLayout();
};

// ---
// Display Management
// ---

/**
 * Responds to notifications that the manager panel is being resized. As a
 * result the detail controls are hidden and the highlight or edit cell (if
 * visible) are resized to fit their underlying cell.
 */
mgr.handleResize = function() {

  mgr.updateLayout();

  if (mgr.tree) {
    mgr.tree.hideDetailControls();
  }

  if (mgr.isDetailing()) {
    mgr.updateDetailPanelLayout();
  }

  if (mgr.isHighlighting()) {
    mgr.tree.highlight();
  }

  if (mgr.isEditing()) {

    window.clearTimeout(mgr.finalResizeAdjustTimeout);

    mgr.finalResizeAdjustTimeout = window.setTimeout(function() {
    mgr.updateEditorLayout();
    mgr.floatEditorIfNecessary();
      if (mgr.isEditing()) {
        $('edit-field').focus();
      }
    }, 100);

    mgr.updateEditorLayout();
    mgr.floatEditorIfNecessary();
    if (mgr.isFloating()) {
      mgr.updateFloatingEditorLayout();
    }
  }
};

/**
 * Toggles formula view mode on or off, rendering the tree appropriately.
 */
mgr.toggleFormulaView = function() {

  if (mgr.showFormulas == true) {
    mgr.showFormulas = false;
    $('settings-button').className = 'settings-button';
  } else {
    mgr.showFormulas = true;
    $('settings-button').className = 'settings-button-on';
  }

  // Since this will redraw our panel, we need to store the refocus rule.
  if (mgr.getFocusedElement()) {
    mgr.refocusIndex = mgr.FOCUS_CURRENT;
    mgr.refocusTarget = mgr.getFocusedElement().getAttribute('id');
  }
  mgr.tree.render();

};

/**
 * Forces a redraw of the user interface.
 */
mgr.redraw = function() {
  comp.pullAttributes({
    'selection_ids': '',
    'deep': true,
    'oncomplete': 'mgr.handlePullAttributesComplete'
  });
};

/**
 * Updates the layout of the detail panel, adjusting specific style
 * properties to help ensure proper display.
 */
mgr.updateDetailPanelLayout = function() {
  // Update the details panel formLabel field to be a fixed size that fits
  // within its parent cell, regardless of the length of the content inside.
  var formLabel = $('formlabel-textbox')
  if (su.isValid(formLabel)) {
    // Note that we first set the size to a fixed value, otherwise the
    // subsequent call to su.elementWidth(formLabel.parentElement) returns
    // zero on IE.
    formLabel.style.width = 100;
    formLabel.style.width = su.elementWidth(formLabel.parentElement);
  }
};

/**
 * Updates the layout of the user interface, adjusting specific style
 * properties to help ensure proper display.
 */
mgr.updateListPanelLayout = function() {
  var listSubpanel;
  var pageWidth;
  var width;

  if (su.isValid(listSubpanel = $('list-sub-panel'))) {
    var listPanel = $('list-panel');
    var editField = $('edit-field');

    var popupHeight = su.elementHeight(listPanel);
    var fieldHeight = su.elementHeight(editField);

    var panel = mgr.editPanel;
    var scrollPanel = mgr.scrollPanel;

    var offset = su.elementY(scrollPanel);

    var scrollHeight = scrollPanel.scrollHeight;
    var offsetHeight = su.elementHeight(scrollPanel);

    var scrollTop = scrollPanel.scrollTop;
    var scrollBottom = scrollHeight - (scrollTop + offsetHeight);

    var panelTop = su.elementY(panel) - offset;
    var panelHeight = su.elementHeight(panel);

    var scrollAbove = scrollTop + panelTop;
    var scrollBelow = scrollBottom + (offsetHeight - panelTop -
        panelHeight) - 12;

    var viewAbove = panelTop - 24;
    var viewBelow = offsetHeight - (viewAbove + panelHeight) - (12 + 24);

    if (viewBelow > popupHeight) {
      // First choice is to align with top and have it feel like a
      // drop-down menu with everything in view. That requires that we have
      // room in the "viewBelow" size for the entire panel.
      listPanel.style.top = panelTop - fieldHeight + 12 - 4 + scrollTop;
    } else if (viewAbove > popupHeight) {
      // Second choice is if we have room above we can align with the bottom
      // and place to align with the bottom of the field.
      listPanel.style.top = panelTop - popupHeight + scrollTop + 12;
    } else {
      // Last option is that we try to position in the available space in
      // the window, but since we already know it won't fit cleanly above or
      // below we can just set the top to be just below the visible top.
      listPanel.style.top = scrollTop + 12;
    }

    // Avoid throwing off computations as we move between levels by pushing
    // the panel to the left so it doesn't trigger scrollbars etc too early.
    listPanel.style.left = 0;

    // If we're adjusting this panel's size we're showing an editor cell
    // over the attribute name cell. That implies that the current target is
    // the editor name cell. We want to be the size of that cell's value
    // counterpart so we fit into the table regardless of scrollbars, window
    // offsets, etc.

    var target = mgr.getFocusedElement();

    while ((target = target.nextSibling) &&
        (target.nodeType != Node.ELEMENT_NODE)) {
    }

    if (su.notValid(target)) {
      // Fallback is to work from page width.
      if (document.body.clientWidth) {
        pageWidth = document.body.clientWidth || 0;
      } else {
        pageWidth = window.innerWidth || 0;
      }

      width = Math.max(pageWidth - su.elementX(editField) -
          su.elementWidth(editField) - (su.IS_MAC ? 30 : 15), 0);
    } else {
      width = su.elementWidth(target);
    }

    listPanel.style.width = width;

    // Our left edge lines up with the editor, wherever it may be.
    listPanel.style.left = su.elementX(editField) +
        su.elementWidth(editField) + 1;
  }
};

// ---
// Editor Management
// ---

/**
 * Returns true if the manager is currently displaying the details panel and
 * hence is actively detailing a particular attribute.
 * @return {boolean} True if the manager details panel is currently open.
 */
mgr.isDetailing = function() {
  return su.isVisible('details-panel');
};

/**
 * Returns true if the manager is currently displaying the editor cell and
 * hence is actively editing a particular attribute label or value.
 * @return {boolean} True if the manager editing cell is currently open.
 */
mgr.isEditing = function() {
  // As long as we're below mgr.HIDDDEN_EDITOR_TOP this allows scrolling
  // quickly without causing editing state to be lost.
  return su.isVisible('edit-panel') && (su.elementY('edit-panel') >
      (mgr.HIDDEN_EDITOR_TOP + 1000));
};

/**
 * Combined setter/getter for the isFloating state, which is true when the
 * edit panel has "torn off" and is floating over the attribute tree surface
 * to keep the edit field in view during scrolling operations.
 * @param {boolean} opt_flag True to set floating state to true.
 * @return {boolean} True if the manager editing cell is floating.
 */
mgr.isFloating = function(opt_flag) {
  if (su.isValid(opt_flag)) {
    mgr._floating = opt_flag;
  }

  return mgr._floating;
};

/**
 * Returns true if the manager is currently displaying a highlight rectangle.
 * @return {boolean} True if the manager highlight rectangle is visible.
 */
mgr.isHighlighting = function() {
  return su.isVisible('highlight-line-top');
};

// ---
// Event Handling
// ---

/**
 * Responds to requests to cancel any pending edits to an entity.
 * @param {Object} entity The entity object to cancel edits for.
 */
mgr.doCancel = function(entity) {
  var obj = su.notValid(entity) ? mgr.rootEntity : entity;
  mgr.callRuby('do_close', {'id': obj.id});
};

/**
 * Responds to clicks in the background of the manager panel, ensuring that
 * any pending edits commit when the user clicks away.
 * @param {Event} evt The native click event.
 */
mgr.doPending = function(evt) {

  if (!mgr.isEditing()) {
    return;
  }

  // Check for DIV so we allow TD and editor cells to be clicked without
  // triggering handleEdit (which would be bad).
  var ev = evt || window.event;
  var target = ev.target || ev.srcElement;
  if (!target || target.tagName.toUpperCase() != 'DIV') {
    return;
  }
  if (target.getAttribute('class') == 'add-attribute-link') {
    return;
  }

  mgr.tree.handleEdit();
};

/**
 * Respond to requests to delete an attribute from an entity. The user
 * interface is redrawn after this request completes.
 * @param {Object} entity The entity object to modify.
 * @param {String} attribute The name of the attribute to remove.
 */
mgr.doDeleteAttribute = function(entity, attribute) {

  mgr.hideHighlight();

  if (mgr.tree.attNameToDetail == attribute) {
    mgr.tree.idToDetail = null;
    mgr.tree.attNameToDetail = null;
    mgr.tree.lastAttributeSelected = null;
    mgr.lastElementSelected = null;
  }

  mgr.callRuby('do_delete_attribute', {
    'id': entity.id,
    'dictionary': comp.DICTIONARY,
    'oncomplete': 'mgr.redraw',
    'name': attribute
  });
};

/**
 * Responds to requests to refresh the UI of the manager panel. Commonly
 * invoked from the Refresh button in manager.html.
 */
mgr.doRefresh = function() {

  // Before we refresh, store the current scroll position in a cookie
  // so we can keep the same scroll position.
  su.storeToCookie('panelScrollTop', $('content').scrollTop);

  // Press the refresh button.
  $('refresh-button').className = 'refresh-button-on';

  // Hide the details panel.
  if (su.isValid(mgr.tree)) {
    mgr.tree.hideDetailPanel();
  }

  // Since this will redraw our panel, we need to store the refocus rule.
  if (su.isValid(mgr.getFocusedElement())) {
    mgr.refocusIndex = mgr.FOCUS_CURRENT;
    mgr.refocusTarget = mgr.getFocusedElement().getAttribute('id');
  }

  if (mgr.isEditing()) {
    // If edits are in progress we'll let the handleEdit routine deal with
    // them and then redraw as needed.
    if (!mgr.tree.handleEdit($('edit-field'))) {
      mgr.isCalling(true);
      mgr.showCurtain();
      mgr.redraw();
    }
  } else {
    mgr.isCalling(true);
    mgr.showCurtain();
    mgr.redraw();
  }
};

// ---
// Focus Management
// ---

/**
 * Returns the element which the editor is currently, or was most recently,
 * asked to edit.
 * @return {Element} The element whose content was last used for
 *     editing.
 */
mgr.getEditorTarget = function() {
  return mgr.editorTarget;
};

/**
 * Sets the element which the editor is currently, or was most recently,
 * asked to edit.
 * @param {Element} target The element whose content was last used for
 *     editing.
 */
mgr.setEditorTarget = function(target) {
  mgr.editorTarget = target;
};

/**
 * Returns the currently focused element.
 * @return {Element?} The currently focused element.
 */
mgr.getFocusedElement = function() {
  return mgr.lastElementSelected;
};

/**
 * Sets the currently focused element.
 * @param {Element?} element The currently focused element.
 */
mgr.setFocusedElement = function(element) {
  mgr.lastElementSelected = element;
};

/**
 * Moves the focus and/or highlight to the next focusable element in document
 * order. If editing is currently active it will be moved to the new element,
 * otherwise only the highlight effect will be moved.
 * @param {string|Element} opt_elementOrID The element or element ID to find.
 *     Default is the current actively focused element.
 * @param {boolean} opt_forceEdit True to force edit field display.
 * @return {Element?} The newly focused element.
 */
mgr.focusNext = function(opt_elementOrID, opt_forceEdit) {
  return mgr.moveFocus(opt_elementOrID, mgr.FOCUS_NEXT, opt_forceEdit);
};

/**
 * Moves the focus to the previous focusable element in document order.
 * If editing is currently active it will be moved to the new element,
 * otherwise only the highlight effect will be moved.
 * @param {string|Element} opt_elementOrID The element or element ID to find.
 *     Default is the current actively focused element.
 * @param {boolean} opt_forceEdit True to force edit field display.
 * @return {Element?} The newly focused element.
 */
mgr.focusPrevious = function(opt_elementOrID, opt_forceEdit) {
  return mgr.moveFocus(opt_elementOrID, mgr.FOCUS_PREVIOUS, opt_forceEdit);
};

/**
 * Moves the focus from an element in either a forward or backward direction
 * in terms of document order. If editing is currently active it will be moved
 * to the new element, otherwise only the highlight effect will be moved.
 * @param {string|Element} opt_elementOrID The element or element ID to find.
 *     Default is the current actively focused element.
 * @param {number} opt_direction Either mgr.FOCUS_NEXT or mgr.FOCUS_PREVIOUS.
 * @param {boolean} opt_forceEdit True to force edit field display.
 * @return {Element?} The newly focused element.
 */
mgr.moveFocus = function(opt_elementOrID, opt_direction, opt_forceEdit) {
  var el;

  if (su.isValid(opt_elementOrID)) {
    el = $(opt_elementOrID);
  } else {
    el = mgr.getFocusedElement();
  }

  var direction = su.isValid(opt_direction) ? opt_direction : mgr.FOCUS_NEXT;
  if (su.isValid(el)) {

    var name = el.getAttribute('name');
    if (su.notEmpty(name)) {
      var match = name.match(/(.*)_(.*)/);
      if (su.isValid(match)) {

        var nextID = 'field_' + (parseInt(match[2], null) + direction);
        // Note that we pass the parent.parent here to create a context node
        // for the search that's high enough to find the peer we need. If we
        // can't go up that far we stop at the parent.
        var ancestor = el.parentNode;
        if (su.isValid(ancestor)) {
          ancestor = ancestor.parentNode;
          if (su.notValid(ancestor)) {
            ancestor = el.parentNode;
          }
          var nextElement = $(nextID, ancestor);
          if (su.isValid(nextElement)) {
            var focusEl = mgr.setFocus(nextElement, opt_forceEdit);
            // Refresh value of the field we left to force redraw after the
            // edit panel has moved on and 'uncovered' the old field.
            el.innerHTML = el.innerHTML;
          }
        }
      }
    }
  }

  return focusEl;
};

/**
 * Reestablishes focus, typically after the AttributeTree instance has been
 * replaced with a new instance in response to a call to Ruby.
 */
mgr.refocus = function() {

  // Reset our last selection state.
  mgr.resetLastSelection();

  if (su.isEmpty(mgr.refocusIndex) || su.isEmpty(mgr.refocusTarget)) {
    return;
  }

  switch (mgr.refocusIndex) {
    case mgr.FOCUS_NEXT:
      mgr.focusNext(mgr.refocusTarget, mgr.refocusEditor);
      break;
    case mgr.FOCUS_PREVIOUS:
      mgr.focusPrevious(mgr.refocusTarget, mgr.refocusEditor);
      break;
    default:
      mgr.setFocus(mgr.refocusTarget, mgr.refocusEditor);
      break;
  }

  // Be sure to clear so we don't get out of sync with future operations.
  mgr.refocusTarget = null;
  mgr.refocusIndex = null;
  mgr.refocusEditor = null;
};

/**
 * Sets the focus/highlight to the element or element ID provided.
 * @param {string|Element} elementOrID The element or element ID to focus.
 *     Default is the current actively focused element.
 * @param {boolean} opt_forceEdit True to force edit field display.
 * @return {Element?} The newly focused element.
 */
mgr.setFocus = function(elementOrID, opt_forceEdit) {
  var el = $(elementOrID);
  if (su.notValid(el)) {
    // Element not found.
    return;
  }

  // Compute entity and attribute names from the element's ID, then
  // get the entity so we can properly query for the old value.
  var id = el.getAttribute('id');
  if (su.isEmpty(id)) {
    // Element has no ID data to compute entity/attribute from.
    return;
  }

  var parts = mgr.parseIdIntoParts(id);
  if (parts.length < 3) {
    // Element ID isn't in a prefix_entity_attribute format.
    return;
  }

  var entity = su.findEntity(parts[1], mgr.rootEntity);
  if (su.notValid(entity)) {
    // Specified entity isn't in our current data set.
    return;
  }

  // Update the properties which drive navigation and value
  // operations.
  mgr.tree.lastEntitySelected = entity;
  mgr.tree.lastAttributeSelected = comp.getAttribute(entity, parts[2]);
  mgr.setFocusedElement(el);

  // If we're in edit mode, then stay in edit mode, unless the next attribute
  // to edit is scaletool, in which case we only highlight. Scaletool can't
  // be edited directly with a text box.
  if ((opt_forceEdit || mgr.isEditing()) && parts[2] != 'scaletool') {
    mgr.tree.editAttributeValue(mgr.getFocusedElement());
  } else {
    mgr.tree.hideEditPanels();
  }
  mgr.tree.highlight(el, parts[1], parts[2]);

  return el;
};

// ---
// Selection Management
// ---

/**
 * Instructs the dialog to "select" an entity based on its ID. This function
 * both alters the local UI and pushes the selection down to SketchUp.
 * @param {string} id The id number of the entity to select. If null, then
 *     SketchUp will be instructed to clear out its selection.
 */
mgr.pushSelection = function(id) {
  var lastID;
  var el;

  // First clear any existing selection style.
  if (su.isValid(lastID = mgr.lastSelectionID)) {
    el = $('attribute-head-' + lastID);
    if (su.isValid(el)) {
      el.style.backgroundColor = '';
    }
  }

  // Then apply.
  if (su.isValid(id)) {
    el = $('attribute-head-' + id);
    mgr.lastSelectionID = id;
  }

  // Push the selection down to SketchUp.
  comp.pushSelection(id);
};

/**
 * Instructs the dialog to toggle the selection of an entity based on its ID.
 * @param {string} id The id number of the entity to toggle.
 */
mgr.toggleSelection = function(id) {
  if (id == mgr.lastSelectionID) {
    mgr.clearSelection();
  } else {
    mgr.pushSelection(id);
  }
};

/**
 * Clears any existing selection. Note that this function is called directly
 * by SketchUp, so it should not be renamed.
 */
mgr.clearSelection = function() {
  if (su.isValid(mgr.lastSelectionID)) {
    mgr.pushSelection(null);
  }
  mgr.lastSelectionID = null;
};

/**
 * Called on refresh of the dialog. This function restores any previous
 * selection.
 */
mgr.resetLastSelection = function() {
  mgr.pushSelection(mgr.lastSelectionID);
};

/**
 * Hides the highlight elements.
 */
mgr.hideHighlight = function() {

  mgr.setStatusBar(mgr.INTRO_STATUS);

  su.hide('highlight-line-top');
  su.hide('highlight-line-right');
  su.hide('highlight-line-bottom');
  su.hide('highlight-line-left');

  // Clear any previous label selection.
  if (su.isValid(mgr.tree.lastLabelCell)) {
    var cell = mgr.tree.lastLabelCell;
    var lastClass = cell.className;
    cell.className = lastClass.replace(/label-selected/, 'label');
  }

  // Hide details controls.
  if (su.isValid(mgr.tree)) {
    mgr.tree.hideDetailControls();
  }
};

// ---
// Value Cell
// ---

/**
 * Resets the value cell of the last edited attribute. This is called when
 * the user hits the ESC key when editing, or tabs away when they haven't
 * made any changes.
 * @param {string} opt_entityName The name of the entity providing values.
 *     Default is the last entity selected.
 * @return {boolean} True if the value was successfully reset.
 */
mgr.resetValueCell = function(opt_entityName) {

  // Assume that we have no error prefix on our attribute value.
  var errorPrefix = '';

  var unitGroup = '';
  var attribute = mgr.tree.lastAttributeSelected;

  if (su.isValid(attribute)) {
    var entity = mgr.tree.lastEntitySelected;
    var entityID = mgr.tree.lastEntitySelected.id;
    var name = mgr.tree.lastAttributeSelected.label;

    if (su.isValid(name)) {
      name = name.toLowerCase();

      var cell = $('value_' + entityID + '_' + name);
      if (su.isValid(cell)) {

        if (su.isValid(comp.RESERVED[name])) {
          unitGroup = comp.RESERVED[name].unitGroup;
        }

        var value = mgr.formatDisplayValue(entity, name);

        var error = attribute.error;
        if (su.isValid(error)) {
          if (error.indexOf('subformula-error') > -1) {
            value = '=' + error;
            errorPrefix = mgr.ERROR_PREFIX;
          }
        }

        // Reset any size that was set in updateEditorLayout.
        cell.style.height = 'auto';

        if (mgr.showFormulas == true && su.isDefined(attribute.formula)) {
          cell.innerHTML = errorPrefix + '=' +
              mgr.insertSoftBreaks(attribute.formula);
        } else {
          cell.innerHTML = errorPrefix + value + '&nbsp;';
        }
      }
    }
  }
  return true;
};

/**
 * Clears the HTML value cell for a given entity and attribute. This makes
 * refreshing the display a little cleaner looking when called before waiting
 * for a jsCallback to update the whole page.
 * @param {Object} entity The entity object we're operating on.
 * @param {string} attribute The attribute name defining which value cell.
 * @param {string} value The new value for the entity/attribute cell.
 */
mgr.setValueCell = function(entity, attribute, value) {
  su.setContent('value_' + entity.id + '_' + attribute, value);
};

// ---
// Utilities
// ---

/**
 * Resets the scale tool graphic.
 * @return {number} The computed scale tool size.
 */
mgr.calculateScaleTool = function() {
  var result = 0;
  var mask = 1;

  for (var i = 1; i <= 7; i++) {
    if (!$('scaletool_' + i).checked) {
      result += mask;
    }
    mask *= 2;
  }

  $('scale-tool-cell').innerHTML = mgr.dumpScaleToolGraphic(result);
  return result;
};

/**
 * Outputs HTML to display the scale tool graphic in the details panel.
 * @param {number} value The scale tool cell size to compute from.
 * @return {string} HTML containing a generated scale tool graphic.
 */
mgr.dumpScaleToolGraphic = function(value) {
  var arr = [];
  arr.push('<br/><div class="scaletool-graphic">');

  for (var i = 1; i <= 7; i++) {
    var html = '<div class="scaletool-graphic" style="background-position: -';
    html += i * 100;
    html += 'px 0px">';
    arr.push(mgr.ifBitIsZero(value, i, html));
  }

  for (i = 1; i <= 7; i++) {
    arr.push(mgr.ifBitIsZero(value, i, '</div>'));
  }

  arr.push('</div>');
  return arr.join('');
};

/**
 * Returns a properly formatted string for a given attribute and its
 * unitGroup.
 * @param {Object} entity The entity object providing the data.
 * @param {string} attribute The attribute name to query for.
 * @return {string} HTML containing a formatted display value.
 */
mgr.formatDisplayValue = function(entity, attribute) {
  var displayValue;

  // The scaletool doesn't make sense to format via the
  // comp.getAttributeFormattedValue method so work around that here.
  if (attribute == 'scaletool') {
    var attr = comp.getAttribute(entity, attribute);
    if (attr.value == '' || attr.value == 0) {
      displayValue = '<span class="live-value-result">' +
          su.translateString('All scale handles visible.') + '</span>';
    } else if (attr.value == mgr.ALL_SCALE_HANDLES_HIDDEN) {
      displayValue = '<span class="live-value-result">' +
          su.translateString('All scale handles hidden.') + '</span>';
    } else {
      displayValue = '<span class="live-value-result">' +
          su.translateString('Some scale handles hidden.') + '</span>';
    }
    return displayValue;
  }

  displayValue = comp.getAttributeFormattedValue(entity, attribute);
  displayValue = displayValue.replace(/\</g, '&lt;');
  displayValue = displayValue.replace(/\>/g, '&gt;');
  displayValue = displayValue.replace(/\&\#92;/g, '\\');
  displayValue = displayValue.replace(/\//g,
      '/<span class="zero-width"> </span>');

  displayValue = mgr.insertSoftBreaks(displayValue);
  return displayValue;
};

/**
 * Checks an integer to see if a given bit position is 0. If so, returns a
 * given string.
 * @param {string} value The integer's string representation.
 * @param {number} bitPos The bit position to check.
 * @param {string} result The string to return on success.
 * @return {Object} The result value when the test is successful, or ''.
 */
mgr.ifBitIsZero = function(value, bitPos, result) {
  var mask = 1;
  var maskBits = 1;
  var intValue = parseInt(value, null);

  for (var i = 1; i < bitPos; i++) {
    mask = mask + maskBits;
    maskBits = maskBits << 1;
  }

  if ((intValue & mask) == mask) {
    return '';
  } else {
    return result;
  }
};

/**
 * Inserts the currently selected function into the edit field.
 * @return {boolean} Typically returns false to avoid event handler issues.
 */
mgr.insertFunction = function() {

  // Do not allow inserting functions into names.
  if (mgr.tree.isEditingName == true) {
    return false;
  }

  var field = $('edit-field');

  if (mgr.isEditing() && !mgr.isDetailing()) {
    field.focus();
    mgr.storeSelectionTextRange();

    if (!su.IS_MAC) {
      if (mgr.selectionTextRange.parentElement() != field) {
        return;
      }
    }

    var selectObj = $('function-list');
    var optionObj = selectObj.options[selectObj.selectedIndex];
    var insertText = optionObj.text;
    insertText = insertText.substr(1);
    insertText = insertText.replace(/\s\(/gi, '(');

    su.replaceSelection(field, insertText, mgr.selectionTextRange);

    mgr.updateEditorLayout();
    field.focus();
  } else if (mgr.isDetailing()) {
    field = document.activeElement;
    if (field != $('edit-field')) {
      su.replaceSelection(field, insertText, mgr.selectionTextRange);
      field.focus();
    }
  }
};

/**
 * Inserts characters into a string value to force the browser to break long
 * words for easier display.
 * @param {string} displayValue The string value to break.
 * @return {string} The newly formed string with spaces injected.
 */
mgr.insertSoftBreaks = function(displayValue) {

  // Force-convert our value to a string for display purposes. Note that the
  // '' value should come first so we're effectively messaging a string and
  // asking it to add a value (which will be converted into a string).
  var result = '' + displayValue;

  // Insert zero-width breaks after punctuation marks.
  result = result.replace(
      /([\:\!\@\#\$\%\^\;\*\(\(\+\{\[\}\]\|\,\.\?])(?=\w)/g,
      '$1<span class="zero-width"> </span>');

  // Insert the zero-width character before semicolons, so we don't cause
  // parsing problems with &nbsp; or &quot;
  result = result.replace(/([\&\<])/g, '<span class="zero-width"> </span>$1');

  // Break really long strings of work characters into 10-char chunks.
  result = result.replace(/(\w{10})(\w)/g,
      '$1<span class="zero-width"> </span>$2');

  return result;
};

/**
 * Prompts for a new entity name and saves it, redrawing the user interface
 * upon completion.
 * @param {string} entityID The ID of the entity being renamed.
 * @param {string} currentName The current entity name.
 */
mgr.renameEntity = function(entityID, currentName) {
  var entity = su.findEntity(entityID, mgr.rootEntity);
  var message = 'Please enter a new object name:'

  var response = prompt(su.translateString(message), currentName);

  // Exit if the user clicked the cancel button.
  if (response == null) {
    return;
  }

  // Clean off any leading or trailing white space.
  response = response.replace(/^\s+/gi, '');
  response = response.replace(/\s+$/gi, '');

  if (response.toLowerCase() == 'model') {
    alert(su.translateString('You are not allowed to use the name "model".' +
      ' Please try a different name.'));
    mgr.renameEntity(entityID, currentName);
  } else if (response.toLowerCase() == 'parent') {
    alert(su.translateString('You are not allowed to use the name "parent".' +
      ' Please try a different name.'));
    mgr.renameEntity(entityID, currentName);
  } else if (su.isEmpty(response)) {
    alert(su.translateString('You are not allowed to use a blank name.'));
    mgr.renameEntity(entityID, currentName);
  } else if (response.match(/^[\d\.]+$/)) {
    alert(su.translateString('You are not allowed to create names ' +
      'that are numbers.'));
    mgr.renameEntity(entityID, response);
  } else if (response.match(/[\+\-\*\/\(\)\<\>\=\^\"]/) !== null) {
    alert(su.translateString('You are not allowed to create names ' +
      'containing mathematical symbols.'));
    mgr.renameEntity(entityID, response);
  } else if (response.length > mgr.MAX_NAME_LENGTH) {
    alert(su.translateString('You are not allowed to use extremely long ' +
      'names. Please try a shorter name.'));
    mgr.renameEntity(entityID, response);
  } else if (response != currentName) {
    comp.setAttributeValue(entity, '_name', response);
    comp.pushAttribute(entity, '_name', 'mgr.redraw');
  }
};

/**
 * Sets the value(s) in the status bar for the manager panel.
 * @param {string} str The overall status string for the status bar.
 * @param {string} opt_iconName The name of an optional icon to display.
 */
mgr.setStatusBar = function(str, opt_iconName) {
  su.setContent('mgr-status', str);

  if (su.isValid(comp.RESERVED[opt_iconName])) {
    $('mgr-icon').className = 'mgr-icon-' + opt_iconName +
        ' mgr-icon-' + comp.RESERVED[opt_iconName].group.replace(/\s/gi, '');
  } else {
    $('mgr-icon').className = 'mgr-icon-' + su.ifEmpty(opt_iconName, '');
  }
};

/**
 * Promotes the tab named by tabName to be the active tab.
 * @param {string} tabName The name of the tab (div) to activate.
 */
mgr.setTab = function(tabName) {

  // Reset the tab classes.
  $('tab-basic').className = 'tab';
  $('tab-cap-basic').className = 'tab-cap';
  $('tab-functions').className = 'tab';
  $('tab-cap-functions').className = 'tab-cap';

  // Show the appropriate panel.
  su.hide('functions-panel');

  su.show(tabName + '-panel');

  if (su.isValid($('tab-' + tabName))) {
    $('tab-' + tabName).className = 'tab-selected';
    $('tab-cap-' + tabName).className = 'tab-cap-selected';
  }

  if (mgr.isEditing()) {
    $('edit-field').focus();
  }

  su.storeToCookie('activeTab', tabName);
};

/**
 * Displays a function summary string based on the function pulldown value.
 * @param {Element} selectObj The HTML 'select' element containing the
 *     function list.
 */
mgr.showFunctionSummary = function(selectObj) {
  var optionObj = selectObj.options[selectObj.selectedIndex];

  if (optionObj.className.indexOf('head') > -1 ||
      selectObj.selectedIndex == 0 || su.isEmpty(selectObj.value)) {
    $('function-summary').innerHTML = '';
    $('insert-button').disabled = true;
  } else {
    $('function-summary').innerHTML = selectObj.value;
    $('insert-button').disabled = false;
  }

  if (mgr.isEditing()) {
    $('edit-field').focus();
  }
};

/**
 * Stores the current text selection of the user so it can be replaced when a
 * partial selection was made.
 */
mgr.storeSelectionTextRange = function() {
  var selection;
  mgr.selectionTextRange = null;
  if (!su.IS_MAC) {
    if (su.isValid(selection = document.selection)) {
      mgr.selectionTextRange = selection.createRange();
    }
  }
};

/**
 * Updates the highlight divs to match the last highlighted cell.
 * @param {boolean} opt_show Should the update also display the highlight
 *     elements. By default the value is false.
 */
mgr.updateHighlightLayout = function(opt_show)  {

  if (su.notValid(mgr.tree) || su.notValid(mgr.tree.lastLabelCell)) {
    return;
  }

  // Given the lastLabelCell, we want to find the value cell, which will be the
  // second TD inside the TR which holds both the label and value.
  var ancestor = mgr.tree.lastLabelCell.parentNode;
  if (su.notValid(ancestor)) {
    return;
  }
  var cell = ancestor.getElementsByTagName('TD')[1];
  var offset = mgr.HIGHLIGHT_EDIT_OFFSET - mgr.scrollPanel.scrollTop;

  var elem = $('highlight-line-top');
  elem.style.top = su.elementY(cell) - offset;
  elem.style.left = su.elementX(cell);
  elem.style.width = su.elementWidth(cell);
  elem.style.height = 2;
  if (opt_show == true) {
    su.show(elem);
  }

  elem = $('highlight-line-bottom');
  elem.style.top = su.elementY(cell) + su.elementHeight(cell) - 2 - offset;
  elem.style.left = su.elementX(cell);
  elem.style.width = su.elementWidth(cell);
  elem.style.height = 2;
  if (opt_show == true) {
    su.show(elem);
  }


  elem = $('highlight-line-left');
  elem.style.top = su.elementY(cell) - offset;
  elem.style.left = su.elementX(cell);
  elem.style.width = 2;
  elem.style.height = su.elementHeight(cell);
  if (opt_show == true) {
    su.show(elem);
  }

  elem = $('highlight-line-right');
  elem.style.top = su.elementY(cell) - offset;
  elem.style.left = su.elementX(cell) + su.elementWidth(cell) - 2;
  elem.style.width = 2;
  elem.style.height = su.elementHeight(cell);
  if (opt_show == true) {
    su.show(elem);
  }
};

/**
 * Updates the layout of the panel. Note that this is only actively used by IE
 * as Safari's CSS engine can manage the interface automatically.
 */
mgr.updateLayout = function() {
  var elem;

  if (su.IS_MAC) {
    return;
  }

  elem = $('inspector-panel');
  if (su.isValid(elem)) {
    try {
      elem.style.height = elem.offsetParent.offsetHeight - 28 + 'px';
    } catch (e) {
      // Ignore when new value(s) aren't viable.
    }
  }

  elem = $('scroll-panel');
  if (su.isValid(elem)) {
    try {
      elem.style.height = elem.offsetParent.offsetHeight - 71 + 'px';
    } catch (e) {
      // Ignore when new value(s) aren't viable.
    }
  }

  elem = $('details-panel');
  if (su.isValid(elem)) {
    try {
      elem.style.width = elem.offsetParent.offsetWidth + 'px';
      elem.style.height = elem.offsetParent.offsetHeight + 'px';
    } catch (e) {
      // Ignore when new value(s) aren't viable.
    }
  }

  elem = $('details-sub-panel');
  if (su.isValid(elem)) {
    try {
      elem.style.width = elem.offsetParent.offsetWidth - 6 + 'px';
      elem.style.height = elem.offsetParent.offsetHeight - 80 + 'px';
    } catch (e) {
      // Ignore when new value(s) aren't viable.
    }
  }
};

/**
 * Updates the field editor to be the same size and location as the field it
 * is editing. The editor itself is adjusted first to adapt to new input (or
 * initial input if the cell is being shown for the first time). The
 * underlying field is then adjusted to match the height of the editor cell.
 */
mgr.updateEditorLayout = function() {

  var target = mgr.getFocusedElement();

  // If the target is invalid then exit. Note that on IE there are cases
  // where updateEditorLayout can be called when we are not in edit mode. So
  // if we reach this point and we are not editing we can exit.
  if (!su.isValid(target) || !mgr.isEditing()) {
    return;
  }

  var box = su.elementGetBorderBox(target);
  var boxtop = box.top;

  if (target.tagName == 'TD') {
    boxtop = su.elementGetBorderBox(target.parentNode).top;
  }

  mgr.editPanel.style.top = (boxtop - mgr.HIGHLIGHT_EDIT_OFFSET +
    mgr.scrollPanel.scrollTop) + 'px';

  // Match widths first so content height is computed off wrapped content.
  mgr.editPanel.style.width = box.width + 'px';
  $('edit-field').style.width = box.width + 'px';

  if (mgr.isFloating()) {
    return;
  }

  var field = $('edit-field');
  var fieldHeight = field.scrollHeight;

  if (fieldHeight > box.height) {
    // Minimize the height of the field to get an accurate scrollHeight.
    field.style.height = '0px';
    fieldHeight = field.scrollHeight;

    // On the Mac the scrollHeight is reported without padding so account
    // for extra padding here.
    if (su.IS_MAC) {
      fieldHeight += 5;
      // If there is no content inside the field, its scrollHeight is reported
      // as 0 on the Mac, so account for that here.
      fieldHeight = Math.max(20, fieldHeight);
    }
    var contentHeight = Math.max(20, fieldHeight);

    // If there is more than a line of content and we're on the Mac, add a
    // pixel to fix a problem with the content resizing slightly when focused.
    if (su.IS_MAC && fieldHeight > 20) {
      contentHeight += 1;
    }

    mgr.editPanel.style.height = contentHeight + 'px';
    field.style.height = contentHeight + 'px';
    target.style.height = contentHeight + 'px';
    field.scrollTop = 0;

    // If the editor is visible, then set the underlying cell's HTML to be an
    // empty space, so the cell does not appear larger than the overlying
    // editor when one deletes several lines of text. The exception to this
    // is if we're entering a new attribute name.
    if (mgr.isEditing() && target.innerHTML.indexOf(
        su.translateString(mgr.ADD_ATTRIBUTE)) == -1) {
      su.setContent(target, '&nbsp;');
    }
  } else {
    var contentHeight = Math.max(15, box.height);
    mgr.editPanel.style.height = contentHeight + 'px';
    field.style.height = contentHeight + 'px';
    field.scrollTop = 0;
  }
  mgr.updateHighlightLayout();
};

/**
 * Calls updateEditorLayout inside a timeout to ensure that all rendering has
 * occurred before the field height is calculated. The onpaste operation is an
 * example of a routine which requires this approach.
 */
mgr.updateEditorLayoutTimeout = function() {
  window.setTimeout(function() {
    mgr.updateEditorLayout();
    mgr.floatEditorIfNecessary();
  }, 0);
};

/**
 * Takes an id of an HTML entity and returns a 3-element array of the entity
 * info that is encoded into that id. Id is expected to be in the form
 * TYPE_NUMBER_ATTNAME, such as value_4535_description.
 * @param {string} id String id to split apart.
 * @return {Array.<string>} An array of ID "parts".
 */
mgr.parseIdIntoParts = function(id) {
  var returnArray = [];
  var allParts = id.split('_');

  // Shift and store the "name" or "value" and the attribute number from the
  // front end of our split up string.
  returnArray.push(allParts.shift());
  returnArray.push(allParts.shift());

  // Join any remaining parts in the middle with an underscore, since
  // it's possible that we had attribute names with an underscore, such
  // as "value_12345_my_att_with_underscores".
  returnArray.push(allParts.join('_'));
  return returnArray;
};

/**
 * Adjusts the position of the 'floating editor', consisting of the edit
 * cell and a label.
 * @param {Boolean} opt_atTop True to pin the editor at the top of the
 * viewport.
 */
mgr.updateFloatingEditorLayout = function(opt_atTop) {

  var isTop;

  if (!mgr.isFloating()) {
    return;
  }

  var scrollTop = mgr.scrollPanel.scrollTop;

  if (typeof(opt_atTop) == 'boolean') {
    mgr.editPanel.floatOnTop = opt_atTop;
    isTop = opt_atTop;
  } else {
    isTop = mgr.editPanel.floatOnTop;
  }

  var offsetHeight = su.elementHeight(mgr.scrollPanel);
  var panelHeight = su.elementHeight(mgr.editPanel);

  var targetWidth = su.elementWidth(mgr.getEditorTarget());
  var targetHeight = su.elementHeight(mgr.getEditorTarget());

  var halfFieldOffset = mgr.FIELD_OFFSET / 2;

  // Adjust sizing as needed during resizing and floating of the editor.
  if (offsetHeight < (targetHeight + halfFieldOffset)) {
    mgr.editPanel.style.top = scrollTop - halfFieldOffset + 'px';
    mgr.editPanel.style.height = offsetHeight + 'px';
    $('edit-field').style.height = offsetHeight - mgr.FIELD_OFFSET + 'px';
  } else {
    // If we're scrolling toward the top when we tear off the editor then the
    // top of the reference tab will remain in that location (pinned to the
    // top), otherwise we'll be pinned to the bottom while we scroll.
    if (isTop) {
      // Pin the reference tab to the top edge.
      mgr.editPanel.style.top = scrollTop - halfFieldOffset + 'px';
    } else {
      mgr.editPanel.style.top = scrollTop - mgr.FIELD_OFFSET +
          (offsetHeight -
              (panelHeight - mgr.EDIT_FIELD_REFERENCE_TAB_HEIGHT)) -
          mgr.BORDER_OFFSET + 'px';
    }

    mgr.editPanel.style.height = (targetHeight + mgr.FIELD_OFFSET) + 'px';
    $('edit-field').style.height = (targetHeight) + 'px';
  }

  mgr.editPanel.style.width = (targetWidth) + 'px';
  $('edit-field').style.width = (targetWidth) + 'px';

  su.show('edit-field-reference-tab');
};

/**
 * Enable display of a 'floating tab' showing what field was being edited
 * when the user scrolls that field out of view.
 */
mgr.floatEditorIfNecessary = function() {

  if (mgr.isEditing()) {
    if (mgr.tree.isEditingName != true) {

      // If the scroll would cause the editor to be clipped then we need
      // to pop it out and let it follow the scroll activity. The issue
      // here is "viewport" visibility, which is bounded by the offset
      // height of the scroll panel.
      var field = mgr.getFocusedElement();

      var panel = mgr.editPanel;
      var scrollPanel = mgr.scrollPanel;

      var offset = su.elementY(scrollPanel);

      var scrollHeight = scrollPanel.scrollHeight;
      var offsetHeight = su.elementHeight(scrollPanel);

      var scrollTop = scrollPanel.scrollTop;
      var scrollBottom = scrollHeight - (scrollTop + offsetHeight);

      var fieldTop = su.elementY(field) - offset;

      var panelTop = su.elementY(panel) - offset;
      var panelHeight = su.elementHeight(panel);

      var scrollAbove = scrollTop + panelTop;
      var scrollBelow = scrollBottom + (offsetHeight - panelTop -
          panelHeight) - (mgr.FIELD_OFFSET / 2);

      var viewAbove = fieldTop - mgr.FIELD_OFFSET;
      var viewBelow = offsetHeight - (viewAbove + panelHeight) -
          mgr.FIELD_OFFSET - mgr.BORDER_OFFSET;

      // Don't pop the panel until it would clip at the top.
      if ((viewAbove > 0) && (viewBelow > 0)){
        if (mgr.isFloating()) {
          mgr.unfloatEditor();
        }
        return;
      }

      if (!mgr.isFloating()) {
        mgr.floatEditor(viewAbove <= 0);
      } else {
        mgr.updateFloatingEditorLayout(viewAbove <= 0);
      }
    }
  }
};

/**
 * Construct the 'floating tab' showing what field was being edited when
 * the user scrolls that field out of view.
 * @param {Boolean} atTop True to pin the editor at the top of the viewport.
 */
mgr.floatEditor = function(atTop) {

  mgr.updateFloatingEditorLayout(atTop);
  mgr.isFloating(true);

  // Make the edit field's overflow-y 'auto', so that it can accomodate large
  // values when floating.
  $('edit-field').style.overflowY = 'auto';
};

/**
 * Deconstruct the 'floating tab' showing what field was being edited when
 * the user scrolls that field out of view.
 */
mgr.unfloatEditor = function() {

  // Reattach to the edited field.
  su.hide('edit-field-reference-tab');
  mgr.isFloating(false);

  // Make the edit field's overflow-y 'hidden', so that the scroll bar
  // doesn't jump when editing in an inline fashion.
  $('edit-field').style.overflowY = 'hidden';

  mgr.updateEditorLayoutTimeout();
};

/**
 * Loops a component or group's units through the valid list.
 * @param {string} id The id number of the entity to toggle units on.
 */
mgr.toggleLengthUnits = function(id) {
  var entity = su.findEntity(id, mgr.rootEntity);
  var lengthUnits = comp.lengthUnits(entity);
  var attribute;

  // If there are any user-created length attributes attached to this entity,
  // then show a warning about changing your units.
  var dict = comp.getAttributes(entity);
  if (su.isValid(dict)) {

    // Loop across all of our attributes to determine if any of them are
    // in "default" length units. When we shift from default to a fixed value
    // we want to query only when the default isn't already that unit.
    var keys = su.getKeys(dict);
    var hasDefaultLengthAtts = false;
    for (var i = 0; i < keys.length; i++) {
      attribute = keys[i];
      if (su.isValid(comp.RESERVED[attribute])) {
        if (comp.RESERVED[attribute].unitGroup == 'LENGTH' &&
            su.notValid(comp.getAttributeFormulaUnits(entity, attribute))) {
          hasDefaultLengthAtts = true;
        }
      }
    }

    // If we found some default length attributes, then show our warning.
    if (hasDefaultLengthAtts == true) {
      if (mgr.confirmUnitsChange() == false) {
        su.stopPropagation();
        return;
      }
    }
  }

  var newUnits;
  if (lengthUnits == 'INCHES') {
    newUnits = 'CENTIMETERS';
  } else {
    newUnits = 'INCHES';
  }
  $('units-button').className = 'units-button-' + newUnits.toLowerCase();
  comp.setAttributeValue(entity, '_lengthunits', newUnits);

  // Since this will redraw our panel, we need to store the refocus rule.
  if (mgr.getFocusedElement()) {
    mgr.refocusIndex = mgr.FOCUS_CURRENT;
    mgr.refocusTarget = mgr.getFocusedElement().getAttribute('id');
  }

  comp.pushAttribute(entity, '_lengthunits', 'mgr.redraw');
  su.stopPropagation();
};

/**
 * Shows a confirm message to the user asking if they want to alter units.
 * Returns true if the user says "Yes", false if they say "No".
 * @return {boolean} true if the user wants to continue with units change.
 */
mgr.confirmUnitsChange = function() {
  var str = su.translateString('Warning: changing your units ' +
    'could result in your formulas not behaving as you expect. ' +
    'Are you sure you want to change them?');
  return confirm(str);
};

/**
 * Shows a confirm message to the user asking if they want to alter the units.
 * Returns true if the user says "Yes", false if they say "No".
 * @param {string} id The id number of the entity to toggle units on.
 * @param {string} attrName The attribute whose units are changing.
 */
mgr.handleFormulaUnitsChange = function(id, attrName) {
  var entity = su.findEntity(id, mgr.rootEntity);
  var pulldown = $('formulaunits-pulldown');

  var units = pulldown.value;
  var lengthUnits = comp.lengthUnits(entity);
  var currentUnits = comp.getAttributeFormulaUnits(entity, attrName);

  // If the attribute is using default units then we need to know whether
  // this is a true change or simply moving from implied to explicit value.
  if (su.notValid(currentUnits) && units != 'DEFAULT') {
    if (su.notEmpty(comp.getAttributeValue(entity, attrName))) {
      if (lengthUnits != units) {
        if (mgr.confirmUnitsChange() == false) {
          pulldown.selectedIndex = pulldown.getAttribute('undo-value');
          su.preventDefault();
          su.stopPropagation();
          return;
        } else {
          var confirmed = true;
        }
      }
    }
  }

  // If the user is switching from something like Inches to Default-Inches
  // it's not really a change, so we don't want to ask for confirmation.
  if (!confirmed && units == 'DEFAULT') {
    if ((currentUnits != undefined) && (lengthUnits != currentUnits)) {
      if (mgr.confirmUnitsChange() == false) {
        pulldown.selectedIndex = pulldown.getAttribute('undo-value');
        su.preventDefault();
        su.stopPropagation();
        return;
      }
    }
  }

  pulldown.setAttribute('undo-value', pulldown.selectedIndex)
  mgr.tree.storeOptions(false, $('formulaunits-pulldown'));
};

// ---------------------------------------------------------------------------
// AttributeTree Class
// ---------------------------------------------------------------------------

/**
 * Supports the overall tree structured display of the manager panel.
 * @param {string} id The global and internal ID of the attribute tree.
 * @constructor
 */
function AttributeTree(id) {
  this.id = id;
}

/**
 * The id/name this instance is referred to at the global level. This is used
 * in markup generated for the tree to allow event handlers to gain access to
 * the current tree instance quickly.
 * TOOD (idearat): remove this global reference requirement.
 * @type {string}
 */
AttributeTree.prototype.id = null;

/**
 * The last selected label, whose highlighting is often manipulated to help
 * display current selection focus to the user.
 * @type {Element}
 */
AttributeTree.prototype.lastLabelCell = null;

/**
 * The last entity attribute selected or manipulated. This tracks context for
 * attribute editing operations.
 * @type {Object}
 */
AttributeTree.prototype.lastAttributeSelected = null;

/**
 * The last entity object selected. Used to track context for editing and
 * highlighting operations.
 * @type {Object}
 */
AttributeTree.prototype.lastEntitySelected = null;

/**
 * True when an attribute name is being edited rather than the value.
 * @type {boolean}
 */
AttributeTree.prototype.isEditingName = false;

/**
 * Adds a blank option to the current entity being detailed.
 */
AttributeTree.prototype.addBlankOption = function() {

  var entity = su.findEntity(this.idToDetail, mgr.rootEntity);
  var attribute = this.attNameToDetail;
  var options = comp.getAttributeOptions(entity, attribute);

  var defaultLabel = su.translateString(mgr.DEFAULT_OPTION_LABEL);
  var defaultValue = su.translateString(mgr.DEFAULT_OPTION_VALUE);

  options += '&' + escape(defaultLabel) + '=' + escape(defaultValue);

  comp.setAttributeOptions(entity, attribute, options);

  su.setContent('options-panel', this.dumpOptionsTable(entity, attribute));

  var i = 1;
  while ($('option-label-' + i)) {
    i++;
  }

  $('option-label-' + (i - 1)).focus();
  $('option-label-' + (i - 1)).select();
  $('options-scroll').scrollTop = 9000;
};

/**
 * Adds a group of attributes to the current entity. This operation is
 * performed as a special choice within the addAttribute logic. The trigger
 * for this action is clicking on the header for an entire attribute set.
 * @param {string} groupName The name of the attribute group to add.
 */
AttributeTree.prototype.attachGroup = function(groupName) {

  var entity = this.lastEntitySelected;
  var attributesToPush = {};

  for (var attName in comp.RESERVED) {
    attributesToPush[attName] = {};

    var attribute = comp.RESERVED[attName];
    if ((attribute.group === groupName) &&
        !su.isValid(comp.getAttribute(entity, attName))) {

      var defaultValue = attribute.defaultValue;
      var value = su.ifEmpty(defaultValue, '');

      comp.setAttributeValue(entity, attName, value);
      comp.setAttributeFormula(entity, attName, '');
      comp.setAttributeLabel(entity, attName, attribute.label);

      attributesToPush[attName].value = value;
      attributesToPush[attName].label = attribute.label;
    }
  }

  // Push the new attribute information to Ruby/SketchUp and re-draw the UI
  // so we're sure we get all the new attributes into the entity's table.
  comp.pushAttributeSet(entity.id, attributesToPush, 'mgr.redraw', true);

  window.setTimeout(function() {
    mgr.tree.hideEditPanels();
  }, 0);
};

/**
 * Removes an attribute from the currently detailed entity.
 * @return {boolean} True if the attribute was successfully removed.
 */
AttributeTree.prototype.deleteAttribute = function() {
  var str;

  var entity = su.findEntity(this.idToDetail, mgr.rootEntity);
  var attribute = this.attNameToDetail;

  if (comp.RESERVED[attribute]) {
    if (comp.RESERVED[attribute].hasLiveValue) {
      str = su.translateString(
        'Are you sure you want to clear this attribute?');
      if (confirm(str)) {
        if (entity.attributeDictionaries) {
          this.hideEditPanels();
          this.hideDetailControls();
          mgr.doDeleteAttribute(entity, attribute);
          return true;
        }
      }
    }
  }

  str = su.translateString(
    'Are you sure you want to delete this attribute? ' +
    'Any formulas that refer to this will be broken.');

  if (confirm(str)) {
    this.hideEditPanels();
    this.hideDetailControls();
    mgr.doDeleteAttribute(entity, attribute);
    return true;
  }
};

/**
 * Generates an HTML 'TR' containing a specific attribute's data.
 * @param {Object} entity The entity containing the attribute.
 * @param {Object} attrName The attribute whose data we are to expose.
 * @param {number} rowCount The row number for the row being generated.
 * @return {string} The html output for a single attribute row.
 */
AttributeTree.prototype.dumpAttributeRow = function(entity,
                                                    attrName,
                                                    rowCount) {
  var label;
  var displayValue;

  // The base row class is tweaked to produce a striping effect for odd and
  // even cells.
  var oddEvenString = this.getRowClassByCount(rowCount);
  var rowClass = 'attribute-cell ' + oddEvenString;

  // If the attribute has user-level access then we also want to display a
  // small icon so the user is aware that configurable details exist. Do that
  // by adding a CSS class which exposes display of that icon.
  if ((su.isValid(comp.getAttributeAccess(entity, attrName)) &&
      comp.getAttributeAccess(entity, attrName) != 'NONE') ||
      su.isValid(comp.getAttributeFormulaUnits(entity, attrName, false))) {
    rowClass += ' details-icon-active';
  } else {
    rowClass += ' details-icon-inactive';
  }

  // The label is determined by the entity, followed by whether we've got a
  // standardized label (when the attribute is a known/reserved one).
  // Otherwise we default to the attrName itself.
  var attr = comp.getAttribute(entity, attrName);
  var reserved = comp.RESERVED[attrName];
  if (su.notEmpty(attr.label)) {
    label = attr.label;
  } else if (su.isValid(reserved)) {
    if (su.notEmpty(reserved.label)) {
      label = reserved.label;
    } else {
      label = attrName;
    }
    comp.setAttributeLabel(entity, attrName, label);
  } else {
    label = attrName;
  }

  // Provide for special coloring of the label.
  var labelStyle = '';
  if (su.isValid(reserved)) {
    if (su.notEmpty(reserved.color)) {
      labelStyle = 'color:' + reserved.color;
    }
  }

  // Determine the proper display style, again offering the first choice to
  // the attribute/entity information, then the reserved attribute list.
  var unitGroup = '';
  if (comp.getAttributeFormula(entity, attrName)) {
    rowClass += ' formula-result';
    if (comp.getAttributeFormula(entity, attrName).indexOf('$') == 0) {
      unitGroup = 'currency';
    }
  } else if (su.isValid(reserved)) {
    if (reserved.hasLiveValue == true) {
      rowClass += ' live-value-result';
    }
  }

  // Default to the unitGroup defined in our reserved list.
  if (su.isValid(reserved)) {
    unitGroup = su.ifEmpty(unitGroup, reserved.unitGroup);
  }

  if (comp.getAttributeError(entity, attrName).indexOf(
      'subformula-error') > -1) {
    displayValue = mgr.ERROR_PREFIX + '=' +
        comp.getAttributeError(entity, attrName);
  } else {
    displayValue = mgr.formatDisplayValue(entity, attrName);
  }

  var formula = comp.getAttributeFormula(entity, attrName)
  if (mgr.showFormulas == true && su.isEmpty(formula) == false) {
    displayValue = '=' + formula;
    displayValue = displayValue.replace(/\</g, '&lt;');
    displayValue = displayValue.replace(/\>/g, '&gt;');
    displayValue = displayValue.replace(/\//g,
        '/<span class="zero-width"> </span>');
    if (comp.getAttributeError(entity, attrName).indexOf(
        'error') > -1) {
      displayValue = mgr.ERROR_PREFIX + displayValue;
    }
  } else if (su.isEmpty(formula) == false) {

    // If a formula contains a boolean function and that formula contains
    // a boolean value of 0.0 or 1.0, then display the friendly TRUE or
    // FALSE text the same way that Google Spreadsheets does.
    //
    // Note: the match(/\bor\(/) will match or() but not floor()
    var lowerCaseFormula = formula.toLowerCase();
    if (lowerCaseFormula.indexOf('true') > -1 ||
        lowerCaseFormula.indexOf('false') > -1 ||
        lowerCaseFormula.indexOf('and(') > -1 ||
        lowerCaseFormula.indexOf('not(') > -1 ||
        lowerCaseFormula.match(/\bor\(/) != null ||
        lowerCaseFormula.indexOf('<') > -1 ||
        lowerCaseFormula.indexOf('>') > -1 ||
        lowerCaseFormula.indexOf('=') > -1) {

      if (displayValue == '1.0') {
        displayValue = 'TRUE';
      } else if (displayValue == '0.0') {
        displayValue = 'FALSE';
      }
    }
  }

  displayValue = mgr.insertSoftBreaks(displayValue);

  // With the various parts in place we can finally build the row itself.
  var arr = [];

  // Open a new row.
  arr.push('<tr>');

  // Output the label column markup.
  arr.push(
      '<td class="attribute-label ', oddEvenString, '" id="label_', entity.id,
      '_', attrName, '"', ' name="label_', rowCount, '"',
      ' valign="top" style="', labelStyle, '"',
      ' onclick="', this.id, '.handleAttributeClick(this, ',
      entity.id, ', \'', attrName, '\')"',
      ' ondblclick="mgr.resetValueCell();', this.id,
      '.editAttributeName(this, ', entity.id, ', \'', attrName, '\')"',
      ' onmousedown="mgr.storeSelectionTextRange()">',
      mgr.insertSoftBreaks(label),
      '</td>');

  // Output the value column markup.
  arr.push('<td id="value_', entity.id, '_', attrName, '"',
      ' name="field_', rowCount, '"',
      ' class="', rowClass, ' attribute-value"',
      ' ondblclick="mgr.resetValueCell();', this.id,
      '.editAttributeValue(this, ', entity.id, ', \'', attrName, '\');',
      '$(\'edit-field\').select();"',
      ' onclick="', this.id, '.handleAttributeClick(this, ',
      entity.id, ', \'', attrName, '\')" ',
      'onmousedown="mgr.storeSelectionTextRange()">',
      displayValue, '&nbsp;',
      '</td>');

  // Close off the row.
  arr.push('</tr>');

  var html = arr.join('');
  return html;
};

/**
 * Generates an HTML 'TABLE' containing a specific entity's data.
 * @param {Object} entity The entity to process.
 * @return {string} The html for the attribute table.
 */
AttributeTree.prototype.dumpAttributeTable = function(entity) {

  var collapseState;
  var branchClass;

  // If an entity was collapsed we'll generate output that maintains that
  // state during redraw/regeneration of the UI for that entity.
  // Note that we now show the root element as visible if it has not
  // been explicitly collapsed.
  if (su.isEmpty(comp.getAttributeValue(entity, '_iscollapsed'))) {
    if (mgr.rootEntity == entity) {
      collapseState = 'visible';
    } else {
      collapseState = 'collapsed';
    }
  } else if (comp.getAttributeValue(entity, '_iscollapsed') == 'false') {
    collapseState = 'visible';
  } else {
    collapseState = 'collapsed';
  }

  var arr = [];

  // Get our length units for this entity, defaulting to inches.
  var lengthUnits = comp.lengthUnits(entity);

  arr.push('<div class="tree-leaf-', collapseState, '">',
    '<div id="attribute-head-', entity.id, '"',
    ' class="attribute-head-', collapseState, '"',
    ' onclick="', this.id, '.toggleCollapse(this, \'', entity.id, '\')"', '>',
    '<span class="units-button-panel"><span onclick="mgr.toggleLengthUnits(\'',
    entity.id, '\')" ', 'id="units-button" class="units-button-',
    lengthUnits.toLowerCase(), '" title="',
    su.translateString('Toggle Metric'), '">&nbsp;</span></span>',
    '<span onclick="', 'mgr.toggleSelection(\'', entity.id, '\');"',
    ' ondblclick="', 'mgr.renameEntity(', entity.id, ', ',
    su.quote(entity.name), ')"',
    ' title="' + su.translateString('Double click to rename') + '"',
    ' class="attribute-head-text icon-', entity.typename.toLowerCase(), '">',
    entity.name,
    '</span>',
    '</div>',
    '<div id="attribute-table-wrapper-', entity.id, '"',
    ' class="attribute-table-wrapper">',
    '<table class="attribute-table" cellspacing="0">'
  );

  // Locate the specific attribute library for components, the rest will be
  // ignored for now.
  for (var libraryName in entity.attributeDictionaries) {
    if (libraryName != comp.DICTIONARY) {
      continue;
    }
  }

  // Make sure we found what we were looking for in terms of attribute set.
  if (su.notValid(libraryName)) {
    su.raise(su.translateString('Unable to locate component library name.'));
    return;
  }

  // Capture the library itself, otherwise signal a problem.
  var thisLib = entity.attributeDictionaries[libraryName];
  if (su.notValid(thisLib)) {
    su.raise(su.translateString(
        'Unable to locate component attribute dictionary.'));
    return;
  }

  // Keep track of the group name of each attribute, so we can output a
  // subhead for each new group that we encounter.
  var lastGroup = '';

  // Track rowCount so we can display stripped table rows in the output.
  var rowCount = 1;

  for (var attName in thisLib) {

    // Do not show attributes that start with an underscore, these are used
    // internally for maintaining UI state.
    if (attName.indexOf('_') == 0) {
      continue;
    }

    rowCount++;

    // Show a subhead for each new group that we encounter.
    var attr = comp.RESERVED[attName];
    var thisGroup = su.isValid(attr) ? attr.group : 'Custom';

    // If we change groups output a new section subheading.
    if (thisGroup != lastGroup) {
      arr.push('<tr><td class="attribute-subhead-label" colspan="2">',
        su.translateString(thisGroup),
        '</td></tr>');
      lastGroup = thisGroup;
    }

    // Process the attribute row, injecting that input into our table.
    arr.push(this.dumpAttributeRow(entity, attName, rowCount));
  }

  // Generate an add attribute row as the last row of the overall table.
  var rowClass = this.getRowClassByCount(rowCount + 1);

  arr.push('<tr>',
      '<td class="attribute-label ', rowClass, '"',
      ' onclick="', this.id, '.editAttributeName(this, \'', entity.id, '\')">',
      '<div id="add-attribute-link-', entity.id,
      '" class="add-attribute-link"><nobr>',
      su.translateString(mgr.ADD_ATTRIBUTE), '</nobr></div>',
      '</td>',
      '<td class="attribute-cell ', rowClass, '">&nbsp;</td>',
      '</tr>');

  // Close the overall table and the divs which handle collapse/expand.
  arr.push('</table></div></div>');

  // Dump out child entity(s) beneath this entity. We currently limit this to
  // one level of child content.
  if (su.isValid(entity.subentities)) {
    var len = entity.subentities.length;
    for (var i = 0; i < len; i++) {
      if (i == (len - 1)) {
        branchClass = 'tree-branch-l';
      } else {
        branchClass = 'tree-branch-i';
      }

      // Wrap each child entity we add in a wrapper with child entity ID.
      arr.push('<div id="', entity.subentities[i].id, '"',
        ' class="', branchClass, '">',
        this.dumpAttributeTable(entity.subentities[i]),
        '</div>');
    }
  }

  var html = arr.join('');
  return html;
};

/**
 * Generate HTML for configuration options related to an entity/attribute pair.
 * @param {Object} entity The entity containing the attribute.
 * @param {Object} attrName The attribute whose data we are to expose.
 * @return {string} The html for the options table.
 */
AttributeTree.prototype.dumpOptionsTable = function(entity, attrName) {
  var options = comp.getAttributeOptions(entity, attrName);
  if (su.isString(options)) {
    options = su.unescapeHTML(options);
  }

  var arr = [];
  arr.push('<div id="options-scroll">',
    '<table width="100%" cellpadding="0" cellspacing="0"',
    ' class="options-table">',
    '<tr><td class="options-head">', su.translateString('List Option'),
    '</td>', '<td class="options-head">', su.translateString('Value'),
    '</td></tr>');

  // Gather the information we need to format the underlying value into a
  // display value based on the attibute's formula units. We look first for
  // a pulldown control, in case the user just changed their units in the
  // control before committing the change.
  var units;

  // If an explicit unit is selected, then use that instead of the default one.
  // This allows us to refresh the options list in the currently selected
  // units even before the change is committed.
  if (su.isValid($('formulaunits-pulldown'))) {
    units = $('formulaunits-pulldown').value;
    if (units == 'DEFAULT') {
      if (su.isValid(comp.RESERVED[attrName])) {
        if (comp.RESERVED[attrName].unitGroup == 'LENGTH') {
          units = su.ifEmpty(comp.lengthUnits(entity), units);
        }
      } else {
        units = 'STRING';
      }
    }
  }
  var units = su.ifEmpty(units,
      comp.getAttributeFormulaUnits(entity, attrName, true));

  var rowID = 0;
  if (su.notEmpty(options)) {
    var valuePairs = options.split('&');
    var len = valuePairs.length;
    for (var i = 0; i < len; i++) {
      var pair = valuePairs[i];
      if (su.notEmpty(pair) && pair != 'undefined') {
        rowID++;
        var nameValueArray = pair.split('=');

        // Format the name and value into strings that will
        // display nicely in an HTML text box.
        var name = unescape(nameValueArray[0]);
        var value = unescape(nameValueArray[1]);
        if (value.indexOf('=') != 0 &&
            value != mgr.DEFAULT_OPTION_VALUE) {
          value = conv.fromBase(value, units);
          value = conv.format(value, units, 6);
        }
        name = name.replace(/\"/gi, '&quot;');
        value = value.replace(/\"/gi, '&quot;');

        arr.push('<tr>',
            '<td class="options-label">',
            '<input id="option-label-', rowID, '"',
            ' class="options-field" ',
            ' value="', name, '"',
            ' onfocus="this.setAttribute(\'undo-value\', this.value)"',
            ' onblur="', this.id, '.storeOptions(true, this)"',
            '>',
            '</td>',
            '<td class="options-value">',
            '<input id="option-value-', rowID, '"',
            ' class="options-field"',
            ' value="', value, '"',
            ' onfocus="this.setAttribute(\'undo-value\', this.value)"',
            ' onblur="', this.id, '.storeOptions(false, this)"',
            '>',
            '</td></tr>');
      }
    }
  }

  // Build a final 'add option' row for the table.
  arr.push('<tr><td class="add-option-link"',
      ' onclick="', this.id, '.addBlankOption()"',
      ' colspan="2">' + su.translateString('Add option') + '</td></tr>',
      '</table>');

  // Note this field isn't identified and is positioned off screen
  // above the viewport so it's effectively never accessible except by
  // having a keyboard action cause it to focus. It's here to help us trap
  // tabbing events rather than losing focus to an element we don't control.
  arr.push('<input type="text" style="position: absolute;top: -500px;"',
      ' onfocus="', this.id, '.addBlankOption()">');

  // Close off the 'options-scroll' div.
  arr.push('</div>');

  var html = arr.join('');
  return html;
};

/**
 * Handles requests to edit an attribute name. This is triggered by a
 * double-click action on an attribute label cell in the user interface.
 * @param {Element} target The target element for the (dbl)click.
 * @param {string} entityID The ID of the entity which owns the attribute.
 * @param {string} attrName The name of the attribute to be renamed.
 */
AttributeTree.prototype.editAttributeName = function(target, entityID,
    attrName) {

  // Stop floating.
  mgr.unfloatEditor();

  // Find the entity object by searching through our root entity.
  var entity = su.findEntity(entityID, mgr.rootEntity);
  if (su.notValid(entity)) {
    su.raise(su.translateString('Could not find entity: ') + entityID);
    return;
  }

  // Can't rename reserved attributes, so check that dictionary.
  if (su.isValid(comp.RESERVED[attrName])) {
    mgr.tree.hideEditPanels();
    mgr.tree.highlight();
    alert(su.translateString('You cannot rename reserved attributes.'));
    return;
  }

  var attr = comp.getAttribute(entity, attrName);
  var field = $('edit-field');

  // Set the edit field's value to the current attribute name or prompt.
  if (su.notEmpty(attrName)) {
    var label = su.isValid(attr) ? attr.label : attrName;
    comp.setAttributeLabel(entity, attrName, label);
    field.value = label;
  } else {
    field.value = su.translateString(mgr.ENTER_NAME_STRING);
  }

  mgr.hideHighlight();

  // Update our current selection context so any edit/redisplay will know
  // where we were focused etc.
  mgr.setFocusedElement(target);
  this.lastEntitySelected = entity;
  this.lastAttributeSelected = attr;
  this.isEditingName = true;

  // Display/focus the actual editing controls.
  this.showEditPanel(target);

  if (su.isEmpty(attrName)) {
    this.showListPanel(entity);
  }

  field.select();

  // We need to stop event propagation here to properly support clicking
  // on the add attribute link in IE.
  su.stopPropagation();
};

/**
 * Handles requests to edit an attribute value. This is triggered by a
 * double-click action on an attribute value cell in the user interface.
 * @param {Element} target The target element for the (dbl)click.
 * @param {string} opt_entityID The ID of the entity owning the attribute.
 * @param {string} opt_attrName The name of the attribute to be updated.
 */
AttributeTree.prototype.editAttributeValue = function(target, opt_entityID,
    opt_attrName) {
  if (su.isEmpty(opt_entityID)) {
    var entity = this.lastEntitySelected || mgr.rootEntity;
  } else {
    var entity = su.findEntity(opt_entityID, mgr.rootEntity);
  }

  if (su.notValid(entity)) {
    su.raise(su.translateString('Could not find entity: ') + opt_entityID);
    return;
  }

  if (su.isEmpty(opt_attrName)) {
    var id = target.getAttribute('id');
    if (su.isEmpty(id)) {
      return;
    }
    var parts = mgr.parseIdIntoParts(id);
    if (parts.length < 3) {
      return;
    }
    var attrName = parts[2];
  } else {
    var attrName = opt_attrName;
  }

  var attr = comp.getAttribute(entity, attrName);
  if (su.notValid(attr)) {
    su.raise(su.translateString('Could not find attribute: ') + opt_attrName);
    return;
  }

  var field = $('edit-field');

  // We edit formula or value in that order (first non-empty/null value).
  var formula = comp.getAttributeFormula(entity, attrName);
  if (su.notEmpty(formula)) {
    field.value = '=' + su.unescapeHTML(formula);
  } else {
    var value = comp.getAttributeFormattedValue(entity, attrName,
        mgr.DEFAULT_EDIT_DECIMAL_PLACES);
    field.value = su.unescapeHTML(value);
  }

  // If the user clicked on the label cell to select this attribute, then the
  // target which gets passed in is incorrect. Therefore, recalculate the
  // correct target.
  target = $(target.getAttribute('id').replace(/label_/, 'value_'));

  // Update our current selection context so any edit/redisplay will know
  // where we were focused etc.
  mgr.setFocusedElement(target);
  this.lastEntitySelected = entity;
  this.lastAttributeSelected = attr;
  this.isEditingName = false;

  if (attrName != 'scaletool') {
    this.showEditPanel(target);
    this.highlight(target);
    field.focus();

    su.selectFromTo(field, field.value.length, field.value.length);

    // On the Mac, the selectFromTo fails if there is nothing in the field,
    // so handle that here.
    if (su.isEmpty(field.value)) {
      field.select();
    }

    // Now that we've moved the text selection to the end of the field,
    // set out scroll to 0 so we don't see flashing on the PC.
    field.scrollTop = 0;
  } else {
    this.showDetailPanel();
  }

  var statusStr = '<b>' + su.truncate(
      comp.getAttributeLabel(entity, attrName), 40) + '</b>';

  var reserved = comp.RESERVED[attrName];
  if (su.isValid(reserved)) {
    statusStr += ' &middot; ' + su.translateString(reserved.summary);
    if (su.notEmpty(formula)) {
      statusStr += '<br/>=' + comp.getAttributeFormula(entity, attrName);
    }
    mgr.setStatusBar(statusStr, attrName);
  } else {
    statusStr += ' &middot; ' + su.translateString('Custom attribute.');
    if (su.notEmpty(formula)) {
      statusStr += '<br/>=' + comp.getAttributeFormula(entity, attrName);
    }
    mgr.setStatusBar(statusStr, 'custom');
  }

  // Update our editor height to match the height of its content. This is to
  // show long formulas properly at the moment that one starts editing.
  mgr.updateEditorLayout();
};

/**
 * Activates the buttons which support saving or refreshing the user interface
 * when an editing operation is in progress and has changed a value.
 */
AttributeTree.prototype.enableEditButtons = function() {
  su.enable('applyButton');
  su.enable('refreshButton');
};

/**
 * Returns a class which can be used to help display striping for table or
 * list cells based on the rowCount provided (odd or even).
 * @param {number} rowCount The row number to use for class computation.
 * @return {string} The CSS class name.
 */
AttributeTree.prototype.getRowClassByCount = function(rowCount) {
  if ((rowCount % 2) == 0) {
    return ' even ';
  } else {
    return ' odd ';
  }
};

/**
 * Responds to notifications that an edit operation has potentially occurred.
 * When data has changed in the edit field this method will ensure that it is
 * pushed to SketchUp via the Ruby bridge.
 * @param {Element} opt_formField The field serving as the edit field.
 * @param {Element} opt_target An optional target element being edited.
 * @param {number} opt_index A focus index, next, previous, or current.
 * @param {boolean} opt_editor Should the editor display on completion.
 * @return {boolean} True if there were edits which were found.
 */
AttributeTree.prototype.handleEdit = function(opt_formField, opt_target,
    opt_index, opt_editor) {

  var name;
  var label;

  window.setTimeout(function() {
    mgr.tree.hideEditPanels();
  }, 0);

  mgr.isFloating(false);

  // Set any refocusing parameters on the manager since the tree instance
  // will be replaced during redraw and we'll lose any instance data.
  mgr.refocusTarget = su.isValid(opt_target) ?
      opt_target.getAttribute('id') :
      opt_target;
  mgr.refocusIndex = su.ifInvalid(opt_index, mgr.FOCUS_CURRENT);
  mgr.refocusEditor = su.ifInvalid(opt_editor, true);

  var entity = this.lastEntitySelected;
  if (su.isValid(this.lastAttributeSelected)) {
    if (su.notEmpty(this.lastAttributeSelected.label)) {
      name = this.lastAttributeSelected.label.toLowerCase();
    } else {
      name = this.lastAttributeSelected.id;
    }
  } else {
    name = undefined;
  }

  // Convert to element as needed.
  var field = $(opt_formField || $('edit-field'));

  var defaultValue = '';
  var dirty = false;
  var lastAttributeLabel;
  if (su.isValid(this.lastAttributeSelected)) {
    lastAttributeLabel = this.lastAttributeSelected.label;
  }

  if (this.isEditingName) {

    field.value = field.value.replace(/[\r\n]/gi, '');
    field.value = su.trimWhitespace(field.value);

    var attrName = field.value.toLowerCase();

    if (su.isEmpty(attrName)) {
      alert(su.translateString('Attribute names cannot be empty. ' +
          'Please enter a different name.'));
      return this.refocusAfterNamingError();
    } else if ((comp.hasAttribute(entity, attrName)) &&
        lastAttributeLabel.toLowerCase() != attrName.toLowerCase()) {
      alert(su.translateString('Duplicate attribute name. ' +
          'Please enter a different name.'));
      return this.refocusAfterNamingError();
    } else if ((field.value == su.translateString(mgr.ENTER_NAME_STRING)) ||
        field.value.length == 0) {
      mgr.resetValueCell();
    } else if (field.value.indexOf(' ') > -1) {

      alert(su.translateString('Attribute names cannot contain spaces. ' +
          'Please enter a different name.'));
      return this.refocusAfterNamingError();

    } else if (field.value.search(/\W/) > -1) {

      alert(su.translateString('Attribute names can only contain letters and numbers. ' +
          'Please enter a different name.'));
      return this.refocusAfterNamingError();

    } else if (field.value.indexOf('_') == 0) {

      alert(su.translateString('Attribute names cannot begin with an underscore. ' +
          'Please enter a different name.'));
      return this.refocusAfterNamingError();

    } else if (field.value.match(/^\d/) !== null) {

      alert(su.translateString('Attribute names cannot begin with an number. ' +
          'Please enter a different name.'));
      return this.refocusAfterNamingError();

    } else if (field.value.match(/^(true|false)$/i) != null) {

      alert(su.translateString('You may not name an attribute "true" or "false". ' +
          'Please enter a different name.'));
      return this.refocusAfterNamingError();

    } else if (name == field.value.toLowerCase()) {

      if (su.notEmpty(comp.RESERVED[attrName])) {
        label = comp.RESERVED[attrName].label;
      } else {
        label = field.value;
      }

      comp.setAttributeLabel(entity, attrName, label);
      mgr.redraw();

    } else if (name != undefined) {

      var newLabel = field.value;
      var newName = field.value.toLowerCase();

      dirty = true;

      // In this case, we're about to rename, so construct
      // a refocusTarget string manually and always place the highlight
      // onto the newly created field.
      mgr.refocusTarget = 'value_' + entity.id + '_' + attrName;
      mgr.refocusIndex = mgr.FOCUS_CURRENT;
      mgr.refocusEditor = false;

      comp.pushRename(entity, name, newName, newLabel, 'mgr.redraw');

    } else if (comp.hasAttribute(entity, attrName)) {

      alert(su.translateString('The attribute already exists.'));
      return this.refocusAfterNamingError();

    } else {

      if (comp.RESERVED[attrName]) {
        label = comp.RESERVED[attrName].label;
        defaultValue = comp.RESERVED[attrName].defaultValue;
      } else {
        label = field.value;
      }

      var value = su.ifEmpty(defaultValue, '');

      comp.setAttributeValue(entity, attrName, value);
      comp.setAttributeFormula(entity, attrName, '');
      comp.setAttributeLabel(entity, attrName, label);

      // In this case, we're about to create a new attribute, so construct
      // a refocusTarget string manually and always place the highlight
      // onto the newly created field.
      mgr.refocusTarget = 'value_' + entity.id + '_' + attrName;
      mgr.refocusIndex = mgr.FOCUS_CURRENT;
      mgr.refocusEditor = false;

      dirty = true;
      comp.pushAttribute(entity, attrName, 'mgr.redraw');
    }

  } else {

    // Editing value.

    var valueHasCarriageReturns = field.value.search(/[\r\n]/gi);
    field.value = field.value.replace(/[\r\n]/gi, '');

    if (field.value.indexOf('=') == 0) {

      // Content represents an explicit formula, strip leading prefix.
      var rawFormula = field.value.substring(1);

      var attrName = field.value.toLowerCase();

      if (comp.getAttributeFormula(entity, name) != rawFormula) {
        mgr.setValueCell(entity, name, field.value);
        var thisAtt = comp.getAttribute(entity, attrName);
        comp.setAttributeFormula(entity, name, rawFormula)
        comp.setAttributeLabel(entity, name,
            this.lastAttributeSelected.label);
        this.enableEditButtons();
        dirty = true;
        comp.pushAttribute(entity, name, 'mgr.redraw');
        mgr.setValueCell(entity, name, mgr.APPLYING_ATTRIBUTE_MESSAGE);

      } else {

        mgr.resetValueCell();

      }
    } else {

      // Start with what the user entered.
      var enteredValue = field.value;

      // Content is a raw value, not a formula.
      var hasLiveValue = false;

      // Determine whether this attribute has a "LiveValue", meaning it is
      // a value such as LENX that is derived from SketchUp. Live valued
      // attributes will be displayed in gray text unless a formula is set
      // on them.
      if (comp.RESERVED[name]) {
        if (comp.RESERVED[name].hasLiveValue == true) {
          hasLiveValue = true;
        }
      } else {
        // If the attibute has no formula units, then attempt to determine the
        // unit group from the string the user entered.
        var foundUnits = comp.getAttributeFormulaUnits(entity, name);
        if (su.isEmpty(foundUnits)) {
          foundUnits = conv.recognizeUnits(enteredValue, true);
          if (su.isValid(foundUnits)) {
            comp.setAttributeFormulaUnits(entity, name, foundUnits);
          }
        }
      }

      // Take the entered value and turn it into the appropriate base
      // units. (For example, lengths are always stored in inches, regardless
      // of the unit they are displayed in.)
      enteredValue = comp.parseToBase(enteredValue, entity, name);

      if (comp.getAttributeValue(entity, name) !== field.value ||
          su.isValid(comp.getAttributeFormula(entity, name))) {
        comp.setAttributeValue(entity, name, enteredValue);
        comp.setAttributeFormula(entity, name, undefined);
        comp.setAttributeLabel(entity, name,
            this.lastAttributeSelected.label);
        this.enableEditButtons();
        dirty = true;
        comp.pushAttribute(entity, name, 'mgr.redraw');
      }
      mgr.resetValueCell();
    }
  }

  // When dirty is true it means there's an async call in progress to Ruby
  // which will deal with updating focus etc. Otherwise we have to handle any
  // specifics around focus/editor display locally.
  if (!dirty) {
    if (su.isValid(opt_index) || opt_editor) {
      window.setTimeout(function() {
        mgr.refocus();
      }, 0);
    }
  }

  return dirty;
};

/**
 * Responds to notifications that a keydown event has occurred. Key down
 * events are used to process navigation keys that we don't want to end up in
 * the target field such as Tab and Return.
 * @param {Element} target The element which received the event.
 * @param {Event} evt The native keydown event.
 * @param {number} opt_manualKeycode An optional alternative keycode to force.
 * @return {boolean} True so the event default operation continues.
 */
AttributeTree.prototype.handleKeyDown = function(target, evt,
    opt_manualKeycode) {

  var keycode = su.ifInvalid(opt_manualKeycode, su.getKeyCode(evt));

  mgr.storeSelectionTextRange();

  switch (keycode) {
    case su.ESCAPE_KEY:
      su.stopPropagation(evt);
      su.preventDefault(evt);
      if (mgr.isDetailing()) {
        var ev = evt || window.event;
        var target = ev.target || ev.srcElement;
        var ancestor = target.parentNode;
        if (ancestor && ancestor.className == 'options-label') {
          if (target.value == su.translateString(mgr.DEFAULT_OPTION_LABEL)) {
            target.blur();
            break;
          }
          target.value = target.getAttribute('undo-value') || '';
          target.select();
        } else if (ancestor && ancestor.className == 'options-value') {
          if (target.value == su.translateString(mgr.DEFAULT_OPTION_VALUE)) {
            target.blur();
            break;
          }
          target.value = target.getAttribute('undo-value') || '';
          target.select();
        } else {
          mgr.tree.hideDetailPanel();
        }
      } else if (mgr.isEditing()) {
        mgr.resetValueCell();
        mgr.tree.hideEditPanels();
        mgr.tree.highlight();
      } else {
        mgr.hideHighlight();
        mgr.setFocusedElement(null);
        mgr.refocusIndex = null;
        mgr.refocusTarget = null;
        mgr.tree.hideDetailControls();
      }
      break;
    case su.ARROW_UP_KEY:
      if (!mgr.isEditing() && !mgr.isDetailing()) {
        su.stopPropagation(evt);
        su.preventDefault(evt);
        mgr.focusPrevious();
      } else if (mgr.isDetailing()) {
        var ev = evt || window.event;
        var target = ev.target || ev.srcElement;
        var ancestor = target.parentNode;
        if (ancestor && ancestor.className.indexOf('options-') == 0) {
          var cellIndex = ancestor.cellIndex;
          var rowIndex = ancestor.parentNode.rowIndex;
          // The header is at 0, so 'real data' starts at 1.
          if (rowIndex > 1) {
            var target = ancestor.parentNode.parentNode.rows[
                rowIndex - 1].cells[cellIndex].firstChild;
            window.setTimeout(function() {
                  target.select();
            }, 0);
          }
        }
      }
      break;
    case su.ARROW_DOWN_KEY:
      if (!mgr.isEditing() && !mgr.isDetailing()) {
        su.stopPropagation(evt);
        su.preventDefault(evt);
        mgr.focusNext();
      } else if (mgr.isDetailing()) {
        var ev = evt || window.event;
        var target = ev.target || ev.srcElement;
        var ancestor = target.parentNode;
        if (ancestor && ancestor.className.indexOf('options-') == 0) {
          var cellIndex = ancestor.cellIndex;
          var rowIndex = ancestor.parentNode.rowIndex;
          var rows = ancestor.parentNode.parentNode.rows;
          if (rowIndex < rows.length - 1) {
            var target = rows[rowIndex + 1].cells[cellIndex].firstChild;
            window.setTimeout(function() {
                  target.select();
            }, 0);
          }
        }
      }
      break;
    case su.TAB_KEY:

      // If the user is inside the details panel, let tabs flow normally.
      if (mgr.isDetailing()) {
        break;
      }

      // If the user hits tab or enter when the edit panel is visible,
      // then apply the changes through handleEdit, but if the edit
      // panel is not visible, then tab or Enter simply remove focus
      // from the spreadsheet cell.
      su.stopPropagation(evt);
      su.preventDefault(evt);

      // If the edit field is currently visible we want to push any value
      // change back to SketchUp before we move the focus.
      if (mgr.isEditing()) {
        var refocus = su.getShiftKey() ? mgr.FOCUS_PREVIOUS: mgr.FOCUS_NEXT;
        mgr.tree.handleEdit($('edit-field'), mgr.getFocusedElement(), refocus,
            true);
      } else {
        // Shift-Tab moves us back, Tab moves us forward.
        if (su.getShiftKey()) {
          mgr.focusPrevious();
        } else {
          mgr.focusNext();
        }
      }

      break;
    case su.ENTER_KEY:

      // When detailing we want to watch for whether the enter key is pressed
      // when we're editing an option list. In that case we'll simulate a Tab
      // by blurring the field (to commit the value) and then add a row.
      if (mgr.isDetailing()) {
        var ev = evt || window.event;
        var target = ev.target || ev.srcElement;
        var ancestor = target.parentNode;
        if (ancestor && ancestor.className == 'options-label') {
          var label = target.value;
          try {
            target = ancestor.nextSibling.firstChild;
            if (su.isEmpty(target.value)) {
              target.value = label;
            }
            target.select();
          } catch (e) {
          }
        } else if (ancestor && ancestor.className == 'options-value') {
          mgr.tree.storeOptions(false, target);
          mgr.tree.addBlankOption();
        }
        break;
      }

      // If the edit field is currently visible we want to push changes to
      // SketchUp and then return focus to the current field with just the
      // highlighting rectange but no edit field.
      if (mgr.isEditing()) {
        // Hide the highlight momentarily to avoid having it out of sync with
        // any editor-related resizing.
        mgr.hideHighlight();
        mgr.tree.handleEdit($('edit-field'), mgr.getFocusedElement(),
            mgr.FOCUS_CURRENT, false);
      } else {
        if (su.isValid(mgr.getFocusedElement())) {
          window.setTimeout(function() {
            mgr.tree.editAttributeValue(mgr.getFocusedElement());
            $('edit-field').select();
            }, 0);
          return false;
        }
      }
      su.stopPropagation(evt);
      su.preventDefault(evt);
      break;
    case su.SHIFT_KEY:
      // Ignore toggling of Shift since it's often used with Tab to control
      // direction of the Tab without implying a desire to edit content.
      break;
    default:
      // All other keys should trigger editing if we're currently highlighting
      // a cell.
      if (!mgr.isEditing() && !mgr.isDetailing()) {
        if (keycode > 32) {
          if (su.isValid(mgr.getFocusedElement())) {

            mgr.tree.editAttributeValue(mgr.getFocusedElement());

            // See if we got either an = or @ as a prefix. If so then we
            // consider that an indicator that the user wants to start a new
            // formula or reference and we clear any existing value.
            // NOTE NOTE NOTE that this isn't localized by keyboard, it's
            // specific to a US Ascii 101 keyboard arrangement.
            var ev = evt || window.event;
            if ((keycode == mgr.EQUAL_KEY_STD ||
                keycode == mgr.EQUAL_KEY_NUM) ||
                (keycode == mgr.COMMAT_KEY && ev.shiftKey == true)) {
              $('edit-field').value = '';
            }
          }
        }
      } else {

        if (mgr.tree.isEditingName &&
            $('edit-field').value.length > mgr.MAX_NAME_LENGTH * 2) {
          var ev = evt || window.event;
          if ((keycode != su.BACKSPACE_KEY) && (keycode != su.DELETE_KEY)) {
            su.stopPropagation(evt);
            su.preventDefault(evt);
          }
        }

        // Update our editor height to match the content just entered.
        mgr.updateEditorLayoutTimeout();
        if (mgr.isFloating()) {
          mgr.updateFloatingEditorLayout();
        }
      }
      break;
  }
  return true;
};

/**
 * Responds to notifications that a keypress event has occurred. For fields
 * ignore these events for any of the navigation keys to ensure they don't
 * affect field content.
 * @param {Element} target The element which received the event.
 * @param {Event} evt The native keypress event.
 * @param {number} opt_manualKeycode An optional alternative keycode to force.
 * @return {boolean} True so the event default operation continues.
 */
AttributeTree.prototype.handleKeyPress = function(target, evt,
    opt_manualKeycode) {

  var keycode = su.ifInvalid(opt_manualKeycode, su.getKeyCode(evt));
  switch (keycode) {
    case su.ESCAPE_KEY:
    case su.ARROW_UP_KEY:
    case su.ARROW_DOWN_KEY:
    case su.TAB_KEY:
    case su.ENTER_KEY:
    case su.SHIFT_KEY:
      break;
    default:
      break;
  }

  return true;
};

/**
 * Responds to notifications that a keyup event has occurred.
 * @param {Element} target The element which received the event.
 * @param {Event} evt The native keyup event.
 * @param {number} opt_manualKeycode An optional alternative keycode to force.
 * @return {boolean} True so the event default operation continues.
 */
AttributeTree.prototype.handleKeyUp = function(target, evt,
    opt_manualKeycode) {

  var keycode = su.ifInvalid(opt_manualKeycode, su.getKeyCode(evt));

  switch (keycode) {
    case su.ESCAPE_KEY:
    case su.ARROW_UP_KEY:
    case su.ARROW_DOWN_KEY:
    case su.TAB_KEY:
    case su.ENTER_KEY:
    case su.SHIFT_KEY:
      su.preventDefault(evt);
      su.stopPropagation(evt);
      break;
    default:
      break;
  }

  return true;
};

/**
 * Hides informational rows related to configuration details.
 */
AttributeTree.prototype.hideAccessRows = function() {
  su.hide('formlabel-row');
  su.hide('units-row');
  su.hide('material-units-row');
  su.hide('options-row');
};

/**
 * Hides the controls typically displayed during hover which provide access
 * to editing or deleting an attribute's details.
 */
AttributeTree.prototype.hideDetailControls = function() {
  $('details-button').style.top = '' + mgr.HIDDEN_EDITOR_TOP + 'px';
  su.hide('details-button');

  $('delete-button').style.top = '' + mgr.HIDDEN_EDITOR_TOP + 'px';
  su.hide('delete-button');
};

/**
 * Hides the details editing panel.
 * @param {boolean} opt_doSave True to cause data to be saved before closing
 * the details editing panel.
 */
AttributeTree.prototype.hideDetailPanel = function(opt_doSave) {

  this.hideEditPanels();
  su.hide('details-panel');
  su.hide('delete-button');

  this.hideAccessRows();
  su.enable('cancelButton');
  su.enable('refreshButton');
  this.highlight();

  if (opt_doSave == true) {

    var entity = su.findEntity(this.idToDetail, mgr.rootEntity);
    var attrName = this.attNameToDetail;
    var accessLevel = $('access-pulldown').value;

    comp.setAttributeAccess(entity, attrName, accessLevel);
    comp.setAttributeUnits(entity, attrName, $('units-pulldown').value);

    // If the formula units pulldown is present, then grab that value.
    if (su.isValid($('formulaunits-pulldown'))) {
      comp.setAttributeFormulaUnits(entity, attrName,
        $('formulaunits-pulldown').value);
    }

    var value = '' + comp.getAttributeValue(entity, attrName);
    comp.setAttributeValue(entity, attrName, su.unescapeHTML(value));

    // Since this is an edit action, store the refocus target as we do in
    // handleEdit().
    mgr.refocusTarget = 'value_' + this.idToDetail + '_' + attrName;
    mgr.refocusIndex = mgr.FOCUS_CURRENT;
    mgr.refocusEditor = false;

    if (attrName == 'scaletool') {
      comp.setAttributeValue(entity, attrName, mgr.calculateScaleTool());
    }

    // If the access-level is `NONE`, setAttributeFormLabel will delete the
    // label.
    var formLabel = $('formlabel-textbox').value;
    comp.setAttributeFormLabel(entity, attrName, formLabel, accessLevel);

    comp.pushAttribute(entity, attrName, 'mgr.redraw');
  }
};

/**
 * Hides the various panels which may be open as a result of an editing
 * operation.
 */
AttributeTree.prototype.hideEditPanels = function() {

  mgr.editPanel.style.top = '' + mgr.HIDDEN_EDITOR_TOP + 'px';
  mgr.editPanel.style.left = '0px';
  su.hide('list-panel');

  if (su.isValid(this.lastLabelCell)) {
    var lastClass = this.lastLabelCell.className;
    this.lastLabelCell.className = lastClass.replace(/label-selected/,
        'label');
  }

  mgr.setStatusBar(mgr.INTRO_STATUS);
};

/**
 * Responds to notification that a mouse click has occurred on an attribute.
 * The primary tasks to perform in this case are to inject attribute names
 * into formulas which are currently being edited and to update highlighting
 * as needed.
 * @param {Element} target The element which was clicked, or which
 *     should be used as if a click had occurred. This is normally provided by
 *     an onclick handler and resolves to a 'td' in those cases.
 * @param {string} entityID The entity ID for the entity whose attribute
 *     should be highlighted.
 * @param {string} attrName The name of the attribute which should be
 *     highlighted.
 */
AttributeTree.prototype.handleAttributeClick = function(target, entityID,
    attrName) {

  var reference;

  var entity = su.findEntity(entityID, mgr.rootEntity);
  var attr = comp.getAttribute(entity, attrName);
  var field = $('edit-field');

  var last = su.ifAbsent(this.lastAttributeSelected, 'label', null);

  // When we're editing a formula our job is to inject the currently selected
  // attribute's label into the formula, replacing any current selection. In
  // all other cases we simply move the highlighting to the newly selected
  // attribute's value cell.
  if (mgr.isEditing() && ((field.value.charAt(0) == '=') ||
      su.contains(mgr.FORMULA_CELL_LABELS, last))) {

    // Only process if we're changing either entity or attribute.
    if (entity != this.lastEntitySelected ||
        attr != this.lastAttributeSelected) {

      // If entity remains the same we don't want to qualify with a leading
      // entityID! prefix.
      if (entity == this.lastEntitySelected) {
        reference = comp.getAttributeLabel(entity, attrName);
      } else {
        reference = entity.name + '!' +
            comp.getAttributeLabel(entity, attrName);
      }

      // mgr.selectionTextRange was set in mgr.storeSelectionTextRange,
      // which is called in onmousedown so we can capture what the user
      // had selected BEFORE any other events for click/dblclick.
      su.replaceSelection(field, reference, mgr.selectionTextRange);

      // Adjust the editor cell so it displays properly.
      mgr.updateEditorLayout();
      mgr.floatEditorIfNecessary();
    }
  } else if (mgr.getFocusedElement() == target) {
    this.editAttributeValue(target, entityID, attrName);
  } else {
    this.hideEditPanels();
    this.highlight(target, entityID, attrName);
  }
};

/**
 * Highlights an attribute value cell to help the user keep track of the
 * current focal point for editing.
 * @param {Element} opt_target The element which was clicked, or which
 *     should be used as if a click had occurred. This is normally provided by
 *     an onclick handler and resolves to a 'td' in those cases.
 * @param {string} opt_entityID The entity ID for the entity whose attribute
 *     should be highlighted.
 * @param {string} opt_attrName The name of the attribute which should be
 *     highlighted.
 */
AttributeTree.prototype.highlight = function(opt_target, opt_entityID,
    opt_attrName) {

  // Reset the value of any previously selected element.
  mgr.resetValueCell();

  var target = opt_target || mgr.getFocusedElement();
  if (su.notValid(target)) {
    return;
  }

  if (su.notValid(opt_entityID)) {
    var entity = this.lastEntitySelected || mgr.rootEntity;
  } else {
    var entity = su.findEntity(opt_entityID, mgr.rootEntity);
  }

  if (su.notValid(entity)) {
    return;
  }

  if (su.notValid(opt_attrName)) {
    var attr = this.lastAttributeSelected;
    if (su.notValid(attr)) {
      var id = target.getAttribute('id');
      if (su.isEmpty(id)) {
        return;
      }
      var parts = mgr.parseIdIntoParts(id);
      if (parts.length < 3) {
        return;
      }
      var attrName = parts[2];
      var attr = comp.getAttribute(entity, attrName);
    }
  } else {
    var attr = comp.getAttribute(entity, opt_attrName);
  }

  if (su.notValid(attr)) {
    return;
  }

  // Clear any previous label selection.
  if (su.isValid(this.lastLabelCell)) {
    var lastClass = this.lastLabelCell.className;
    this.lastLabelCell.className = lastClass.replace(/label-selected/, 'label');
  }

  // Target may be either a value or label cell, we want to navigate to the
  // value cell, which will be the second TD inside the TR which holds both
  // the label and value.
  var ancestor = target.parentNode;
  if (su.notValid(ancestor)) {
    return;
  }

  var cell = ancestor.getElementsByTagName('TD')[1];
  if (su.notValid(cell)) {
    return;
  }

  // Update the label reference and highlighting to match the current cell.
  this.lastLabelCell = ancestor.getElementsByTagName('TD')[0];
  var lastClass = this.lastLabelCell.className;
  this.lastLabelCell.className = lastClass.replace(/label/, 'label-selected');

  // Check to make sure the element isn't a descendant of a collapsed tree.
  while (ancestor && ancestor.nodeType == Node.ELEMENT_NODE) {
    if (ancestor.className && ancestor.className.indexOf('collapsed') != -1) {
      return;
    }
    ancestor = ancestor.parentNode;
  }

  mgr.updateHighlightLayout(true);

  // Some older components may not have a label, so we can get it from the ID
  // of the cell we're on and then assign for future storage.
  if (!attr.label) {
    attr.label = cell.getAttribute('id').split('_')[2];
  }
  var label = attr.label;

  var statusStr = '<b>' + su.truncate(label, 40) + '</b> &middot; ';
  var reserved = comp.RESERVED[label.toLowerCase()];
  if (su.isValid(reserved)) {
    statusStr += su.translateString(reserved.summary);
    mgr.setStatusBar(statusStr, label);
  } else {
    statusStr += su.translateString('Custom attribute.');
    mgr.setStatusBar(statusStr, 'custom');
  }

  // Highlighting is as relevant to current focus as editing is, so once
  // we've adjusted everything from a display perspective update our context.
  mgr.setFocusedElement(target);
  this.lastEntitySelected = entity;
  this.lastAttributeSelected = attr;
  this.isEditingName = false;

  // Place the detail controls to match the overall row.
  parts = mgr.parseIdIntoParts(target.getAttribute('id'));
  this.showDetailControls(target.parentNode, parts[1], parts[2]);
};

/**
 * Refocuses on the edit field and selects all of its text. Used specifically
 * when the user types an incorrect name and we ask them to try again.
 */
AttributeTree.prototype.refocusAfterNamingError = function() {

  // If the user pressed Tab to enter/complete the naming/renaming process
  // we have to stop it from moving to the value cell. If not then we're ok
  // since the editor is already in the right position.
  su.stopPropagation();
  su.preventDefault();

  window.setTimeout(function() {
    mgr.tree.isEditingName = true;
    mgr.tree.showEditPanel(mgr.getFocusedElement());
    $('edit-field').value = $('edit-field').value.replace(/[\r\n]/gi, '');
    $('edit-field').focus();
    $('edit-field').select();
    // If the lastAttributeSelected is null it means this is an Add
    // Attribute operation so we want to redisplay the list panel.
    if (mgr.tree.lastAttributeSelected == null) {
      su.show('list-panel');
    }
  }, 10);
};

/**
 * Renders the tree, placing the output in the content element defined in
 * the manager.html file.
 */
AttributeTree.prototype.render = function() {

  var arr = [];

  arr.push('<div id="', mgr.rootEntity.id, '"',
      ' class="tree-branch-root">',
      this.dumpAttributeTable(mgr.rootEntity),
      '</div>',
      '<br/><br/>');

  su.setContent('content', arr.join(''));

  // Any time we rebuild the tree's UI elements we want to refocus so any
  // previous editor or highlighting state is restored.
  mgr.refocus();

  mgr.updateEditorLayout();
};

/**
 * Sets the value of the edit field to the value provided and processes it as
 * an active edit.
 * @param {Object} value The value to set for the edit field.
 */
AttributeTree.prototype.setLabelField = function(value) {
  $('edit-field').value = value;
  this.handleEdit($('edit-field'));
};

/**
 * Displays the proper set of access rows based on accessLevel provided.
 * @param {string} accessLevel The access level, which should be "LIST",
 *     "NONE", or any other non-empty value.
 */
AttributeTree.prototype.showAccessRows = function(accessLevel) {
  // Start by hiding all current rows, clearing the slate.
  this.hideAccessRows();

  // To avoid shifting focus just because of a click on the detail button we
  // acquire the attribute as needed here.
  var entity = su.findEntity(this.idToDetail, mgr.rootEntity);
  var attrName = this.attNameToDetail;
  var attr = this.lastAttributeSelected || comp.getAttribute(entity, attrName);

  // When altering material via text the only choice is Arbitrary text, but
  // that's been tucked away in a row of its own.
  var unitID = 'units-row';
  if (su.isValid(attr)) {
    var name = attr.label || attr.id;
    if (su.notEmpty(name) && name.toLowerCase() == 'material') {
      unitID = 'material-units-row';
    }
  }

  // All levels will show the formlabel row, unless we're looking at a level
  // which turns them all off.
  if (su.notEmpty(accessLevel) && accessLevel != 'NONE') {
    su.show('formlabel-row');
    su.show(unitID);
  }

  // The remaining row(s) are displayed based on whether this is list mode.
  if (accessLevel == 'LIST') {
    su.show('options-row');
    su.hide('material-units-row');
    su.hide('units-row');
  }
  mgr.updateDetailPanelLayout();
};

/**
 * Displays the detail controls, the buttons which optionally display for an
 * attribute during highlighting.
 * @param {Element} target The target element under focus/highlight.
 * @param {string} entityID The ID of the entity containing the data.
 * @param {string} attrName The name of the specific attribute being detailed.
 */
AttributeTree.prototype.showDetailControls = function(target,
                                                    entityID,
                                                    attrName) {
  // Don't display controls when we're editing or detailing already.
  if (mgr.isEditing() || mgr.isDetailing() || mgr.isCalling()) {
    return;
  }

  this.idToDetail = entityID;
  this.attNameToDetail = attrName;

  var offset = mgr.HIGHLIGHT_EDIT_OFFSET - mgr.scrollPanel.scrollTop;

  // Show the Open Details Panel button.
  var elem = $('details-button');
  su.show(elem);
  elem.style.top = su.elementY(target) - offset + 2;
  elem.style.left = su.elementX(target) + su.elementWidth(target) -
      su.elementWidth('details-button');

  // Show the Delete This Attribute button.
  elem = $('delete-button');
  su.show(elem);
  elem.style.top = su.elementY(target) - offset;
  elem.style.left = su.elementX(target) - su.elementWidth('delete-button');
};

/**
 * Show the detail editing panel for the currently selected entity/attribute.
 */
AttributeTree.prototype.showDetailPanel = function() {
  var label;
  var unitGroup;
  var selected;

  var entity = su.findEntity(this.idToDetail, mgr.rootEntity);
  var attrName = this.attNameToDetail;

  var value = comp.getAttributeValue(entity, attrName);
  var formula = comp.getAttributeFormula(entity, attrName);
  var access = comp.getAttributeAccess(entity, attrName);

  // Which options appear for sharing an attribute depends on the attribute
  // itself. Metadata attributes are always visible. Attributes with live
  // values cannot be edited with a text box. And "behavior" attributes are
  // never visible (unless it's materials, in which case it is.)
  var isMetaDataAttribute = false;
  var hasLiveValue = false;
  var attr = comp.RESERVED[attrName];

  var arr = [];
  arr.push('<div id="details-sub-panel" class="details-sub-panel">',
      '<form name="details" onsubmit="return false">',
      '<table class="details-table" cellspacing="0" ',
      'onkeyup="mgr.updateLayout()">',
      '<tr><td valign="top">');

  arr.push('<table border="0" cellpadding="3" width="100%" cellspacing="0" ',
      'class="default-cursor">');

  // Display our formula units pulldown.
  var pulldownHTML = [];
  var optionCount = 0;
  var attUnitGroup = '';
  var selectedUnit = comp.getAttributeFormulaUnits(entity, attrName, false);
  var selectedString;
  var unit;
  if (su.isValid(attr)) {
    attUnitGroup = attr.unitGroup;
  }
  pulldownHTML.push('<tr><td align="right" width="1%">',
      '<nobr>', su.translateString('Units:'), '</nobr>',
      '</td>',
      '<td>');

  pulldownHTML.push('<select name="formulaunits-pulldown" ',
      'id="formulaunits-pulldown"',
      ' style="width: 100%" ',
      ' onfocus="this.setAttribute(\'undo-value\', this.selectedIndex)"',
      ' onchange="mgr.handleFormulaUnitsChange(\'', entity.id, '\',\'',
      attrName, '\')">');

  // The first option in the formula units pulldown is for the "default" unit.
  var firstOptionLabel = su.translateString('Default:') + ' ';
  if (attUnitGroup == 'LENGTH' && su.isValid(comp.RESERVED[attrName])) {
    firstOptionLabel +=
        su.translateString(conv.unitsHash[comp.lengthUnits(entity)].label);
  } else {
    firstOptionLabel += su.translateString(conv.unitsHash['STRING'].label);
  }

  pulldownHTML.push('<option style="color:gray" value="DEFAULT">',
      firstOptionLabel, '</option>');

  for (var i = 0; i < conv.units.length; i++) {
    unit = conv.units[i];
    selectedString = '';
    if (unit.name == selectedUnit) {
      selectedString = 'selected="selected"';
    }
    if ((attUnitGroup == unit.group || attUnitGroup == '') &&
        unit.configOnly != true) {
      optionCount++;
      pulldownHTML.push('<option value="', unit.name, '" ', selectedString,
          '>', su.translateString(unit.label), '</option>');
    }
  }

  // Close the formula units select list and associated cell/row.
  pulldownHTML.push('</select></td></tr>');

  // If there was more than one unit that can be validly selected for this
  // attribute, then show the pulldown. Otherwise don't bother.
  if (optionCount > 1) {
    arr = arr.concat(pulldownHTML);
  }

  arr.push('<tr><td align="right" width="1%">',
      '<nobr>&nbsp;&nbsp;&nbsp;', su.translateString('Display rule:'),
      '</nobr>', '</td>', '<td>');

  arr.push('<select name="access-pulldown" id="access-pulldown" ',
      ' style="width: 100%"',
      ' onchange="', this.id, '.showAccessRows(this.value)">');

  if (su.isValid(attr)) {

    mgr.setStatusBar('<b>' + entity.name + '!' + attr.label +
      '</b> &middot; ' + su.translateString(attr.summary), attrName);

    hasLiveValue = attr.hasLiveValue;

    if (attr.group == comp.METADATA_GROUP) {
      arr.push('<option value="">', su.translateString(mgr.ACCESS[1].label),
          '</option>');
      isMetaDataAttribute = true;
    } else if ((attr.group == comp.BEHAVIORS_GROUP &&
        attrName != 'material') || attr.group == comp.FORM_DESIGN_GROUP) {
      arr.push('<option value="">', su.translateString(mgr.ACCESS[0].label),
          '</option>');
      isMetaDataAttribute = true;
    }
  } else {
    mgr.setStatusBar('<b>' + entity.name + '!' +
        comp.getAttributeLabel(entity, attrName) +
        '</b> &middot; ' + su.translateString('Custom Attribute'), attrName);
  }

  if (isMetaDataAttribute == false) {
    for (var accessID = 0; accessID < mgr.ACCESS.length; accessID++) {
      label = mgr.ACCESS[accessID].label;
      value = mgr.ACCESS[accessID].value;
      if (value == access) {
        selected = ' selected="selected" ';
      } else {
        selected = '';
      }
      arr.push('<option value="', value, '"', selected, '>',
          su.translateString(label), '</option>');
    }
  }
  // Close the access select list and associated cell/row.
  arr.push('</select></td></tr>');

  // Scale tool setup.
  if (attrName == 'scaletool') {
    arr.push('<tr>',
        '<td id="scale-tool-cell" valign="top" align="right">',
        mgr.dumpScaleToolGraphic(value), '</td>',
        '<td>',

        '<input type="checkbox" id="scaletool_1"',
        ' onclick="mgr.calculateScaleTool()"',
        mgr.ifBitIsZero(value, 1, 'checked="checked"'), '> ',
        su.translateString('Scale along red. (X)'), '<br/>',

        '<input type="checkbox" id="scaletool_2" ',
        ' onclick="mgr.calculateScaleTool()"',
        mgr.ifBitIsZero(value, 2, 'checked="checked"'), '> ',
        su.translateString('Scale along green. (Y)'), '<br/>',

        '<input type="checkbox" id="scaletool_3" ',
        ' onclick="mgr.calculateScaleTool()"',
        mgr.ifBitIsZero(value, 3, 'checked="checked"'), '> ',
        su.translateString('Scale along blue. (Z)'), '<br/>',

        '<input type="checkbox" id="scaletool_4" ',
        ' onclick="mgr.calculateScaleTool()"',
        mgr.ifBitIsZero(value, 4, 'checked="checked"'), '> ',
        su.translateString('Scale in red/blue plane. (X+Z)'), '<br/>',

        '<input type="checkbox" id="scaletool_5" ',
        ' onclick="mgr.calculateScaleTool()"',
        mgr.ifBitIsZero(value, 5, 'checked="checked"'), '> ',
        su.translateString('Scale in green/blue plane. (Y+Z)'), '<br/>',

        '<input type="checkbox" id="scaletool_6" ',
        ' onclick="mgr.calculateScaleTool()"',
        mgr.ifBitIsZero(value, 6, 'checked="checked"'), '> ',
        su.translateString('Scale in red/green plane. (X+Y)'), '<br/>',

        '<input type="checkbox" id="scaletool_7" ',
        ' onclick="mgr.calculateScaleTool()"',
        mgr.ifBitIsZero(value, 7, 'checked="checked"'), '>',
        su.translateString('Scale uniform (from corners). (XYZ)'),

        '</td></tr>');
  }

  // Output the form label editing row.
  var formLabel = su.ifEmpty(comp.getAttributeFormLabel(entity, attrName),
      comp.getAttributeLabel(entity, attrName));
  formLabel = su.unescapeHTML(formLabel);

  var formLabelPrompt = 'Display label:';

  // The onclick attribute has some special cosmetic behavior around the
  // label, as that is its tooltip.
  if (attrName == 'onclick') {
    formLabelPrompt = 'Tool tip:';
    if (formLabel == comp.getAttributeLabel(entity, attrName)) {
      formLabel = su.translateString('Click to activate.');
    }
  }

  arr.push('<tr id="formlabel-row">',
      '<td align="right"><nobr>', su.translateString(formLabelPrompt),
      '</nobr></td>',
      '<td>',
      '<input name="formlabel-textbox" id="formlabel-textbox" type="textbox" ' +
      'class="formlabel-field"',
      ' value="', formLabel, '" style="width: 100%"/>',
      '</td></tr>');

  // Output the unit selection row.
  arr.push('<tr id="units-row">',
      '<td align="right"><nobr>', su.translateString('Display in:'),
      '</nobr></td>');

  var attributeUnitGroup;
  if (su.isValid(attr)) {
    attributeUnitGroup = su.ifEmpty(attr.unitGroup, attributeUnitGroup);
  }

  arr.push('<td>',
      '<select name="units-pulldown" id="units-pulldown"',
      ' style="width: 100%">');

  var units = su.ifInvalid(comp.getAttributeUnits(entity, attrName), 'STRING');
  for (var unitID = 0; unitID < conv.units.length; unitID++) {
    label = conv.units[unitID].label;
    value = conv.units[unitID].name;

    unitGroup = conv.units[unitID].group;

    if (su.notValid(attributeUnitGroup) ||
        attributeUnitGroup == unitGroup) {
      if (value == units) {
        selected = ' selected="selected" ';
      } else {
        selected = '';
      }
      arr.push('<option value="', value, '"', selected, '>',
          su.translateString(label), '</option>');
    }
  }
  arr.push('</select></td></tr>');

  // Build a second row for material, which has its own unit requirements.
  arr.push('<tr id="material-units-row">',
      '<td align="right"><nobr>', su.translateString('Display in:'),
      '</nobr></td>');
  arr.push('<td>',
      '<select name="material-units-pulldown" id="material-units-pulldown"',
      ' style="width: 100%">');
  for (var unitID = 0; unitID < conv.units.length; unitID++) {
    value = conv.units[unitID].name;
    if (value != 'STRING') {
      continue;
    }
    label = conv.units[unitID].label;
    selected = ' selected="selected" ';
    arr.push('<option value="', value, '"', selected, '>',
        su.translateString(label), '</option>');
  }
  arr.push('</select></td></tr>');

  arr.push('<tr id="options-row">',
      '<td align="right" valign="top">&nbsp;</td>',
      '<td id="options-panel">');

  // Since the scaletool panel has more content, hide the options table.
  if (attrName != 'scaletool') {
    arr.push(this.dumpOptionsTable(entity, attrName));
  }

  // Close the options-row.
  arr.push('</td></tr>');

  // Close the overall options-table and the row it resides in.
  arr.push('</table></td></tr>');

  // Close off the outer table and options div.
  arr.push('</table></div>');

  // Create a separate div/table for the footer button arrangement.
  arr.push('<div class="details-footer"><form>',
    '<table class="details-footer-table" cellspacing="0">',
    '<tr><td valign="middle">');
  arr.push('<tr><td valign="bottom" align="center">',
      '<input type="button" value="', su.translateString('Apply'), '"',
      ' onclick="', this.id, '.hideDetailPanel(true)">',
      '<input type="button" value="', su.translateString('Cancel'), '"',
      ' onclick="', this.id + '.hideDetailPanel(false)">',
      '</td></tr>');
  arr.push('</table></form></div>');

  var html = arr.join('');
  su.setContent('details-panel', html);

  this.showAccessRows(access);

  // The onclick attribute shows its label, as that is what is shown as the
  // tooltip.
  if (attrName == 'onclick') {
    su.show('formlabel-row');
  }

  su.show('details-panel');
  mgr.updateDetailPanelLayout();
};

/**
 * Displays the editing cell, a special textarea styled to overlay the
 * underlying content being edited.
 * @param {Element} target The native element the editor should position and
 *     offer editing services for.
 */
AttributeTree.prototype.showEditPanel = function(target) {

  mgr.setEditorTarget(target);

  var tab = $('edit-field-reference-tab');

  if (su.isValid(this.lastAttributeSelected)) {
    tab.innerHTML = this.lastEntitySelected.name + '!' +
        this.lastAttributeSelected.label;
  } else {
    tab.innerHTML = '&nbsp;'
  }

  // Adjust the tab's top to offset it as needed. Note that we show it (but
  // that doesn't flush to the screen) so we're sure the computation is
  // correct and not affected by display: none.
  su.show(tab);
  var tabHeight = su.elementHeight(tab);
  su.hide(tab);
  tab.style.top = 0;

  var topY = su.elementY(target);

  // Account for border thickness on the PC edit field.
  if (su.IS_MAC == false) {
    topY -= 1;
  }

  var panel = mgr.editPanel;
  panel.style.top = topY - mgr.HIGHLIGHT_EDIT_OFFSET +
      mgr.scrollPanel.scrollTop;
  panel.setAttribute('fixedtop', '');

  panel.style.width = su.elementWidth(target);
  panel.style.height = su.elementHeight(target);
  panel.style.left = su.elementX(target);

  mgr.updateEditorLayoutTimeout();

  su.show(panel);
};

/**
 * Displays the attribute name list for selection during attribute addition.
 * @param {Object} entity The entity object we're adding an attribute for.
 */
AttributeTree.prototype.showListPanel = function(entity) {

  var stat = su.translateString(
      'Select an attribute from the list, or enter your own.');
  mgr.setStatusBar(stat, 'select');

  var arr = [];
  arr.push('<div id="list-sub-panel" class="list-sub-panel">',
      '<div>');

  var lastGroup = '';

  for (var attribute in comp.RESERVED) {

    // Only show attributes at are not already attached.
    if (comp.hasAttribute(entity, attribute)) {
      continue;
    }

    var attr = comp.RESERVED[attribute];

    // Do not show hidden attributes, and do not show metaData or form
    // design attributes if we're viewing a sub node, as those attributes
    // only make sense at the top level.
    if (attr.isHidden != true &&
      (mgr.rootEntity.id == entity.id ||
      (attr.group != comp.METADATA_GROUP &&
       attr.group != comp.FORM_DESIGN_GROUP))) {

      // Changing groups? Then output a subheading segment.
      if (attr.group != lastGroup) {

        var onClickJS = this.id + '.attachGroup(\'' + attr.group + '\')';

        var onMouseOverJS = "mgr.setStatusBar('<b>" +
            su.translateString(attr.group) + '</b> &middot; ' +
            su.translateString('Add all.') +
            "', 'add-all'); this.innerHTML='" +
            su.translateString(attr.group) +
            ' ' + su.translateString('(add all)') + "';";

        var onMouseOutJS = "mgr.setStatusBar('" +
            stat + "', 'select'); this.innerHTML='" +
            su.translateString(attr.group) + "';";

        arr.push('</div><div class="list-group"><div class="list-head" ',
            ' onclick="', onClickJS, '"',
            ' onmouseover="this.className=\'list-head-active\';',
            'this.parentNode.className=\'list-group-active\';',
            onMouseOverJS, '"',
            ' onmouseout="this.className=\'list-head\';',
            'this.parentNode.className=\'list-group\';',
            onMouseOutJS, '"',
            '>', su.translateString(attr.group), '</div>');
        lastGroup = attr.group;
      }

      onClickJS = this.id + '.setLabelField(\'' + attr.label + '\')';
      onMouseOverJS = "mgr.setStatusBar('<b>" +
          attr.label +
          '</b> &middot; ' + su.translateString(attr.summary) + "', '" +
          attribute + "');";

      arr.push('<div class="list-item"',
          ' onmouseover="this.className=\'list-item-active\';',
          onMouseOverJS, '"',
          ' onmouseout="this.className=\'list-item\';"',
          ' onclick="' + onClickJS, '"',
          '>', attr.label, '</div>');
    }
  }

  arr.push('</div><div class="list-group"><div class="list-head" ',
      ' onclick="$(\'edit-field\').select();"',
      ' onmouseover="this.className=\'list-head-active\';',
      'this.parentNode.className=\'list-group-active\';"',
      ' onmouseout="this.className=\'list-head\';',
      'this.parentNode.className=\'list-group\';"',
      '><i>', su.translateString('Or enter a custom name...'), '</i></div>');

  arr.push('</div>');

  var html = arr.join('');

  su.setContent('list-panel', html);

  // To get the list panel to position properly, move it offscreen,
  // make it visible so IE6 can get at its sizing attributes, and then
  // update its position.
  window.setTimeout(function() {
      $('list-panel').left = -6000;
      su.show('list-panel');
      mgr.updateListPanelLayout();
    }, 0);

  mgr.hideHighlight();
};

/**
 * Stores the options selected from the options panel.
 * @param {boolean} wasEditingLabel Whether the label was/is the target of the
 *     operation.
 * @param {Element} target The target element that was editing when this
 *     method was invoked.
 */
AttributeTree.prototype.storeOptions = function(wasEditingLabel, target) {

  var elem;
  var attr;

  var entity = su.findEntity(this.idToDetail, mgr.rootEntity);
  var attrName = this.attNameToDetail;
  var i = 1;
  var options = '';
  var foundEmptyLabel = false;

  // Pull the units to parse from directly out of the formulaunits pulldown if
  // it exists.
  var units;

  // If an explicit unit is selected, then use that instead of the default one.
  // This allows us to refresh the options list in the currently selected
  // units even before the change is committed.
  if (su.isValid($('formulaunits-pulldown'))) {
    units = $('formulaunits-pulldown').value;
    if (units == 'DEFAULT') {
      if (su.isValid(comp.RESERVED[attrName])) {
        if (comp.RESERVED[attrName].unitGroup == 'LENGTH') {
          units = su.ifEmpty(comp.lengthUnits(entity), units);
        }
      } else {
        units = 'STRING';
      }
    }
  } else {
    // In some of the reserved attributes, we hide the formulaunits-pulldown
    // control because it's not something that the user can change. In such a
    // case, pull the explicit formula unit for that attribute.
    units = comp.getAttributeFormulaUnits(entity, attrName, true);
  }

  target.setAttribute('undo-value', target.value);

  while (su.isValid(elem = $('option-label-' + i))) {
    var label = elem.value;
    var value = $('option-value-' + i).value;

    // If we've just tabbed off of a label for the first time, preload the
    // value cell with whatever we just typed in.
    if (wasEditingLabel &&
        value == su.translateString(mgr.DEFAULT_OPTION_VALUE)) {
      $('option-value-' + i).value = label;
      $('option-value-' + i).select();
    }

    if (value.indexOf('=') != 0 &&
        value != su.translateString(mgr.DEFAULT_OPTION_VALUE)) {
      var enteredValue = conv.parseTo(value, units);
      var baseValue = conv.toBase(enteredValue, units);
      value = '' + baseValue;
    }

    if (value.indexOf('=') != 0 && wasEditingLabel == false) {
      $('option-value-' + i).value = su.unescapeHTML(
          conv.format(conv.fromBase(value, units), units,
          mgr.DEFAULT_EDIT_DECIMAL_PLACES));
    }

    if (su.notEmpty(label) &&
        label != su.translateString(mgr.DEFAULT_OPTION_LABEL)) {

      options += '&' + escape(label) + '=' + escape(value);

      // Take a look at our current attribute value. If it's empty, then
      // let's set it to the current option value.
      if (wasEditingLabel != true) {
        var currentAttValue = comp.getAttributeValue(entity, attrName);
        if (su.isEmpty(currentAttValue)) {
          if (value.indexOf('=') == 0) {
            comp.setAttributeFormula(entity, attrName, value.substring(1));
            comp.setAttributeValue(entity, attrName, value.substring(1));
          } else {
            comp.setAttributeValue(entity, attrName, value);
          }
        }
      }
    } else if (wasEditingLabel == true) {
      foundEmptyLabel = true;
    }
    i++;
  }

  // Erase empty list by storing a single character.
  options += '&';
  comp.setAttributeOptions(entity, attrName, options);

  if (foundEmptyLabel == true) {
    su.setContent('options-panel', this.dumpOptionsTable(entity, attrName));
  }
};

/**
 * Toggles the collapse state of a particular entity level. Typically invoked
 * via a click on the heading element for that tree branch.
 * @param {Element} headElement The element which represents the root of a
 *     particular tree branch.
 * @param {String} entityID The ID of the specific entity whose data is being
 *     shown or hidden.
 */
AttributeTree.prototype.toggleCollapse = function(headElement, entityID) {

  this.hideEditPanels();
  this.hideDetailControls();

  // Make sure no highlighting is in place, we'll turn it back on after any
  // collapse has processed to ensure proper location of the highlight.
  mgr.hideHighlight();
  mgr.setFocusedElement(null);
  mgr.refocusIndex = null;
  mgr.refocusTarget = null;

  // Toggle the box display for this branch level.
  // Update the entity so it is aware of the collapse state.
  var entity = su.findEntity(entityID, mgr.rootEntity);
  var headParent = headElement.parentNode;
  if (su.notValid(entity)) {
    su.raise(su.translateString('Could not find entity: ') + entityID);
  } else if (headParent.className == 'tree-leaf-visible') {
    headParent.className = 'tree-leaf-collapsed';
    headElement.className = 'attribute-head-collapsed';
    comp.setAttributeValue(entity, '_iscollapsed', 'true');
    comp.pushAttribute(entity, '_iscollapsed');
    su.hide('add-attribute-link-' + entityID);
  } else {
    headParent.className = 'tree-leaf-visible';
    headElement.className = 'attribute-head-visible';
    comp.setAttributeValue(entity, '_iscollapsed', 'false');
    comp.pushAttribute(entity, '_iscollapsed');
    su.show('add-attribute-link-' + entityID);
  }
};

