import KcPage from "../component/KcPage";
import Image from "next/image";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {Dispatch, FormEvent, SetStateAction, useEffect, useState} from "react";
import axios from "axios";
import {NextRouter, useRouter} from "next/router";
import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import styles from '../styles/Webhook.module.css';
import Moment from "react-moment";
import 'moment-timezone';

const Webhook = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [webhooks, setWebhooks] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [totalRows, setTotalRows] = useState(0);

  // Modal State
  const [modalViewable, setModalViewable] = useState(false);
  const [webhookInfo, setWebhookInfo] = useState({});
  const [events, setEvents] = useState<string[]>([]);

  // Fetches users on page load.
  useEffect(() => {
    setIsLoading(true);

    axios.get(`http://localhost:7314/webhook?page=${pageNo}&size=${pageSize}`)
    .then((res) => {
      console.log(res)
      setWebhooks(res.data.content);
      setTotalRows(res.data.totalSize);
      setIsLoading(false);
    })
    .catch((err) => {
      console.log(err)
    })
  }, [pageNo, pageSize])

  const handleNewRegisteredEvents = (e: FormEvent) => {
    e.preventDefault();

    const request = {
      events: events
    }
    console.log("Request: ", request)
    // @ts-ignore
    axios.put(`http://localhost:7314/webhook/register/${webhookInfo.uid}`, {events})
    .then(res => {
      console.log(res);
      router.reload();
    })
    .catch(err => {
      console.log(err);
    })
  }


  const handleDeleteWebhook = () => {
    // @ts-ignore
    axios.delete(`http://localhost:7314/webhook/${webhookInfo.uid}`)
    .then(res => {
      console.log(res)
      router.reload();
    })
    .catch(err => {
      console.log(err)
    })
  }

  const handleDisableWebhook = () => {
    // @ts-ignore
    axios.patch(`http://localhost:7314/webhook/${webhookInfo.uid}/disable`)
    .then(res => {
      console.log(res)
      router.reload();
    })
    .catch(err => {
      console.log(err)
    })
  }

  const handleEnableWebhook = () => {
    // @ts-ignore
    axios.patch(`http://localhost:7314/webhook/${webhookInfo.uid}/enable`)
    .then(res => {
      console.log(res)
      router.reload();
    })
    .catch(err => {
      console.log(err)
    })
  }

  const columns: GridColDef[] = [
    {
      field: 'uid',
      headerName: 'Webhook Uid',
      description: "The webhooks uid",
      sortable: true,
      filterable: true,
      width: 300
    },
    {
      field: 'webhookUrl',
      headerName: 'Webhook Url',
      description: "The webhooks url",
      sortable: true,
      width: 450,
    },
    {
      field: 'registeredEvents',
      headerName: 'Registered Events',
      description: "The events that will be dispatched to this webhook",
      sortable: true,
      width: 140,
      valueGetter: (params) => {
        if (params.row.registeredEvents == null) {
          return 0;
        }

        return params.row.registeredEvents.length;
      }
    },
    {
      field: 'lastDispatch',
      headerName: "Last Dispatch",
      description: "The last time a message was dispatched to this webhook",
      filterable: true,
      sortable: false,
      width: 240,
    },
    {
      field: 'isDisabled',
      headerName: 'State',
      description: "Is the webhook currently disabled or active?",
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
      <KcPage title={"Webhook Management"}>
        <div style={{height: '100%'}}>
          {isLoading ?
              <Image
                  src={"/loading.gif"}
                  layout={"fill"}
                  alt={"A loading animation"}/>
              :
              <DataGrid
                  paginationMode={"server"}
                  rows={webhooks}
                  columns={columns}
                  getRowId={(row) => row.uid}
                  rowsPerPageOptions={[25, 50, 100]}
                  rowCount={totalRows}
                  pageSize={pageSize}
                  onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                  page={pageNo}
                  onPageChange={(newPage) => setPageNo(newPage)}
                  onRowClick={(row) => {
                    setModalViewable(true);
                    setWebhookInfo(row.row);
                    setEvents(row.row.registeredEvents);
                    console.log(row.row)
                  }}
                  pagination
              />
          }
          {modalViewable && ViewWebhookModal(webhookInfo,
              router,
              handleNewRegisteredEvents,
              setModalViewable,
              events,
              setEvents,
              handleDeleteWebhook,
              handleDisableWebhook,
              handleEnableWebhook)}
        </div>
      </KcPage>
  )
}

const ViewWebhookModal = (webhookInfo: any,
                          router: NextRouter,
                          handleNewRegisteredEvents: (e: FormEvent) => void,
                          setModalViewable: Dispatch<SetStateAction<boolean>>,
                          events: string[],
                          setEvents: Dispatch<SetStateAction<string[]>>,
                          handleDeleteWebhook: () => void,
                          handleDisableWebhook: () => void,
                          handleEnableWebhook: () => void) => {

  const eventTypes = [
    'USER_CREATED',
    'USER_UPDATED',
    'USER_PASSWORD_CHANGE',
    'USER_DELETED',
    'USER_DISABLED',
    'USER_ENABLED',
    'USER_RESET_PASSWORD',
    'ROLE_APPENDED',
    'ROLE_REMOVED',
    'ROLES_REMOVED',
    'WELCOME_EMAIL_DISPATCHED',
    'FORGOTTEN_PASSWORD_EMAIL_DISPATCHED'];

  const ITEM_HEIGHT = 60;
  const ITEM_PADDING_TOP = 50;
  const menuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const handleChange = (event: SelectChangeEvent<typeof events>) => {
    const {
      target: {value},
    } = event;
    setEvents(
        // On autofill we get a stringified value.
        //@ts-ignore
        typeof value === 'string' ? value.split(',') : value,
    );
  };


  return (
      <Dialog
          fullWidth={true}
          maxWidth={"lg"}
          open={true}
          onClose={() => setModalViewable(false)}>
        {webhookInfo &&
            <>
              <DialogContent>
                <DialogContentText>
                  <Grid container>
                    {/*@ts-ignore*/}
                    <Grid item md={12} align={"right"}>
                      <ButtonGroup variant={"outlined"} size={"large"}>
                        {webhookInfo.isDisabled ?
                            <Button variant={"contained"} onClick={handleEnableWebhook}>
                              Enable Webhook
                            </Button>
                            :
                            <Button variant={"contained"} color={"error"} onClick={handleDisableWebhook}>
                              Disable Webhook
                            </Button>
                        }
                        <Button variant={"contained"} color={"error"} onClick={handleDeleteWebhook}>
                          Delete Webhook
                        </Button>
                      </ButtonGroup>
                    </Grid>
                  </Grid>
                  <Box component={"form"} style={{marginTop: 10}}>
                    <TextField
                        className={styles.textField}
                        label={"Webhook Uid"}
                        id={"webhookUid"}
                        value={webhookInfo.uid}
                        fullWidth
                        disabled
                    />
                    <TextField
                        className={styles.textField}
                        label={"URL"}
                        id={"url"}
                        value={webhookInfo.webhookUrl}
                        fullWidth
                        disabled
                    />
                    <TextField
                        className={styles.textField}
                        label={"STATE"}
                        id={"isDisabled"}
                        value={webhookInfo.isDisabled ? "DISABLED" : "ACTIVE"}
                        fullWidth
                        disabled
                    />
                    <TextField
                        className={styles.textField}
                        label={"Last Dispatch"}
                        id={"lastDispatch"}
                        value={webhookInfo.lastDispatch}
                        fullWidth
                        disabled
                    />
                    <TextField
                        className={styles.textField}
                        label={"Created At"}
                        id={"createdAt"}
                        value={webhookInfo.createdAt}
                        fullWidth
                        disabled
                    />
                  </Box>
                </DialogContentText>
                <FormControl style={{width: '100%'}}>
                  <InputLabel id="registered-events-label">
                    Events
                  </InputLabel>
                  <Select
                      labelId="registered-events-label"
                      id="registered-events-chip"
                      multiple
                      value={events || []}
                      onChange={handleChange}
                      input={<OutlinedInput id="select-multiple-chip" label="Chip"/>}
                      renderValue={(selected) => (
                          <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                            {selected.map((value) => (
                                <Chip key={value} label={value}/>
                            ))}
                          </Box>
                      )}
                      MenuProps={menuProps}>
                    {eventTypes.map((name) => (
                        <MenuItem
                            key={name}
                            value={name}>
                          {name}
                        </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Grid container style={{marginTop: 15, width: '100%'}}>
                  <Grid item md={12}>
                    <Button variant={"contained"} onClick={handleNewRegisteredEvents} style={{width: "100%"}}
                            size={"large"}>
                      Update Registered Events
                    </Button>
                  </Grid>
                </Grid>
                {/*@ts-ignore*/}
                <div align={"right"} style={{marginTop: 5}}>
                  <b>Last Dispatch: <Moment fromNow>{webhookInfo.lastDispatch}</Moment></b>
                  <br/>
                  <b>Created: <Moment fromNow>{webhookInfo.createdAt}</Moment></b>
                </div>
              </DialogContent>
            </>
        }
        <DialogActions>
          <Button variant={"outlined"} onClick={() => setModalViewable(false)}>Close</Button>
        </DialogActions>
      </Dialog>
  )
}


export default Webhook;