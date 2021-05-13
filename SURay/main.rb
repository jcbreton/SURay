require 'sketchup.rb'
require_relative 'source.rb'

module JCB
  module SURay

    def self.test
        model = Sketchup.active_model

        s = Source.new("Test Source",Geom::Point3d.new(12,12,12),1)
        s.getInfo() 
        puts s.shootRay

        # i = 0
        # while i < 1000 do
        #     dir = Geom::Vector3d.new(rand*(2)-1, rand*(2)-1, rand*(2)-1)
        #     ray = [source, dir]
        #     item = model.raytest(ray, false)

        #     #puts dir

        #     entities = model.active_entities
        #     constline = entities.add_cline(source, item[0])
        #     endofline = constline.end
        #     i=i+1
        # end
    end

    unless file_loaded?(__FILE__)
      menu = UI.menu('Plugins')
      menu.add_item('Ray Test') {
        self.test
      }
      menu.add_item('Initialize S/R'){
        self.createSR
      }
      file_loaded(__FILE__)
    end

  end # module HelloCube
end # module Examples