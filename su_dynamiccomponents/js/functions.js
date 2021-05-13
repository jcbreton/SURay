//  Copyright: Copyright 2012, Trimble Navigation Limited
//  License: All Rights Reserved.

/**
 * @fileoverview Adds the functionList object to our comp namespace (defined
 * in components.js.) Supports embedded function documentation inside the
 * SketchUp Create Options dialog panel.
 */

// Export comp namespace. See components.js for definition.
var comp = window.comp;

/**
 * This object contains names and summaries for the functions
 * that are currently supported in Dynamic Components.
 * @type {Object}
 */
comp.functionList = {
  'Math Functions': [{
      name: 'ABS (number)',
      summary: 'Returns the absolute value of a given number.'
    },{
      name: 'CEILING (number,significance)',
      summary: 'Rounds up to the nearest integer or multiple of significance.'
    },{
      name: 'DEGREES (number)',
      summary: 'Converts a given number in radians to degrees.'
    },{
      name: 'EVEN (number)',
      summary: 'Rounds a given number up to the nearest even integer.'
    },{
      name: 'EXP (number)',
      summary: 'Returns e raised to the power of a given number.'
    },{
      name: 'FLOOR (number,significance)',
      summary: 'Rounds down to the nearest integer or multiple of significance.'
    },{
      name: 'INT (number)',
      summary: 'Rounds a given number down to the nearest integer.'
    },{
      name: 'ISEVEN (number)',
      summary: 'Returns TRUE if a given value is even,or FALSE if not.'
    },{
      name: 'ISODD (number)',
      summary: 'Returns TRUE if a given value is odd,or FALSE if not.'
    },{
      name: 'LN (number)',
      summary: 'Returns natural logarithm based on constant e of a number.'
    },{
      name: 'LOG10 (number)',
      summary: 'Returns the base-10 logarithm of a given number.'
    },{
      name: 'ODD (number)',
      summary: 'Rounds a given number up to the nearest odd integer.'
    },{
      name: 'POWER (base,power)',
      summary: 'Returns a base number raised to a power.'
    },{
      name: 'PI ()',
      summary: 'Returns the value of PI.'
    },{
      name: 'RADIANS (number)',
      summary: 'Converts a given number in degrees to radians.'
    },{
      name: 'RAND ()',
      summary: 'Returns a random number between 0 and 1.'
    },{
      name: 'RANDBETWEEN (bottom,top)',
      summary: 'Returns random integer between bottom and top (inclusive).'
    },{
      name: 'ROUND (number,decimal_places)',
      summary: 'Rounds a given value to a given number of decimal places.'
    },{
      name: 'SIGN (number)',
      summary: 'Returns 1 for a positive number,-1 for negative,or 0.'
    },{
      name: 'SQRT (number)',
      summary: 'Returns the square root of a given positive number.'
    }
  ],
  'SketchUp Functions': [{
      name: 'CHOOSE (index,value1,value2,...valueN)',
      summary: 'Returns a value from a list,based on an index into that list.'
    },{
      name: 'CURRENT ("attributeName")',
      summary: 'Returns the current attribute value,as last set by the user.'
    },{
      name: 'EDGES ()',
      summary: 'Returns total ungrouped edges in current component.'
    },{
      name: 'FACEAREA ("materialName")',
      summary: 'Returns area (in square inches) painted with a given material.'
    },{
      name: 'FACES ()',
      summary: 'Returns total ungrouped faces in current component.'
    },{
      name: 'LARGEST (value1,value2,...valueN)',
      summary: 'Returns the largest of the values in a list.'
    },{
      name: 'LAT ()',
      summary: 'Returns the latitude of the current SketchUp model.'
    },{
      name: 'LNG ()',
      summary: 'Returns the longitude of the current SketchUp model.'
    },{
      name: 'NEAREST (originalValue,value1,value2,...valueN)',
      summary: 'Compares a number with a list,and returns closest match.'
    },{
      name: 'OPTIONINDEX ("attributeName")',
      summary: 'Returns selected index from an attribute\'s option list.'
    },{
      name: 'OPTIONLABEL ("attributeName")',
      summary: 'Returns selected label from an attribute\'s option list.'
    },{
      name: 'SMALLEST (value1,value2,...valueN)',
      summary: 'Returns the smallest of the values in a list.'
    },{
      name: 'SUNANGLE ()',
      summary: 'Returns the angle (in degrees) between the sun and north.'
    },{
      name: 'SUNELEVATION ()',
      summary: 'Returns the elevation (in degrees) of the sun.'
    }
  ],
  'Text Functions': [{
      name: 'CHAR (number)',
      summary: 'Converts an ASCII code between 0 and 255 to a character.'
    },{
      name: 'CODE (text)',
      summary: 'Returns the ASCII code for the first letter in some text.'
    },{
      name: 'CONCATENATE (text1,text2,...textN)',
      summary: 'Combines several text strings into one string.'
    },{
      name: 'DOLLAR (value,decimals)',
      summary: 'Formats number as currency,to 2 decimal places by default.'
    },{
      name: 'EXACT (text1,text2)',
      summary: 'Compares two strings and returns TRUE if they are identical.'
    },{
      name: 'FIND (findText,text,position)',
      summary: 'Returns the position of findText inside text.'
    },{
      name: 'LEFT (text,number)',
      summary: 'Returns the first character or characters in a text string.'
    },{
      name: 'LEN (text)',
      summary: 'Returns the length of a string including spaces.'
    },{
      name: 'LOWER (text)',
      summary: 'Converts all uppercase letters in a text string to lowercase.'
    },{
      name: 'MID (text,start,number)',
      summary: 'Returns a substring from a given start and length.'
    },{
      name: 'PROPER (text)',
      summary: 'Capitalizes the first letter in all words of a text string.'
    },{
      name: 'REPLACE (text,position,length,new)',
      summary: 'Replaces part of one text string with another.'
    },{
      name: 'REPT (text,number)',
      summary: 'Repeats a character string by a given number of copies.'
    },{
      name: 'RIGHT (text,number)',
      summary: 'Returns the last character or characters in a text string.'
    },{
      name: 'SUBSTITUTE (text,searchText,newText,occurrence)',
      summary: 'Substitutes new text for search text in a string.'
    },{
      name: 'TRIM (text)',
      summary: 'Removes spaces that are in front of a string.'
    },{
      name: 'UPPER (text)',
      summary: 'Converts all lowercase letters in a text string to uppercase.'
    },{
      name: 'VALUE (text)',
      summary: 'Converts a text string into a number.'
    }
  ],
  'Trig Functions': [{
      name: 'ACOS (number)',
      summary: 'Returns inverse cosine of a number in degrees.'
    },{
      name: 'ACOSH (number)',
      summary: 'Returns inverse hyperbolic cosine of a number in degrees.'
    },{
      name: 'ASIN (number)',
      summary: 'Returns inverse sine of a number in degrees.'
    },{
      name: 'ASINH (number)',
      summary: 'Returns inverse hyperbolic sine of a number in degrees.'
    },{
      name: 'ATAN (number)',
      summary: 'Returns inverse tangent of a number in degrees.'
    },{
      name: 'ATANH (number)',
      summary: 'Returns inverse hyperbolic tangent of a number in degrees.'
    },{
      name: 'COS (number)',
      summary: 'Returns the cosine of a number (angle in degrees).'
    },{
      name: 'COSH (number)',
      summary: 'Returns hyperbolic cosine of a number (angle in degrees).'
    },{
      name: 'SIN (number)',
      summary: 'Returns the sine of a number (angle in degrees).'
    },{
      name: 'SINH (number)',
      summary: 'Returns hyperbolic sine of a number (angle in degrees).'
    },{
      name: 'TAN (number)',
      summary: 'Returns the tangent of a number (angle in degrees).'
    },{
      name: 'TANH (number)',
      summary: 'Returns hyperbolic tangent of a number (angle in degrees).'
    }
  ],
  'Logical Functions': [{
      name: 'AND (logicalValue1,logicalValue2,...logicalValueN)',
      summary: 'Returns TRUE if all arguments are TRUE.'
    },{
      name: 'FALSE ()',
      summary: 'Returns FALSE.'
    },{
      name: 'IF (test,thenValue,elseValue)',
      summary: 'Performs a logical test,then returns one of two results.'
    },{
      name: 'NOT (logicalValue)',
      summary: 'Reverses the logical value.'
    },{
      name: 'OR (logicalValue1,logicalValue2,...logicalValueN)',
      summary: 'Returns TRUE if at least one argument is TRUE.'
    },{
      name: 'TRUE ()',
      summary: 'Returns TRUE.'
    }
  ],
  'onClick Functions': [{
      name: 'ALERT ("message")',
      summary: 'Shows an alert box with a text string.'
    },{
      name: 'ANIMATE ("attribute",state1,state2,...stateN)',
      summary: 'Animates an attribute over .5 seconds with default easing.'
    },{
      name: 'ANIMATEFAST ("attribute",state1,state2,...stateN)',
      summary: 'Animates an attribute over .25 seconds with default easing.'
    },{
      name: 'ANIMATECUSTOM ("att",time,easein,out,state1,...stateN)',
      summary: 'Animates over arbitrary time with custom easing (0-100)'
    },{
      name: 'ANIMATESLOW ("attribute",state1,state2,...stateN)',
      summary: 'Animates an attribute over 1 second with default easing.'
    },{
      name: 'GOTOSCENE ("sceneName",time,easein,easeout)',
      summary: 'Animates camera to a scene identified by name or by number.'
    },{
      name: 'REDRAW ()',
      summary: 'Redraws the component that contains this function.'
    },{
      name: 'SET ("attribute",state1,state2,...stateN)',
      summary: 'Sets a given attribute to the next value in a list.'
    }
  ],
  'Operators': [{
      name: '+',
      summary: 'Addition of numbers.'
    },{
      name: '-',
      summary: 'Subtraction of numbers.'
    },{
      name: '*',
      summary: 'Multiplication of numbers.'
    },{
      name: '/',
      summary: 'Division of numbers.'
    },{
      name: '&',
      summary: 'Concatenation of text.'
    },{
      name: '()',
      summary: 'Parenthesis (for grouping).'
    },{
      name: '&lt;',
      summary: 'Less than.'
    },{
      name: '&gt;',
      summary: 'Greater than.'
    },{
      name: '=',
      summary: 'Equal to.'
    },{
      name: '&lt;=',
      summary: 'Less than or equal to.'
    },{
      name: '&gt;=',
      summary: 'Greater than or equal to.'
    },{
      name: '&lt;&gt;',
      summary: 'Not equal to.'
    }
  ]
}
