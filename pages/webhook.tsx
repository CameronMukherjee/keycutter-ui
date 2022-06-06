import KcPage from "../component/KcPage";
import Image from "next/image";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {useEffect, useState} from "react";
import {KcDataGridUserRow} from "../types/KcUser";
import axios from "axios";

const Webhook = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [totalRows, setTotalRows] = useState(0);

  // Fetches users on page load.
  useEffect(() => {
    setIsLoading(true);

    axios.get(`http://localhost:7314/webhook?page=${pageNo}&size=${pageSize}`)
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
      <KcPage title={"Webhook Management"}>
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
                  getRowId={(row) => row.uid}
                  rowsPerPageOptions={[25, 50, 100]}
                  rowCount={totalRows}
                  pageSize={pageSize}
                  onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                  page={pageNo}
                  onPageChange={(newPage) => setPageNo(newPage)}
                  onRowClick={(row) => console.log(row)}
                  pagination
              />
          }
        </div>
      </KcPage>
  )
}

export default Webhook;