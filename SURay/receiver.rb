require 'sketchup.rb'

class Receiver

    def initialize(name, position, radius)
        @name = name
        @position = position
        @radius = radius 
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
