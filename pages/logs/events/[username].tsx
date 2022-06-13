import KcPage from "../../../component/KcPage";
import {useEffect, useState} from "react";
import axios from "axios";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import Image from "next/image";
import {useCookies} from "react-cookie";
import {useRouter} from "next/router";
import MissingImage from "../../../component/MissingImage";

const EventsByUsername = () => {
  const router = useRouter();
  const [cookies, setCookie] = useCookies(['access_token']);
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [totalRows, setTotalRows] = useState(0);

  const query = router.query;

  // Fetches users on page load.
  useEffect(() => {
    setIsLoading(true);

    axios.get(`http://localhost:7314/operations/logs/events/username/${query.username}?page=${pageNo}&size=${pageSize}`, {
      headers: {
        "Authorization": `Bearer ${cookies.access_token}`
      }
    })
    .then((res) => {
      setLogs(res.data.content);
      setTotalRows(res.data.totalSize);
      setIsLoading(false);
    })
    .catch((err) => {
      console.log(err);
      if (err.response.status === 401) {
        router.push("/");
      }
    })
  }, [pageNo, pageSize, cookies.access_token, router, query])

  const columns: GridColDef[] = [
    {
      field: 'uid',
      headerName: 'Event Log Uid',
      description: "The logs unique identifier",
      sortable: true,
      filterable: true,
      width: 300
    },
    {
      field: 'userUid',
      headerName: 'User Uid',
      description: "This is the users unique identifier",
      sortable: true,
      width: 300,
    },
    {
      field: 'username',
      headerName: 'Username (Email)',
      description: "The users username (email) within KeyCutter",
      sortable: true,
      width: 290
    },
    {
      field: 'externalReference',
      headerName: 'External Reference',
      description: "The users external reference (usually a reference to your database)",
      sortable: true,
      width: 290
    },
    {
      field: 'eventType',
      headerName: "Event Type",
      filterable: true,
      sortable: false,
      width: 300,
    },
    {
      field: "metadata",
      headerName: "Metadata",
      description: "Any other information related to this event",
      filterable: true,
      sortable: true,
      width: 300,
      valueGetter: (params) => params.row.metadata || "NONE"
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      sortable: true,
      width: 230
    }
  ];

  return (
      <KcPage title={`Event Logs: ${query.username}`}>
        {/*@ts-ignore*/}
        <div style={{height: "100%"}} align={'center'}>
          {isLoading ?
              <Image
                  src={"/loading.gif"}
                  layout={"fill"}
                  alt={"A loading animation"}/>
              :
              <>
                {logs ?
                    <DataGrid
                        paginationMode={"server"}
                        rows={logs}
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
                    :
                    <MissingImage/>
                }
              </>
          }
        </div>
      </KcPage>
  )
}

export default EventsByUsername;