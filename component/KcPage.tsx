import Head from "next/head";
import {ScriptProps} from "next/script";
import KcDrawer from "./KcDrawer";
import {Grid, Typography} from "@mui/material";
import styles from '../styles/component/KcPage.module.css';

const KcPage = ({title, children}: ScriptProps) => {
  return (
      <div style={{display: "flex"}}>
        <Head>
          <title>KeyCutter - {title}</title>
        </Head>
        <KcDrawer/>
        <Grid container md={12}>
          <Grid item md={12} className={styles.header}>
            <h1 className={styles.title}>
              {title}
            </h1>
          </Grid>
          <Grid item md={12} className={styles.body}>
            {children}
          </Grid>
        </Grid>
      </div>
  )
}

export default KcPage;