import React, { useState, useEffect } from "react"
import Head from 'next/head'
import {
    Button,
    Grid,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    Container,
    TextField,
    Typography,
} from '@mui/material';
import { Masonry } from '@mui/lab';
import { useRouter } from 'next/router';
import CloseIcon from '@mui/icons-material/Close';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';

import { useFormik } from "formik"
import * as Yup from "yup"

export default function () {

    let router = useRouter()

    // Add a secret message dialog box
    let [isAddingSecret, setIsAddingSecret] = useState(false)

    function closeAddSecreteDialog() {
        setIsAddingSecret(false)
    }

    // New secret message
    const validationSchema = Yup.object({
        title: Yup.string().required("Please provide a title"),
        message: Yup.string().min(10, "Message must contain at-least 10 characters").max(500, "Message must not exceed 500 characters").required("Please provide a message")
    })

    let formik = useFormik({
        initialValues: {
            title: "",
            message: ""
        },
        validationSchema,
        onSubmit: async (values) => {
            const response = await fetch(`/api/secret_message`, {
                method: "POST",
                body: JSON.stringify({ ...values }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            console.log(response)
            setToggler(!toggler)
            closeAddSecreteDialog()
        }
    })

    // Secret messages
    let [secrets, setSecrets] = useState([])
    let [toggler, setToggler] = useState(false)

    useEffect(() => {
        fetch(`/api/secret_message`)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setSecrets(data)
            })
            .catch(err => {
                console.log(err)
            })

    }, [toggler])

    // Select and view a single secret
    let [secretToView, setSecretToView] = useState()

    function fetchDetails(id) {
        console.log(id)

        fetch(`/api/secret_message/single_secret/${id}`, {
            method: 'GET'
        })
            .then(res => {
                return res.json()
            })
            .then(data => {
                console.log(data)
                setSecretToView(data)
                setIsEditingSecret(true)
            })
            .catch(err => {
                console.log(err)
            })
    }

    // View a secret message dialog box
    let [isEditingSecret, setIsEditingSecret] = useState(false)

    function closeEditSecretDialog() {
        setIsEditingSecret(false)
    }

    return <>
        <Dialog open={isEditingSecret}
            onClose={closeEditSecretDialog}
            fullWidth
            maxWidth="xs"
            className="p-1"
            style={{ overflowY: "inherit" }}
        >

            <Grid container spacing={0.5}>

                <Grid item xs={10}>
                    <DialogTitle className="p-3">Secret :</DialogTitle>
                </Grid>

                <Grid item xs={1}>
                    <div className="flex h-full items-center justify-center">
                        <CloseIcon
                            className='h-6 w-6 bg-red-600 hover:bg-red-700 rounded-full p-1 text-white cursor-pointer'
                            onClick={() => {
                                closeEditSecretDialog()
                            }}
                        />
                    </div>
                </Grid>

                <Grid item xs={1}>
                    <div className="flex h-full items-center justify-center">
                        <SaveIcon
                            className='h-6 w-6 bg-cyan-500 hover:bg-cyan-600 transition-all rounded-full p-1 text-white cursor-pointer'
                        />
                    </div>
                </Grid>
            </Grid>

            <TextField className='flex-grow m-2 mt-1'
                label="Title"
                value={secretToView?.title}
                variant="outlined"
            />

            <TextField className='flex-grow m-2 mt-1'
                label="Message"
                value={secretToView?.message}
                variant="outlined"
                multiline
                rows={10}
            />

        </Dialog>

        <Dialog open={isAddingSecret}
            onClose={closeAddSecreteDialog}
            fullWidth
            maxWidth="xs"
            className="p-1">

            <Grid container spacing={0.5}>

                <Grid item xs={10}>
                    <DialogTitle className="p-3">What would you like to say ?</DialogTitle>
                </Grid>

                <Grid item xs={1}>
                    <div className="flex h-full items-center justify-center">
                        <CloseIcon
                            className='h-6 w-6 bg-red-600 hover:bg-red-700 rounded-full p-1 text-white cursor-pointer'
                            onClick={() => {
                                closeAddSecreteDialog()
                            }}
                        />
                    </div>
                </Grid>

                <Grid item xs={1}>
                    <div className="flex h-full items-center justify-center">
                        <AddIcon
                            className='h-6 w-6 bg-cyan-500 hover:bg-cyan-600 transition-all rounded-full p-1 text-white cursor-pointer'
                            onClick={() => {
                                formik.handleSubmit()
                            }}
                        />
                    </div>
                </Grid>

            </Grid>

            <TextField className='flex-grow m-2 mt-1'
                label="Title *"
                error={Boolean(formik.touched.title && formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
                name="title"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.title}
                variant="outlined"
            />

            <TextField className='flex-grow m-2 mt-1 mb-3'
                label="Message *"
                error={Boolean(formik.touched.message && formik.errors.message)}
                helperText={formik.touched.message && formik.errors.message}
                name="message"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.message}
                multiline
                rows={7}
                variant="outlined"
            />
        </Dialog>

        <Head>
            <title>Dashboard</title>
            <meta name="description" content="Share your secrets with a server" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Container maxWidth="lg" className="pt-16 min-h-screen">
            {/* Cards */}
            <Grid container spacing={2} sx={{ p: 1 }}>

                <Grid item xs={12} container spacing={2}>

                    <Grid item lg={10} sm={10} xs={8}>
                        <Button
                            variant='outlined'
                            className='text-white bg-cyan-500 hover:bg-cyan-600 hover:border-teal-600'
                            onClick={() => {
                                setIsAddingSecret(true)
                            }}
                        > Add a secret </Button>
                    </Grid>

                    <Grid item lg={2} sm={2} xs={4}>
                        <div style={{ display: "flex", justifyContent: "space-around" }}>
                            <Button
                                variant='outlined'
                                className='text-white bg-teal-500 hover:bg-teal-600 hover:border-teal-600 ml-1'
                                onClick={async () => {
                                    await fetch(`/api/authentication/unset_tokens`)
                                    router.push("/")
                                }}
                            > Logout </Button>

                            <Button
                                variant='outlined'
                                className='text-white bg-teal-500 hover:bg-teal-600 hover:border-teal-600 ml-1'
                                onClick={async () => {
                                    await fetch(`/api/test`)
                                }}
                            > Test</Button>
                        </div>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
                        {secrets?.map((secret, i) => {
                            return <Card className="glass-card p-2 pt-1" key={secret?._id}>
                                <Grid container spacing={0.5}>

                                    <Grid item xs={9}>
                                        <h4 className='text-white text-2xl'>
                                            {secret?.title}
                                        </h4>
                                    </Grid>

                                    <Grid item xs={1.5}>
                                        <div className="flex h-full items-center justify-center">
                                            <DeleteIcon
                                                className='h-6 w-6 bg-red-600 hover:bg-red-700 transition-all rounded-full p-1 text-white cursor-pointer'
                                                onClick={() => {
                                                    fetch(`/api/secret_message/delete/${secret?._id}`, {
                                                        method: 'DELETE'
                                                    })
                                                        .then(res => res.json())
                                                        .then(data => {
                                                            console.log(data)
                                                            setToggler(!toggler)
                                                        })
                                                        .catch(err => {
                                                            console.log(err)
                                                        })
                                                }}
                                            />
                                        </div>
                                    </Grid>

                                    <Grid item xs={1.5}>
                                        <div className="flex h-full items-center justify-center">
                                            <RemoveRedEyeIcon
                                                className='h-6 w-6 bg-emerald-500 hover:bg-emerald-600 transition-all rounded-full p-1 text-white cursor-pointer'
                                                onClick={() => {
                                                    fetchDetails(secret?._id)
                                                }}
                                            />
                                        </div>
                                    </Grid>

                                </Grid>
                                <hr className="text-white opacity-40 mt-1" />

                                <CardContent className="p-2">
                                    <Typography className="text-white text-md" > {secret?.message.substring(0, 150)} {secret?.message?.length > 150 && "....."} </Typography>
                                </CardContent>
                            </Card>
                        })}
                    </Masonry>
                </Grid>
            </Grid>



        </Container>
    </>

}
