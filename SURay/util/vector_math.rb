class Vector_Math
    def self.scalar_multiply(scalar, vector)
        new_x = scalar*vector.x
        new_y = scalar*vector.y
        new_z = scalar*vector.z
        return Geom::Vector3d.new(new_x,new_y,new_z)
    end

    def self.reflection(ray_direction, normal)
        return ray_direction - Vector_Math.scalar_multiply(2*(ray_direction.dot(normal)),normal)
    end
end