require 'sketchup.rb'

class Receiver

    def initialize(name, position, radius)
        @name = name
        @position = position
        @radius = radius 
    end

    # ray math
    def check_intersection(ray_origin, ray_direction) 
        # sphere intersection check 
       
        # does NOT check for surfaces in between ray_origin point and receiver
        # surface checking is completed in traceRay(...) function
        
        # see Architectural Acoustics (2nd edition) by Marshall Long pg 885 

        x1 = (ray_direction.dot(ray_origin-@position))**2 
        x2 = (ray_direction.dot(ray_direction))*((ray_origin-@position).dot(ray_origin-@position)-(@radius**2))
        discriminant = x1-x2

        if (discriminant > 0)
            return true
        else 
            return false
        end 
    end

    def returnDistanceToIntersection(ray_origin, ray_direction)
        if(self.check_intersection(ray_origin,ray_direction)==false)
            return false
        end

        x1 = (ray_direction.dot(ray_origin-@position))**2 
        x2 = (ray_direction.dot(ray_direction))*((ray_origin-@position).dot(ray_origin-@position)-(@radius**2))
        discriminant = x1-x2

        numeratorPlus = -ray_direction.dot(ray_origin-@position) + Math.sqrt(discriminant)
        numeratorMinus = -ray_direction.dot(ray_origin-@position) - Math.sqrt(discriminant)

        return [(numeratorPlus/(ray_direction.dot(ray_direction))).abs(), (numeratorMinus/(ray_direction.dot(ray_direction))).abs()]
    end

    # setters and getters
    def getName 
        return @name
    end

    def getPosition
        return @position
    end

    def getRadius
        return @radius
    end

    def getVolume
        return (4/3)*Math::PI*(@radius^3)
    end

end
