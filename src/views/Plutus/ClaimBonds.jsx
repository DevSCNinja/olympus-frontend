import { trim } from "../../helpers";
import { useDispatch, useSelector } from "react-redux";
import { ClaimBondTableData, ClaimBondCardData } from "./BondRow";
import CardHeader from "../../components/CardHeader/CardHeader";
import { redeemAllBonds } from "../../actions/Bond.actions";

import {
  Button,
  Box,
  Link,
  Paper,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Table,
  Zoom,
} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "./plutus.scss";

function ClaimBonds({ bonds }) {
  const dispatch = useDispatch();
  const { provider, address, chainID } = useWeb3Context();
  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query

  const pendingPayout = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].pendingPayout;
  });

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const redeemAll = async () => {
    await dispatch(redeemAllBonds({ networkID: chainID, recipient: address, provider }));
  };

  return (
    <Zoom in={true}>
      <Paper className="ohm-card claim-bonds-card">
        <CardHeader title="Your Positions" />
        <Box>
          {!isSmallScreen && (
            <TableContainer>
              <Table aria-label="Claimable Plutus bonds">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Bond</TableCell>
                    <TableCell align="left">Claimable</TableCell>
                    <TableCell align="left">Pending</TableCell>
                    <TableCell align="center">Fully Vested</TableCell>
                    <TableCell align="center"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bonds.map(bond => (
                    <ClaimBondTableData key={bond.value} bond={bond} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {isSmallScreen && bonds.map(bond => <ClaimBondCardData key={bond.value} bond={bond} />)}

          <Box
            display="flex"
            justifyContent="center"
            className={`global-claim-buttons ${isSmallScreen ? "small" : ""}`}
          >
            {bonds.length > 1 && (
              <Button variant="contained" color="primary" className="transaction-button" fullWidth onClick={redeemAll}>
                Claim all
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Zoom>
  );
}

export default ClaimBonds;
