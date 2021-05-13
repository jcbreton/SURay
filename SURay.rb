require 'sketchup.rb'
require 'extensions.rb'

module JCB
  module SURay

    unless file_loaded?(__FILE__)
      ex = SketchupExtension.new('Ray Tracing Test', 'SURay/main.rb')
      ex.description = 'Ray Tracing Tests'
      ex.version     = '1.0.0'
      ex.copyright   = 'Jack Breton © 2021'
      ex.creator     = 'Jack Breton'
      Sketchup.register_extension(ex, true)
      file_loaded(__FILE__)
    end

  end 
end 