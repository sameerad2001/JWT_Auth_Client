import { NextResponse } from "next/server"
import { verify } from "jsonwebtoken"
import { API_SERVICE, CLIENT_DOMAIN } from "../config/URL"

async function refreshAccessToken(refreshToken) {
    const response = await fetch(`${API_SERVICE}/refresh_access_token`, {
        method: "POST",
        headers: {
            'User-Agent': "*",
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
    })

    return response.json()
}

async function setNewAccessToken(accessToken, refreshToken) {
    // Set the new access token 
    return fetch(`${CLIENT_DOMAIN}/api/authentication/set_tokens`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify({ accessToken, refreshToken })
        body: JSON.stringify({ accessToken, refreshToken })
    })
}

// Verify the access token present in the request object
function middleware(req) {
    let { cookies, url } = req
    let { accessToken, refreshToken } = cookies

    // Check if the user is trying to access a protected route
    if (url.includes("/dashboard")) {

        // If user is not logged in return him to the index page
        if (!accessToken)
            return NextResponse.redirect(`${CLIENT_DOMAIN}/login`)

        // Verify the access token
        try {
            verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
            return NextResponse.next()
        }
        catch (err) {
            console.log(err)
            return NextResponse.redirect(`${CLIENT_DOMAIN}/login`)

            // if (!refreshToken)
            //     return NextResponse.redirect(`${CLIENT_DOMAIN}/login`)
            // else
            //     // Try to refresh the access token if verification fails
            //     refreshAccessToken(refreshToken)
            //         .then((res) => {
            //             setNewAccessToken(res.accessToken, refreshToken)
            //                 .then((response) => {
            //                     console.log("Response Headers : ")
            //                     console.log(response.headers)

            //                     const MoveToTargetURL = NextResponse.next();

            //                     const tokens = response.headers.get('set-cookie').split(", ")

            //                     // Index 0 : Access token
            //                     // Index 1 : Refresh token
            //                     MoveToTargetURL.headers.set('set-cookie', tokens[0])
            //                     MoveToTargetURL.headers.append('set-cookie', tokens[1])

            //                     console.log("\n\nRedirect Headers : ")
            //                     console.log(MoveToTargetURL.headers)

            //                     return MoveToTargetURL
            //                 })
            //                 .catch(error => {
            //                     console.log(error)
            //                     return NextResponse.redirect(`${CLIENT_DOMAIN}/login`)
            //                 })
            //         })
            //         .catch(error => {
            //             console.log(error)
            //             return NextResponse.redirect(`${CLIENT_DOMAIN}/login`)
            //         })
        }
    }

    else
        return NextResponse.next()
}

export default middleware