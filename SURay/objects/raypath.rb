require_relative 'material.rb'
require_relative '../util/audio_math.rb'
require 'sketchup.rb'

class Raypath
    def initialize()
        @intersections = Array.new() 
    end

    def add_segment(segment)
        @intersections.push(segment)
    end

    def getOrder()
        # subtract source intersection and receiver intersection 
        return @intersections.length()-2 
    end

    def totalLength()
        length = 0
        last = (@intersections[0]).getPoint()

        for i in 1..@intersections.length()-1
            length = length + (@intersections[i].getPoint()).distance(@intersections[i-1].getPoint())
        end

        return length
    end

    def arrivalEnergy(initial_energy,frequency)
        energy = initial_energy
        for i in 0..@intersections.length()-1
            if (@intersections[i].getLayer() != false) 
                material = (@intersections[i].getLayer()).getMaterial()
                energy = energy*(1-material.getAbsAtFreq(frequency))
            end
        end
        return energy
    end 

    def arrivalTime(sound_speed)
        # computation in SI units
        return (totalLength.to_m() / sound_speed)
    end

    def plot()
        entities = (Sketchup.active_model).active_entities
        last = (@intersections[0]).getPoint()

        for i in 1..@intersections.length()-1
            entities.add_cline(@intersections[i-1].getPoint(),@intersections[i].getPoint())
        end
    end
        
    def getInfo()
        e = self.arrivalEnergy(1,1000)
        puts "Arrival Time: #{self.arrivalTime(343)}, Arrival Energy: #{e} (#{10*Math.log10(e)}), Order: #{self.getOrder()}"
    end
end
