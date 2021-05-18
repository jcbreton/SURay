class Intersection 
    def initialize(point, layer)
       @point = point
       @layer = layer  
    end

    def getLayer()
        return @layer
    end

    def getPoint()
        return @point
    end
end