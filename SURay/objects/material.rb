class Material

    # |125|250|500|1k|2k|4k|8k|

    def initialize(name, code, absorption, source)
        @name = name
        @code = code
        @absorption = absorption
        @source = source
    end

    def getAbsAtFreq(freq)
        case freq
        when 125
            return @absorption[0]
        when 250
            return @absorption[1]
        when 500
            return @absorption[2]
        when 1000
            return @absorption[3]
        when 2000
            return @absorption[4]
        when 4000
            return @absorption[5]
        when 8000
            return @absorption[6]
        else
            puts "UNKNOWN FREQUENCY"
        end
    end

    def getAbsArray
        return @absorption
    end

    def getName
        return @name
    end

    def getCode
        return @code
    end

    def getNRC
        nrc_calc = [self.getAbsAtFreq(250), self.getAbsAtFreq(500),self.getAbsAtFreq(1000),self.getAbsAtFreq(2000)]
        return nrc_calc.inject{ |sum, el| sum + el }.to_f / nrc_calc.size
    end

    def printInfo
        # DEBUG USE ONLY
        puts "Material Name: #{@material_name}"
        puts "Code: #{@material_code}" 
        puts "Source: #{@data_source}"
        puts "125: #{@absorption[0]}"
        puts "250: #{@absorption[1]}"
        puts "500: #{@absorption[2]}"
        puts "1000: #{@absorption[3]}"
        puts "2000: #{@absorption[4]}"
        puts "4000: #{@absorption[5]}"
        puts "8000: #{@absorption[6]}"
        puts "NRC: #{self.getNRC}"
    end
    
end

