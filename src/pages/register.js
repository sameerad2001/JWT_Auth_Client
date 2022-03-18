import React from 'react'
import { useRouter } from "next/router"
import Head from 'next/head';

// MUI
import Card from '@mui/material/Card';
import {
    TextField,
    styled,
    outlinedInputClasses,
    inputLabelClasses,
    Button,
    Typography
} from '@mui/material';

// Formik and YUP
import { useFormik } from "formik"
import * as Yup from "yup"

import axios from "axios"
import { API_SERVICE } from '../config/URL';

import styles from "../../styles/Auth.module.css"

// Custom styles for the MUI text field 
const StyledTextField = styled(TextField)({
    // White border when the user hovers over it and types in it
    [`&:hover .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
        borderColor: "white"
    },

    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
        borderColor: "white"
    },

    // White text when the user hovers over it and types in it
    [`&:hover .${outlinedInputClasses.input}`]: {
        color: "white"
    },

    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.input}`]: {
        color: "white"
    },

    // White label when the user hovers over it and types in it
    [`&:hover .${inputLabelClasses.outlined}`]: {
        color: "white"
    },

    [`& .${inputLabelClasses.outlined}.${inputLabelClasses.focused}`]: {
        color: "white"
    }
})

function register() {

    const Router = useRouter()

    // Yup text field validation
    const validationSchema = Yup.object({
        email: Yup.string().email("Email is invalid").required("Please provide an email"),
        password: Yup.string().min(8, "Password must contain at-least 8 characters").required("Please provide a password"),
        confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], "Passwords do not match").required("Please confirm password")
    })

    let formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            confirmPassword: ""
        },
        validationSchema,
        onSubmit: async (values) => {
            // Register the user and gain an access token
            let { email, password } = values

            axios.post(`${API_SERVICE}/register`, { email, password }, { withCredentials: true })
                .then(async (res) => {
                    // Send the raw access token to our server (in the same domain)
                    // The server will set this access token in a http only cookie 
                    try {
                        const response = await fetch(`/api/authentication/set_tokens`, {
                            method: "POST",
                            body: JSON.stringify({ ...res.data }),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })

                        console.log(response)
                        router.push("/dashboard")
                    }
                    catch (err) {
                        console.log(err)
                    }

                })
                .catch(err => { console.log(err) })
        }
    })


    return (
        <div>
            <Head>
                <title>Register</title>
                <meta name="description" content="Share your secrets with a server" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Centers the card in the page */}
            <div className='flex justify-center items-center h-screen'>

                {/* Centers the content along the row */}
                <Card className={`${styles.card}`}>
                    <h2 className='text-2xl text-white'>Register</h2>

                    {/* Stretches itself to fill parent */}
                    <div className={`${styles.inputContainer}`}>

                        <StyledTextField
                            className='flex-grow m-2'
                            label="Email"
                            error={Boolean(formik.touched.email && formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            name="email"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="email"
                            value={formik.values.email}
                            variant="outlined"
                        />

                        <StyledTextField
                            className='flex-grow m-2'
                            label="Password"
                            error={Boolean(formik.touched.password && formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            name="password"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="password"
                            value={formik.values.password}
                            variant="outlined"
                        />

                        <StyledTextField
                            className='flex-grow m-2'
                            label="Confirm Password"
                            error={Boolean(formik.touched.confirmPassword && formik.errors.confirmPassword)}
                            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                            name="confirmPassword"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="password"
                            value={formik.values.confirmPassword}
                            variant="outlined"
                        />

                        <Button
                            className={`flex-grow m-2 text-md justify-self-end mt-5 ${styles.transparentButton}`}
                            variant="contained"
                            onClick={formik.handleSubmit}
                        >
                            submit
                        </Button>

                        <Typography
                            className='self-center m-2 text-white text-opacity-70 mb-0'
                        >
                            Already have an account?{" "}
                            <span
                                className='hover:text-white underline hover:cursor-pointer'
                                onClick={() => { Router.push("/login") }}
                            >
                                Sign-In
                            </span>
                        </Typography>
                    </div>
                </Card>
            </div >
        </div >
    )
}

export default register