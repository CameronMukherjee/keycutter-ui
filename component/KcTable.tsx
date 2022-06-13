import {DataGrid, GridColDef, GridRowIdGetter} from "@mui/x-data-grid";

// Needs complete reconstructing as I have incorrectly set this up.
// FIXME - this whole thing.
const KcTable = (rows: any[],
                 columns: GridColDef<any, any, any>[],
                 getRowIdFunc: GridRowIdGetter<any>,
                 totalRows: number,
                 pageSize: number,
                 setPageSize: () => void,
                 pageNo: number,
                 setPageNo: () => void,
                 onRowClick: () => void) => {
  return (
      <>
      {rows ?
          <DataGrid
              paginationMode={"server"}
              rows={rows}
              columns={columns}
              getRowId={getRowIdFunc}
              rowsPerPageOptions={[25, 50, 100]}
              rowCount={totalRows}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              page={pageNo}
              onPageChange={setPageNo}
              onRowClick={onRowClick}
              pagination
          />
          :
          <p>No Data Available</p>
      }
      </>
  )
}

export default KcTable;