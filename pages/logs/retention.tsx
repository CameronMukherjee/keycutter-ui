import KcPage from "../../component/KcPage";
import Image from "next/image";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {useRouter} from "next/router";
import {useCookies} from "react-cookie";
import {useEffect, useState} from "react";
import axios from "axios";
import MissingImage from "../../component/MissingImage";

const Retention = () => {
  const router = useRouter();
  const [cookies, setCookie] = useCookies(['access_token']);
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [totalRows, setTotalRows] = useState(0);

  // Fetches users on page load.
  useEffect(() => {
    setIsLoading(true);

    axios.get(`http://localhost:7314/operations/logs/retention?page=${pageNo}&size=${pageSize}`, {
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
  }, [pageNo, pageSize, cookies.access_token, router])

  const columns: GridColDef[] = [
    {
      field: 'uid',
      headerName: 'Retention Log Uid',
      description: "The retention logs unique identifier",
      sortable: true,
      filterable: true,
      width: 300
    },
    {
      field: 'logType',
      headerName: 'Log Type',
      description: "The logs type, typically for events or logins.",
      sortable: true,
      filterable: true,
      width: 300
    },
    {
      field: 'entitiesProcessed',
      headerName: 'Entities Processed',
      description: "The total count of entities processed.",
      sortable: true,
      width: 290
    },
    {
      field: 'strategy',
      headerName: 'Strategy',
      description: "How were these logs handled? (Archived to S3, Deleted)",
      sortable: true,
      width: 290
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      sortable: true,
      width: 230
    }
  ];

  return (
      <KcPage title={"Retention Logs"}>
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

export default Retention;