require_relative 'layer.rb'

class Room

    def initialize(model,layers)
        @model = model
        @layers = layers 
    end

    def getModel()
        return @model
    end

    def returnLayerObject(layer_name)
        @layers.each do |l|
            if l.getLayerName()==layer_name
                return l
            end
        end 
        #invalid name
        return false 
    end

end