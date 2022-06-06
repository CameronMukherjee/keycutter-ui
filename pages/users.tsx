import KcPage from "../component/KcPage";
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import Image from 'next/image';
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, Grid, List, ListItem, ListItemText, Table, TableBody, TableCell, TableHead, TableRow,
  TextField,
  Typography
} from "@mui/material";
import {KcDataGridUserRow, KcUser} from "../types/KcUser";
import styles from '../styles/Users.module.css';
import {inspect} from "util";
import Moment from "react-moment";
import 'moment-timezone';
import {router} from "next/client";
import {useRouter} from "next/router";

const Users = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [totalRows, setTotalRows] = useState(0);

  const [modalInformation, setModalInformation] = useState<KcDataGridUserRow>();
  const [modalViewable, setModalViewable] = useState(false);

  // Fetches users on page load.
  useEffect(() => {
    setIsLoading(true);

    axios.get(`http://localhost:7314/users?page=${pageNo}&size=${pageSize}`)
    .then((res) => {
      console.log(res)
      setUsers(res.data.content);
      setTotalRows(res.data.totalSize);
      setIsLoading(false);
    })
    .catch((err) => {
      console.log(err)
    })
  }, [pageNo, pageSize])

  const columns: GridColDef[] = [
    {
      field: 'userUid',
      headerName: 'User Uid',
      description: "The users unique identifier within KeyCutter",
      sortable: true,
      filterable: true,
      width: 300
    },
    {
      field: 'username',
      headerName: 'Username (Email)',
      description: "This is the users email",
      sortable: true,
      width: 290,
    },
    {
      field: 'externalReference',
      headerName: 'External Reference',
      description: "The reference to your database",
      sortable: true,
      width: 290
    },
    {
      field: 'roles',
      headerName: "Roles",
      filterable: true,
      sortable: false,
      width: 85,
      valueGetter: (params) => {
        if (params.row.roles == null) {
          return 0;
        }

        return params.row.roles.length;
      }
    },
    {
      field: 'isDisabled',
      headerName: 'State',
      description: "Is the account currently disabled or active?",
      type: 'number',
      sortable: true,
      width: 100,
      valueGetter: (params) => params.row.isDisabled ? "DISABLED" : "ACTIVE"
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      sortable: true,
      width: 230
    }
  ];

  return (
      <KcPage title={"User Management"}>
        <div style={{height: "100vh", width: "100%"}}>
          {isLoading ?
              <Image
                  src={"/loading.gif"}
                  layout={"fill"}
                  alt={"A loading animation"}/>
              :
              <DataGrid
                  paginationMode={"server"}
                  rows={users}
                  columns={columns}
                  getRowId={(row) => row.userUid}
                  rowsPerPageOptions={[25, 50, 100]}
                  rowCount={totalRows}
                  pageSize={pageSize}
                  onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                  page={pageNo}
                  onPageChange={(newPage) => setPageNo(newPage)}
                  onRowClick={(row) => {
                    setModalViewable(true);
                    // @ts-ignore
                    setModalInformation(row);
                    console.log(row);
                  }}
                  pagination
              />
          }
          {modalViewable && UserModal(modalInformation, setModalViewable)}
        </div>
      </KcPage>
  )
}

const UserModal = (user: KcDataGridUserRow | undefined, isModalViewable: Dispatch<SetStateAction<boolean>>) => {

  const router = useRouter();

  return (
      <Dialog
          fullWidth={true}
          maxWidth={"lg"}
          open={true}
          onClose={() => isModalViewable(false)}>
        {user &&
            <>
              {/*@ts-ignore*/}
              <DialogTitle className={styles.textField} align={"center"}>
                <Typography variant={"h4"}>
                  {user.row.username}
                </Typography>
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  <br/>
                  <TextField
                      className={styles.textField}
                      label={"User Uid"}
                      id={"userUid"}
                      value={user.id}
                      fullWidth
                      disabled
                  />
                  <TextField
                      className={styles.textField}
                      label={"External Reference"}
                      id={"externalReference"}
                      value={user.row.externalReference}
                      fullWidth
                      disabled
                  />
                  <TextField
                      className={styles.textField}
                      label={"State"}
                      id={"isDisabled"}
                      value={user.row.isDisabled ? "DISABLED" : "ACTIVE"}
                      fullWidth
                      disabled
                  />
                  <TextField
                      className={styles.textField}
                      label={"Roles"}
                      id={"roles"}
                      value={user.row.roles || "NONE"}
                      fullWidth
                      disabled
                  />
                  <TextField
                      className={styles.textField}
                      label={"Updated At"}
                      id={"updatedAt"}
                      value={user.row.updatedAt}
                      fullWidth
                      disabled
                  />
                  <TextField
                      className={styles.textField}
                      label={"Created At"}
                      id={"createdAt"}
                      value={user.row.createdAt}
                      fullWidth
                      disabled
                  />
                </DialogContentText>
                <Grid container spacing={2}>
                  {/*@ts-ignore*/}
                  <Grid item xs={6} align={"left"}>
                    <Button variant={"contained"} className={styles.button} onClick={() => {
                    router.push({
                      pathname: '/logs/events/[username]',
                      query: {username: user.row.username}
                    })}}>
                      View Event Logs
                    </Button>
                    <Button variant={"contained"} className={styles.button} onClick={() => {
                    router.push({
                      pathname: '/logs/login/[username]',
                      query: {username: user.row.username}
                    })}}>
                      View Login Logs
                    </Button>
                  </Grid>
                  {/*@ts-ignore*/}
                  <Grid item xs={6} align={"right"}>
                    <b>Updated: <Moment fromNow>{user.row.updatedAt}</Moment></b> <br/>
                    <b>Created: <Moment fromNow>{user.row.createdAt}</Moment></b>
                  </Grid>
                </Grid>
                {/*@ts-ignore*/}
              </DialogContent>
            </>
        }
        <DialogActions>
          <Button variant={"outlined"} onClick={() => isModalViewable(false)}>Close</Button>
        </DialogActions>
      </Dialog>
  );
}

export default Users;