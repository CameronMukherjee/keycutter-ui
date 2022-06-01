import {NextPage} from "next";
import {Alert, Avatar, Button, Grid, Paper, TextField} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import styles from '../styles/Login.module.css'
import {FormEvent, useState} from "react";
import axios from "axios";
import { useCookies } from 'react-cookie';
import {useRouter} from "next/router";


const Login: NextPage = () => {
  const router = useRouter();
  const [cookies, setCookie] = useCookies(['access_token', 'roles']);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    axios.post("http://localhost:7314/login",
        {
          "username": username,
          "password": password
        })
    .then((res) => {
      let expiryDate = Date.now() + (res.data.expires_in * 1000);
      const accessToken = res.data.access_token;
      const roles = res.data.roles;

      setCookie('access_token', accessToken, {path: '/', expires: new Date(expiryDate)});
      setCookie('roles', roles, {path: '/', expires: new Date(expiryDate)});

      router.push("/dashboard");
    })
    .catch((err) => {
      console.log(err.response.data.errors.error);
      setError(err.response.data.errors.error);
    })
  }

  return (
      <Grid>
        <Paper elevation={10} className={styles.paperStyle}>
          {/*@ts-ignore*/}
          <Grid align={'center'}>
            <Avatar className={styles.lockIcon}>
              <LockOutlinedIcon/>
            </Avatar>
            <h1>
              KeyCutter UI
            </h1>
          </Grid>
          {error &&
              <Alert
                  className={styles.textField}
                  severity="error">{error}!</Alert>
          }
          <form onSubmit={handleSubmit}>
            <TextField
                className={styles.textField}
                label={'Username'}
                placeholder={'Enter your username'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth required/>
            <TextField
                className={styles.textField}
                label={'Password'}
                placeholder={'Enter your password'}
                type={'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth required/>
            <Button
                className={styles.textField}
                type={'submit'}
                variant={'contained'}
                fullWidth>
              Login
            </Button>
            {/*@ts-ignore*/}
            <Grid align={'center'}>
              <small>Powered by <a href={"https://hexploits.com"}>Hexploits</a></small>
            </Grid>
          </form>
        </Paper>
      </Grid>
  )
}

export default Login;