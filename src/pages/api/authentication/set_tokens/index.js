import cookie from "cookie"

export default (req, res) => {
    if (req.method === 'POST') {
        let { accessToken, refreshToken } = req.body
        console.log("Tokens : ", req.body)

        if (!accessToken) {
            res.statusCode = 401
            res.send("access token not provided")
        }

        if (!refreshToken) {
            res.statusCode = 401
            res.send("refresh token not provided")
        }

        else {
            res.statusCode = 200
            res.setHeader("Set-Cookie", [
                cookie.serialize("accessToken", accessToken, {
                    httpOnly: true,
                    // Only send cookie over https when not in dev mode
                    secure: process.env.NODE_ENV !== "development",
                    // 1 hour
                    maxAge: 60 * 60,
                    // Only attached to same site requests
                    sameSite: "strict",
                    // Available everywhere within the site
                    path: "/"
                }),
                cookie.serialize("refreshToken", refreshToken, {
                    httpOnly: true,
                    // Only send cookie over https when not in dev mode
                    secure: process.env.NODE_ENV !== "development",
                    // Only attached to same site requests
                    sameSite: "strict",
                    // Available everywhere within the site
                    path: "/"
                })])
            res.send("access and refresh tokens set")
        }
    }
}