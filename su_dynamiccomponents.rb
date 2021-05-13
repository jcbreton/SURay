# Copyright 2013-2019, Trimble Inc

# This software is provided as an example of using the Ruby interface
# to SketchUp.

# Permission to use, copy, modify, and distribute this software for
# any purpose and without fee is hereby granted, provided that the above
# copyright notice appear in all copies.

# THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT ANY EXPRESS OR
# IMPLIED WARRANTIES, INCLUDING, WITHOUT LIMITATION, THE IMPLIED
# WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.

#-----------------------------------------------------------------------------
# Name        :   Dynamic Components Extension
# Description :   A script that loads the Dynamic Components as an
#                 extension to SketchUp
# Menu Item   :   N/A
# Context Menu:   N/A
# Usage       :   N/A
# Date        :   12/12/2019
# Type        :   N/A
#-----------------------------------------------------------------------------
require 'sketchup.rb'
require 'extensions.rb'
require 'langhandler.rb'

$dc_strings = LanguageHandler.new("dynamiccomponents.strings")

$dc_extension = SketchupExtension.new($dc_strings.GetString(
  "Dynamic Components"), "su_dynamiccomponents/ruby/dcloader")

$dc_extension.description = $dc_strings.GetString("Provides ability to " +
  "interact with specially-authored components. Dynamic Components can have " +
  "behaviors such as smart scaling, animation, and configuration. SketchUp " +
  "Pro users additionally are given the ability to create their own Dynamic " +
  "Components.")
# Version History:
# SketchUp 2015:  1.3.2
# SketchUp 2016:  1.4.1
# SketchUp 2017:  1.4.2
# SketchUp 2018:  1.5.0
# SketchUp 2019:  1.6.0
# SketchUp 2020.0: 1.7.0
# SketchUp 20201.0: 1.8.0
$dc_extension.version = "1.8.0"
$dc_extension.creator = "SketchUp"
$dc_extension.copyright = "2020, Trimble Inc."

Sketchup.register_extension $dc_extension, true
