class Audio_Math

    def self.normalize(array)
        normalized_array = Array.new()
        max = array.max() 

        for x in array do
            normalized_array.push(x.to_f/max)
        end

        return normalized_array 
    end

    def self.coinflip()
        if rand() > 0.5
            return 1 
        else
            return -1
        end
    end


end
