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
