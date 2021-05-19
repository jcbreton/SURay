class Intersection 
    def initialize(point, layer)
       @point = point
       @layer = layer  # assign false if intersection is with source or receiver
    end

    def getLayer()
        return @layer
    end

    def getPoint()
        return @point
    end
end