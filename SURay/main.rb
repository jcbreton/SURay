require 'sketchup.rb'
require_relative 'objects/source.rb'
require_relative 'objects/receiver.rb'
require_relative 'util/vector_math.rb'
require_relative 'compute/raytracer.rb'

module JCB
  module SURay

    def self.is_face(ray_result)
      if ray_result[1][0].is_a? Sketchup::Face 
        return true
      else
        return false         
      end
    end

    def self.is_cline(ray_result)
      if ray_result[1][0].is_a? Sketchup::ConstructionLine
        return true
      else
        return false
      end
    end

    def self.test
      model = Sketchup.active_model
      s = Source.new("Test Source",Geom::Point3d.new(12,12,12),1)
      r = Receiver.new("Test Radius",Geom::Point3d.new(28*12,22*12,20),24)

      raytracer = Raytracer.new(model, s, r)
      
      t1 = Time.now
      
      raytracer.find_definite(1000)
      
      t2 = Time.now
      delta = t2 - t1 
      puts "Operation took #{delta} seconds."
    end

    def self.test1
        model = Sketchup.active_model

        s = Source.new("Test Source",Geom::Point3d.new(12,12,12),1)
        r = Receiver.new("Test Radius",Geom::Point3d.new(15*12,12*12,20),12)

        i = 0
        maxOrder = 10
        num_rays = 100

        int = 0

        while i < num_rays do
            order = 0 
            initial_ray = s.shootRay(); 
            ray = initial_ray[0]

            entities = model.active_entities

            last_position = ray[0]
            last_direction = ray[1]

            while order < maxOrder do 
              ray_result = model.raytest(ray,false); 

              if self.is_face(ray_result)

              else
                if(self.is_cline(ray_result))
                  while self.is_cline(ray_result) && !(self.is_face(ray_result)) do 
                    ray = [ray_result[0], ray[1]]
                    ray_result = model.raytest(ray,false);
                  end
                else
                  break 
                end
              end
             
              raypath = entities.add_cline(last_position, ray_result[0]); 

              if r.check_intersection(last_position,ray[1])
                puts "INTERSECTION DETECTED. Ray #{i}, Order #{order}"
                puts "Enter in Anything to Continue..."
                int = int+1
              end

              surface_normal = (ray_result[1])[0].normal()
              reflect_direction = last_direction - Vector_Math.scalar_multiply(2*(last_direction.dot(surface_normal)),surface_normal)
              
              order = order+1
              last_position = ray_result[0]
              last_direction = reflect_direction 

              ray = [last_position,reflect_direction]
            end
            i=i+1
        end

        puts "TOTAL INTERSECTIONS: #{int}"

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