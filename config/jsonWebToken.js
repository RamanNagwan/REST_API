import jwt from "jsonwebtoken";

const generteToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" })
}

export { generteToken }
