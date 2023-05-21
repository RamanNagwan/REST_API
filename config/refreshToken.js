import Jwt from "jsonwebtoken";

const generateRefreshToken = (id) => {
    return Jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3d" })
}

export { generateRefreshToken }