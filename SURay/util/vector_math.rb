class Vector_Math
    def self.scalar_multiply(scalar, vector)
        new_x = scalar*vector.x
        new_y = scalar*vector.y
        new_z = scalar*vector.z
        return Geom::Vector3d.new(new_x,new_y,new_z)
    end
end