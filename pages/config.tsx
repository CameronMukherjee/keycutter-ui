import KcPage from "../component/KcPage";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import axios from "axios";

const Config = () => {
  const [cookies, setCookie] = useCookies(['access_token'])
  const [config, setConfig] = useState({});

  useEffect(() => {
    axios.get('http://localhost:7314/operations/config', {
      headers: {
        "Authorization": `Bearer ${cookies.access_token}`
      }
    })
    .then(res => {
      console.log('config', res.data)
      setConfig(res.data)
    })
    .catch(err => {
      console.log(err)
    })
  }, [cookies.access_token])

  return (
      <KcPage title={"Server Config"}>
        <TableContainer>
          {/*@ts-ignore*/}
          <Table sx={{minWidth: 650}} aria-label="simple table" style={{width: "50%"}} align={"center"}>
            <TableHead>
              <TableRow>
                <TableCell align={"left"}>
                  <Typography variant={"h5"}><b>Key</b></Typography>
                </TableCell>
                <TableCell align={"right"}>
                  <Typography variant={"h5"}><b>Value</b></Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {config &&
                  Object.keys(config).map((key: string) => (
                      <TableRow key={key}>
                        <TableCell align={"left"}>
                          <Typography variant={"h6"}>{key}</Typography>
                        </TableCell>
                        <TableCell align={"right"}>
                          {/*@ts-ignore/*/}
                          <Typography variant={"h6"}>{config[`${key}`].toString()}</Typography>
                        </TableCell>
                      </TableRow>
                  ))
              }
            </TableBody>
          </Table>
          {/*@ts-ignore*/}
          <div align={"center"}>
            <small>
              <i>Multiple variables have been omitted.</i> <br/>
              These variables are set on system start-up. To change them a system reboot will be needed. <br/>
              To learn more about environment variables, read the documentation provided on our <a
                href="https://github.com/hexploits/KC" style={{color: "blue"}}>GitHub Repository</a> <br/>
            </small>
          </div>
        </TableContainer>
      </KcPage>
  )
}

export default Config;