import KcPage from "../component/KcPage";
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {useEffect, useState} from "react";
import Image from 'next/image';
import axios from "axios";
import {CheckBox, DoNotDisturb} from "@mui/icons-material";

const Users = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);

  // Fetches users on page load.
  useEffect(() => {
    axios.get("http://localhost:7314/users?limit=50")
    .then((res) => {
      console.log(res)
      setUsers(res.data);
      setIsLoading(false);
    })
    .catch((err) => {
      console.log(err)
    })
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'userUid',
      headerName: ' User Uid',
      description: "The users unique identifer within KeyCutter",
      sortable: true,
      filterable: true,
      width: 290
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
      field: 'isDisabled',
      headerName: 'State',
      description: "Is the account currently disabled or active?",
      type: 'number',
      sortable: true,
      width: 90,
      valueGetter: (params) => params.row.isDisabled ? "DISABLED" : "ACTIVE"
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      sortable: true,
      width: 230,
    }
  ];

  return (
      <KcPage title={"User Management"}>
        <div style={{ height: "100vh", width: '100%' }}>
          {isLoading ?
            <Image
              src={"/loading.gif"}
              layout={"fill"}
              alt={"A loading animation"}
            />
            :
            <DataGrid
                rows={users}
                columns={columns}
                pageSize={50}
                getRowId={(row) => row.userUid}
                rowsPerPageOptions={[50, 100, 150, 500]}
                disableSelectionOnClick
            />
          }
        </div>
      </KcPage>
  )
}

export default Users;