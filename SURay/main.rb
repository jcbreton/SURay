require 'sketchup.rb'
require_relative 'source.rb'
require_relative 'vector_math.rb'

module JCB
  module SURay

    def scalar_multiply(scalar, vector)
      new_x = scalar*vector.x
      new_y = scalar*vector.y
      new_z = scalar*vector.z
      return Geom::Vector3d.new(new_x,new_y,new_z)
    end

    def self.test
        model = Sketchup.active_model

        s = Source.new("Test Source",Geom::Point3d.new(72,275,75),1)

        i = 0
        maxOrder = 10
        num_rays = 100

        while i < num_rays do
            order = 0 
            initial_ray = s.shootRay(); 
            ray = initial_ray[0]

            entities = model.active_entities

            last_position = ray[0]
            last_direction = ray[1]

            while order < maxOrder do 
              ray_result = model.raytest(ray,false); 

              obj_idx = 0; 

              # check this...
              if !((ray_result[1])[obj_idx].is_a? Sketchup::Face)
                if(ray_result[1][obj_idx].is_a? Sketchup::ConstructionLine)
                  while (obj_idx < ray_result[1].length())
                    ray = [ray_result[0],ray[1]]
                    ray_result = model.raytest(ray,false)

                    if(ray_result[1][obj_idx].is_a? Sketchup::Face)

                    else
                      break 
                    end

                  end
                else

                  break
                end 
              end

              puts "------"
              puts ray_result[1][obj_idx]
              
              # continue ray path if intersect a construction line
              # while (ray_result[1])[obj_idx].is_a? Sketchup::ConstructionLine
              #   ray = [ray_result[0],ray[1]]
              #   ray_result = model.raytest(ray,false)
              # end
              
              raypath = entities.add_cline(last_position, ray_result[0]); 

              surface_normal = (ray_result[1])[obj_idx].normal()
              reflect_direction = last_direction - Vector_Math.scalar_multiply(2*(last_direction.dot(surface_normal)),surface_normal)
              
              order = order+1
              last_position = ray_result[0]
              last_direction = reflect_direction 

              ray = [last_position,reflect_direction]
            end

            i=i+1
        end

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