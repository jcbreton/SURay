require 'sketchup.rb'
require_relative '../util/vector_math.rb'

class Raytracer

    def initialize(model, source, receiver)
        @model = model 
        @source = source 
        @receiver = receiver
    end

    def find_definite(rays)
        i = 0
        raypaths = Array.new()

        while(i<rays)
            dir = Geom::Vector3d.new(rand*(2)-1, rand*(2)-1, rand*(2)-1)
            path = traceRay(@source.getPosition(),dir,0,50,Raypath.new())
            if(path!=false)
                puts "found ray...#{i}"
                raypaths.push(path)
                i = i+1 
            else
            end
        end

    end

    def traceRay(origin, direction, order, maxOrder, chain)
        if (@receiver.check_intersection(origin,direction))
            return chain
        else
            if(order >= maxOrder)
                # abort 
                puts "Failed... (max order)"
                return false 
            else
                ray = [origin, direction]
                ray_result = @model.raytest(ray)

                if !(ray_result[1][0].nil?)&&(ray_result[1][0].is_a? Sketchup::Face)
                    # OK... continue
                else
                    if(ray_result[1][0].is_a? Sketchup::ConstructionLine)
                        while(ray_result[1][0].is_a? Sketchup::ConstructionLine) do
                            ray = [ray_result[0], ray[1]]
                            ray_result = @model.raytest(ray,false);
                        end
                    else
                        # abort 
                        puts "Failed... (invalid intersection)"
                        return false
                    end
                end 

                int = Intersection.new(ray_result[0],"surfaceplaceholder")
                chain.add_segment(int) 

                #entities = @model.active_entities
                #entities.add_cline(origin, ray_result[0]); 

                reflect_direction = Vector_Math.reflection(direction, ray_result[1][0].normal())

                self.traceRay(ray_result[0],reflect_direction,order+1,maxOrder,chain)
            end
        end
    end

end

class Raypath
    def initialize()
        @chain = Array.new() 
    end

    def add_segment(segment)
        @chain.push(segment)
    end
end

class Intersection 
    def initialize(point, surface)
       @point = point
       @surface = surface  
    end
end