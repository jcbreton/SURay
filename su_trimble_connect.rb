# Copyright 2018-2020 Trimble Inc.

require 'sketchup.rb'
require 'extensions.rb'
require 'langhandler.rb'

module Trimble
  module TrimbleConnect

    # Put translation object where the extension can find it. We assign it to a
    # constant so it's accessible from child modules and classes.
    # noinspection RubyConstantNamingConvention
    LH = LanguageHandler.new("trimble_connect.strings")
    # Just in case the user tries to migrate this extension to an older SketchUp version
    if Sketchup.version.to_i >= 17

      # Load the extension.
      extension_name = LH["Trimble Connect"]
      unless Sketchup.is_pro?
        extension_name += " #{LH[" (Pro Only)"]}"
      end

      path = File.dirname(__FILE__)
      path.force_encoding('UTF-8') if path.respond_to?(:force_encoding)

      loader = File.join(path, "su_trimble_connect/boot")
      extension = SketchupExtension.new(extension_name, loader)

      extension.description = LH[
          "The Trimble Connect extension allows you to reference, save and "\
          "collaborate on models directly from Trimble Connect. "\
          "Your use of the Trimble Connect extension for SketchUp is subject to "\
          "the Trimble Extension End User License Agreement which can be found "\
          "at: extensions.sketchup.com/en/trimble-extension-eula"]
      # Semantic versioning.
      #
      # Minor version does not follow SketchUp's versioning. Bump minor version
      # only on feature additions to the extension.
      #
      # Version History:
      # SketchUp 2017: 2.0.0
      # SketchUp 2018: 2.0.1
      # 2.0.2: Updated for TC Entitlements.
      # Sketchup 2019.3: 2.0.5
      # Sketchup 2020.1: 2.0.6
      # Sketchup 2021.0: 2.0.7
      extension.version = "2.0.7"
      extension.creator = "SketchUp"
      extension.copyright = "2014-2020, Trimble Inc."

      # Register the extension with Sketchup.
      Sketchup.register_extension(extension, true)
    else
      message = LH["SketchUp 2017 or newer is required to use this version of the Trimble Connect Extension. "\
        "Please disable the extension or remove it from your plugins folder."]
      UI.messagebox(message)
    end
  end # module TrimbleConnect
end # module Trimble
