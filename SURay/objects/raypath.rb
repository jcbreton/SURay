require_relative 'material.rb'

class Raypath
    def initialize()
        @chain = Array.new() 
    end

    def add_segment(segment)
        @chain.push(segment)
    end

    def getOrder()
        return @chain.length()-1
    end

    def arrivalenergy(initial_energy,frequency)
        energy = initial_energy
        @chain.each do |i|
            material = (i.getLayer()).getMaterial()
            energy = energy*(1-material.getAbsAtFreq(frequency))
        end
        return energy
    end

    def getInfo()
        puts "Order: #{self.getOrder()}"

        e = self.arrivalenergy(1,1000)
        puts "Arrival Energy at 1000 Hz = #{e} = #{10*Math.log10(e)} dB"
    end
end
