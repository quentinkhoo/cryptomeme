import * as React from "react";
import { useGlobal, useEffect } from "reactn";
import {
  Typography,
  Grid,
  Paper,
  Table,
  TableCell,
  IconButton,
  TableRow,
  Tooltip,
  TableHead,
  TableSortLabel,
  TableBody,
  Button,
  TablePagination,
  TextField,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { withStyles } from "@material-ui/core/styles";
import EditMemes from "./EditMemes";

const styles = (theme) => ({
  table: {
    backgroundColor: "white",
  },
  tableHead: {
    backgroundColor: "#cca677ff",
  },
});

const columnData = [
  {
    id: "MemeId",
    label: "Meme Id",
  },
  {
    id: "memeTitle",
    label: "Meme Title",
  },
  {
    id: "memeOwner",
    label: "Meme Author",
  },
  {
    id: "memePath",
    label: "Meme Path",
  },
  {
    id: "memeFlags",
    label: "Meme Flag Number",
  },
  {
    id: "memeState",
    label: "Meme Status",
  },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const MemesFlagged = (props) => {
  const { value, index, peopleParent, stopFlags, classes, ...other } = props;
  const [rows, setRows] = React.useState([]);
  const [people, setPeople] = React.useState(peopleParent);
  const [disobedientRows, setDisobedientRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [open, setOpen] = React.useState(false);
  const [selectedMeme, setMeme] = React.useState([]);
  const [userNetwork] = useGlobal("userNetwork");
  const [memeNetwork] = useGlobal("memeNetwork");
  const [pepeCoinNetwork] = useGlobal("pepeCoinNetwork");
  const [web3] = useGlobal("web3");

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

  const openModal = (meme) => {
    const targetMeme = {
      memeId: meme.memeId,
      memeTitle: meme.memeTitle,
      memeOwner: meme.memeOwner,
      memePath: meme.memePath,
      memeFlags: meme.memeFlags,
      memeStatus: meme.memeStatus,
    };
    setMeme(targetMeme);
    setOpen(true);
  };

  async function closeModal() {
    console.log("Meme Should be close");
    await fetchMemes();
    setOpen(false);
    // When we close a modal -> Check for fetching data in case of change
  }

  // Function for populate data : it's called to modify rows / disobidentrows states
  async function fetchMemes() {
    // fetch the data from contracts to have current users status
    const resMemesFlagged = [];
    const resMemesDisobediend = [];
    const resMemesApproved = [];
    async function fetchDataMemeInside(
      resMemesFlagged,
      resMemesDisobediend,
      resMemesApproved
    ) {
      // Use try / catch to prevent error when network is not loaded (when you go directly to admin page in dev mode) -> Thus global constatns are not set

      try {
        // Check networks are up to date
        console.log("Fetch Meme,this is memeNetwork: ", memeNetwork);
        console.log("Fetch Meme,this is web3: ", web3);

        // Get number of accounts to iter on it (could be improve but impossible to return array from solidity)
        const result = await web3.eth.getAccounts();
        const numOfElements = await memeNetwork.methods
          .getNumberMemes()
          .call({ from: result[0] });
        console.log("Number of memes:", numOfElements);
        // Set Rows empty
        //setRows([]);
        //setDisobedientRows([]);

        // Maybe there is a proper way however i do not find how to return dynamic array in solidity
        for (let i = 0; i < numOfElements; i++) {
          // Current user
          const elem = await memeNetwork.methods
            .memes(i)
            .call({ from: result[0] });
          console.log("This is a meme:", elem);

          // If pending or if approved and memeFlags > 0
          if (
            (elem.memeState == 2) |
            ((elem.memeState == 0) & (elem.memeFlags > 0))
          ) {
            console.log("meme should be rejected / approved", elem);
            resMemesFlagged.push(
              createDataMeme(
                elem.memeId,
                elem.memeTitle,
                elem.memeOwner,
                elem.memePath,
                elem.memeFlags,
                mapStatusMeme(elem.memeState)
              )
            );
          }
          // If meme is rejected
          else if (elem.memeState == 1) {
            console.log("meme is already rejected", elem);
            resMemesDisobediend.push(
              createDataMeme(
                elem.memeId,
                elem.memeTitle,
                elem.memeOwner,
                elem.memePath,
                elem.memeFlags,
                mapStatusMeme(elem.memeState)
              )
            );
          } else {
            console.log("meme is approved", elem);
            resMemesApproved.push(
              createDataMeme(
                elem.memeId,
                elem.memeTitle,
                elem.memeOwner,
                elem.memePath,
                elem.memeFlags,
                mapStatusMeme(elem.memeState)
              )
            );
          }
        }
      } catch (e) {
        console.log("Error in the process");
      }
    }

    // Do something with the results : await for fetch and update state
    await fetchDataMemeInside(
      resMemesFlagged,
      resMemesDisobediend,
      resMemesApproved
    );
    if (index == 2) {
      setPeople(resMemesFlagged);
    } else if (index == 3) {
      setPeople(resMemesDisobediend);
    } else if (index == 4) {
      setPeople(resMemesApproved);
    }
  }

  function mapStatusMeme(statusInt) {
    if (statusInt == 0) {
      return "Approved";
    } else if (statusInt == 1) {
      return "Rejected";
    } else if (statusInt == 2) {
      return "Pending";
    }
  }

  useEffect(() => {
    setPeople(peopleParent);
    console.log(
      "People parent have change -> We update people for printing",
      peopleParent
    );
  }, [peopleParent]);

  function createDataMeme(
    memeId,
    memeTitle,
    memeOwner,
    memePath,
    memeFlags,
    memeStatus
  ) {
    return { memeId, memeTitle, memeOwner, memePath, memeFlags, memeStatus };
  }

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, people.length - page * rowsPerPage);

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <TableHead className={classes.tableHead}>
              <TableRow>
                {columnData.map(
                  (column) => (
                    <TableCell
                      key={column.id}
                      padding={column.disablePadding ? "none" : "default"}
                      sortDirection={orderBy === column.id ? order : false}
                    >
                      <Tooltip
                        title="Sort"
                        placement="bottom-end"
                        enterDelay={300}
                      >
                        <TableSortLabel
                          active={orderBy === column.id}
                          direction={order}
                          onClick={createSortHandler(column.id)}
                        >
                          {column.label}
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                  ),
                  this
                )}
                <TableCell>Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stableSort(people, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((n) => (
                  <TableRow hover tabIndex={0} key={n.uid}>
                    <TableCell>{n.memeId}</TableCell>
                    <TableCell>{n.memeTitle}</TableCell>
                    <TableCell>{n.memeOwner}</TableCell>
                    <TableCell>{n.memePath}</TableCell>
                    <TableCell>{n.memeFlags}</TableCell>
                    <TableCell>{n.memeStatus}</TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="delete"
                        onClick={() => openModal(n)}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={people.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              "aria-label": "Previous Page",
            }}
            nextIconButtonProps={{
              "aria-label": "Next Page",
            }}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
          <EditMemes
            modalState={open}
            handleClose={closeModal}
            memeInfo={selectedMeme}
            stopFlags={stopFlags}
          />
        </div>
      )}
    </Typography>
  );
};

export default withStyles(styles, { withTheme: true })(MemesFlagged);
