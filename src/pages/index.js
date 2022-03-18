import Head from 'next/head'
import {
  Button,
} from '@mui/material';
import { useRouter } from 'next/router';

export default function Home() {

  let router = useRouter()

  return <div>

    <Head>
      <title>Share a secret ?</title>
      <meta name="description" content="Share your secrets with a server" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <div className='flex justify-center items-center h-screen flex-col'>
      <h1 className="text-white text-2xl">
        Unprotected home page
      </h1>

      <Button
        variant='outlined'
        className='text-white'
        onClick={() => { router.push("/dashboard") }}
      > Go to dashboard </Button>
    </div>

  </div>

}
