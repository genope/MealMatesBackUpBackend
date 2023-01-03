import jwt from 'jsonwebtoken'
const checkToken = (req, res, next) => {
    let token = req.headers['authorization']
    console.log(token)
    if (token) {
        const tokenBody = token.slice(7)

        jwt.verify(
            tokenBody,
            process.env.ACCESS_TOKEN_SECRET_KEY,
            (err, decoded) => {
                if (err) {
                    return res.json({
                        status: false,
                        msg: 'token is invalid',
                    })
                } else {
                    req.decoded = decoded
                    next()
                }
            }
        )
    } else {
        return res.json({
            status: false,
            msg: 'token is not provided ',
        })
    }
}

export default checkToken
