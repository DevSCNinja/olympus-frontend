import { useSelector } from "react-redux";
import {
  Paper,
  Grid,
  Typography,
  Box,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Zoom,
} from "@material-ui/core";
import { BondTableData, BondDataCard } from "./BondRow";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { trim } from "../../helpers";
import useProBonds from "../../hooks/ProBonds";
import "./plutus.scss";

function ViewtusPlutus() {
  const bonds = useProBonds();
  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query
  const isVerySmallScreen = useMediaQuery("(max-width: 420px)");

  const totalPurchased = 2943;
  const totalLiquidity = 30202292;

  return (
    <div id="plutus-view">
      <Zoom in={true}>
        <Paper className="ohm-card">
          <Box className="card-header">
            <Typography variant="h5">Plutus (1,1)</Typography>
          </Box>

          <Grid container item xs={12} style={{ margin: "10px 0px 20px" }} className="bond-hero">
            <Grid item xs={6} className={`total-purchased`}>
              <Box textAlign={`${isVerySmallScreen ? "right" : "center"}`}>
                <Typography variant="h5" color="textSecondary">
                  Bonds Purchased
                </Typography>
                <Typography variant="h4">{totalPurchased}</Typography>
              </Box>
            </Grid>

            <Grid item xs={6} className="total-liquidity">
              <Box textAlign={`${isVerySmallScreen ? "left" : "center"}`}>
                <Typography variant="h5" color="textSecondary">
                  Total Liquidity Locked
                </Typography>
                <Typography variant="h4">
                  {totalLiquidity &&
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    }).format(totalLiquidity)}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {!isSmallScreen && (
            <Grid container item>
              <TableContainer>
                <Table aria-label="Available bonds">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Bond</TableCell>
                      <TableCell align="center">Price</TableCell>
                      <TableCell>Discount</TableCell>
                      <TableCell>Purchased</TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bonds.map(bond => (
                      <BondTableData key={bond.value} bond={bond} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}
        </Paper>
      </Zoom>

      {isSmallScreen && (
        <Box className="ohm-card-container">
          <Grid container item spacing={2}>
            {bonds.map(bond => (
              <Grid item xs={12} key={bond.value}>
                <BondDataCard key={bond.value} bond={bond} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </div>
  );
}

export default ViewtusPlutus;
