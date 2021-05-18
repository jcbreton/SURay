require 'sketchup.rb'

class Layer

    def initialize(sketchup_layername,material)
        @layername = sketchup_layername
        @material = material 
    end

    def getLayerName()
        return @layername
    end
    
    def getMaterial()
        return @material
    end

end