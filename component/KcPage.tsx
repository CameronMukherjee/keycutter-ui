import Head from "next/head";
import {ScriptProps} from "next/script";
import KcDrawer from "./KcDrawer";

const KcPage = ({title, children}: ScriptProps) => {
  return (
      <div style={{display: "flex"}}>
        <Head>
          <title>KeyCutter - {title}</title>
        </Head>
        <KcDrawer/>
        {children}
      </div>
  )
}

export default KcPage;