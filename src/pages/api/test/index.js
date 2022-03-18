import cookie from "cookie"
import { API_SERVICE } from "../../../config/URL"

export default async (req, res) => {
    if (req.method === 'POST') {

        let { data } = req.body

        res.status(200)
            .setHeader("Set-Cookie", cookie.serialize("test", `${data}`, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                sameSite: "strict",
                path: "/"
            }))
            .send({ data })
    }
    if (req.method === "GET") {
        let { cookies } = req

        await fetch(`${API_SERVICE}/test_cookies`, {
            method: "POST",
            headers: {
                'Authorization': `BEARER ${cookies.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cookies })
        })
    }
}