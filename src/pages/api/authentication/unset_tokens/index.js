import cookie from "cookie"
import { API_SERVICE } from "../../../../config/URL"

export default async (req, res) => {
    if (req.method === "GET") {
        let { cookies } = req
        let { refreshToken } = cookies

        try {
            // Remove refresh token from DB
            await fetch(`${API_SERVICE}/logout`, {
                method: "DELETE",
                body: JSON.stringify({ refreshToken }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            res.statusCode = 200
            res.setHeader("Set-Cookie",
                [cookie.serialize("accessToken", "", {
                    httpOnly: true,
                    // Only send cookie over https when not in dev mode
                    secure: process.env.NODE_ENV !== "development",
                    // Expired in the 1900s ==> browser will remove the cookie 
                    expires: new Date(0),
                    // Only attached to same site requests
                    sameSite: "strict",
                    // Available everywhere within the site
                    path: "/"
                }),
                cookie.serialize("refreshToken", "", {
                    httpOnly: true,
                    // Only send cookie over https when not in dev mode
                    secure: process.env.NODE_ENV !== "development",
                    // Expired in the 1900s ==> browser will remove the cookie 
                    expires: new Date(0),
                    // Only attached to same site requests
                    sameSite: "strict",
                    // Available everywhere within the site
                    path: "/"
                })])
            res.send("access and refresh tokens set")
        }
        catch (err) {
            console.log(err)
        }
    }
}