import { useSelector } from "react-redux";
import { trim } from "../../helpers";
import BondLogo from "../../components/BondLogo";
import { Button, Link, Paper, Typography, TableRow, TableCell, SvgIcon, Slide } from "@material-ui/core";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { NavLink } from "react-router-dom";
import "./plutus.scss";

export function BondDataCard({ bond }) {
  // const bondPrice = useSelector(state => {
  //   return state.bonding[bond] && state.bonding[bond].bondPrice;
  // });
  // const bondDiscount = useSelector(state => {
  //   return state.bonding[bond] && state.bonding[bond].bondDiscount;
  // });
  // const bondPurchased = useSelector(state => {
  //   return state.bonding[bond] && state.bonding[bond].purchased;
  // });

  // temporary hardcoded values
  const bondPrice = 333.6942;
  const bondPurchased = 3369420;
  const bondDiscount = bond.discount;

  return (
    <Slide direction="up" in={true}>
      <Paper id={`${bond.value}--bond`} className="bond-data-card ohm-card">
        <div className="bond-pair">
          {/* <BondLogo bond={bond.value} /> */}
          <div className="bond-name">
            <Typography>{bond.name}</Typography>
            <div>
              <Link href={bond.link} target="_blank">
                <Typography variant="body1">
                  View Contract
                  <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
                </Typography>
              </Link>
            </div>
          </div>
        </div>

        <div className="data-row">
          <Typography>Price</Typography>
          <Typography>{trim(bondPrice, 2)}</Typography>
        </div>

        <div className="data-row">
          <Typography>Discount</Typography>
          <Typography>{bondDiscount && trim(bondDiscount * 100, 2)}%</Typography>
        </div>

        <div className="data-row">
          <Typography>Purchased</Typography>
          <Typography>
            {bondPurchased &&
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              }).format(bondPurchased)}
          </Typography>
        </div>
        <Link component={NavLink} to={`/bonds/${bond.value}`}>
          <Button variant="outlined" color="primary" fullWidth>
            <Typography variant="h5">Bond {bond.name}</Typography>
          </Button>
        </Link>
      </Paper>
    </Slide>
  );
}

export function BondTableData({ bond }) {
  // const bondPrice = useSelector(state => {
  //   return state.bonding[bond] && state.bonding[bond].bondPrice;
  // });
  // const bondDiscount = useSelector(state => {
  //   return state.bonding[bond] && state.bonding[bond].bondDiscount;
  // });
  // const bondPurchased = useSelector(state => {
  //   return state.bonding[bond] && state.bonding[bond].purchased;
  // });

  // temporary hardcoded values
  const bondPrice = 333.6942;
  const bondPurchased = 3369420;
  const bondDiscount = bond.discount;

  return (
    <TableRow id={`${bond.value}--bond`}>
      <TableCell align="left">
        {/* <BondLogo bond={bond.value} /> */}
        <div className="bond-name">
          <Typography variant="body1">{bond.name}</Typography>

          <Link color="primary" href={bond.link} target="_blank">
            <Typography variant="body1">
              View Contract
              <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
            </Typography>
          </Link>
        </div>
      </TableCell>
      <TableCell align="center">
        <Typography>{trim(bondPrice, 2)}</Typography>
      </TableCell>
      <TableCell>{trim(bondDiscount * 100, 2)}%</TableCell>
      <TableCell>
        {bondPurchased &&
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          }).format(bondPurchased)}
      </TableCell>
      <TableCell>
        <Link component={NavLink} to={`plutus/${bond.value}`}>
          <Button variant="outlined" color="primary">
            <Typography variant="h6">Bond</Typography>
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  );
}

//
// Claimable Bond row/card components
//

export function ClaimBondTableData({ bond }) {
  const claimable = 33;
  const pending = 11;
  const fullyVested = 1; // time left until fully vested

  async function onRedeem() {
    await dispatch(redeemBond({ address, bond, networkID: chainID, provider }));
  }

  const vestingTime = () => {
    return prettyVestingPeriod(currentBlock, bondMaturationBlock);
  };

  const vestingPeriod = () => {
    const vestingBlock = parseInt(currentBlock) + parseInt(vestingTerm);
    const seconds = secondsUntilBlock(currentBlock, vestingBlock);
    return prettifySeconds(seconds, "day");
  };

  return (
    <TableRow id={`${bond.value}--claim`}>
      <TableCell align="left" className="bond-name-cell">
        <BondLogo bond={bond.value} />
        <div className="bond-name">
          <Typography variant="body1">{bond.name}</Typography>
          <Link color="primary" href={bond.link} target="_blank">
            <Typography variant="body1">
              View Contract
              <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
            </Typography>
          </Link>
        </div>
      </TableCell>
      <TableCell align="left">{claimable}</TableCell>
      <TableCell align="left">{pending}</TableCell>
      <TableCell align="center">3 days 3 hrs</TableCell>
      <TableCell align="center">
        <Button variant="outlined" color="primary" onClick={onRedeem}>
          <Typography variant="h6">Claim</Typography>
        </Button>
      </TableCell>
    </TableRow>
  );
}

export function ClaimBondCardData({ bond }) {
  // temporary hardcoded values
  const claimable = 33; // amount of x token claimable
  const pending = 11; // amount of x token not yet claimable (still vesting)
  const fullyVested = 1; // time left until fully vested

  return (
    <Box id={`${bond.value}--claim`} className="claim-bond-data-card bond-data-card" style={{ marginBottom: "30px" }}>
      <Box className="bond-pair">
        <BondLogo bond={bond.value} />
        <Box className="bond-name">
          <Typography>{bond.name}</Typography>

          <Link href={bond.link} target="_blank">
            <Typography variant="body1">
              View Contract
              <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
            </Typography>
          </Link>
        </Box>
      </Box>

      <div className="data-row">
        <Typography>Claimable</Typography>
        <Typography>{claimable}</Typography> // should note what the payout token is in this
      </div>

      <div className="data-row">
        <Typography>Pending</Typography>
        <Typography>{pending}</Typography>
      </div>

      <div className="data-row" style={{ marginBottom: "20px" }}>
        <Typography>Fully Vested</Typography>
        <Typography>3 days 3 hrs</Typography>
      </div>
      <Box display="flex" justifyContent="space-around" alignItems="center" className="claim-bond-card-buttons">
        <Button variant="outlined" color="primary">
          <Typography variant="h5">Claim</Typography>
        </Button>
        <Button variant="outlined" color="primary">
          <Typography variant="h5">Claim and Stake</Typography>
        </Button>
      </Box>
    </Box>
  );
}
