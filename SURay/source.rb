require 'sketchup.rb'

class Source 

    def initialize(name, position, strength)
        @name = name
        @position = position 
        @strength = strength
    end

    def shootRay()
        direction = Geom::Vector3d.new(rand*(2)-1, rand*(2)-1, rand*(2)-1)
        return [[@position,direction],self.getStrengthAtDirection(direction)]
    end

    def getStrengthAtDirection(dir)
        # placeholder for directivity 
        return @strength
    end

    # set and get
    def getName
        return @name 
    end

    def getPosition
        return @position
    end

    def getStrength
        return @strength
    end

    # misc
    def getInfo
        puts "-------Source Info-------"
        puts "Name: #{@name}" 
        puts "Position: #{@position}"
        puts "Strength: #{@strength}"
    end
    
end