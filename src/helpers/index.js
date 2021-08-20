import { addresses, EPOCH_INTERVAL, BLOCK_RATE_SECONDS, BONDS, PLUTUS_BONDS } from "../constants";
import { ethers } from "ethers";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as PairContract } from "../abi/PairContract.json";
import axios from "axios";
import { abi as BondOhmDaiContract } from "../abi/bonds/OhmDaiContract.json";
import { abi as BondOhmFraxContract } from "../abi/bonds/OhmFraxContract.json";
import { abi as BondDaiContract } from "../abi/bonds/DaiContract.json";
import { abi as ReserveOhmDaiContract } from "../abi/reserves/OhmDai.json";
import { abi as ReserveOhmFraxContract } from "../abi/reserves/OhmFrax.json";
import { abi as FraxBondContract } from "../abi/bonds/FraxContract.json";
import { abi as EthBondContract } from "../abi/bonds/EthContract.json";
import { abi as CustomBondContract } from "../abi/bonds/CustomBondContract.json";

import { Box, SvgIcon } from "@material-ui/core";
import { ReactComponent as OhmImg } from "../assets/tokens/token_OHM.svg";
import { ReactComponent as SOhmImg } from "../assets/tokens/token_sOHM.svg";
import { ReactComponent as DaiImg } from "../assets/tokens/DAI.svg";
import { ReactComponent as OhmDaiImg } from "../assets/tokens/OHM-DAI.svg";
import { ReactComponent as FraxImg } from "../assets/tokens/FRAX.svg";
import { ReactComponent as OhmFraxImg } from "../assets/tokens/OHM-FRAX.svg";
import { ReactComponent as wETHImg } from "../assets/tokens/wETH.svg";
import { ReactComponent as AlcxEthImg } from "../assets/tokens/ALCX-ETH.svg";

export function isPlutusBond(bond) {
  return Object.values(PLUTUS_BONDS).indexOf(bond) > -1;
}

export function addressForBond({ bond, networkID }) {
  if (bond === BONDS.ohm_dai) {
    return addresses[networkID].BONDS.OHM_DAI;
  }
  if (bond === BONDS.dai) {
    return addresses[networkID].BONDS.DAI;
  }
  if (bond === BONDS.ohm_frax) {
    return addresses[networkID].BONDS.OHM_FRAX;
  }
  if (bond === BONDS.frax) {
    return addresses[networkID].BONDS.FRAX;
  }
  if (bond === BONDS.eth) {
    return addresses[networkID].BONDS.ETH;
  }

  if (isPlutusBond(bond)) return addresses[networkID].PLUTUS_BONDS[bond].bondContract;
}

export function addressForAsset({ bond, networkID }) {
  if (bond === BONDS.ohm_dai) {
    return addresses[networkID].RESERVES.OHM_DAI;
  }
  if (bond === BONDS.dai) {
    return addresses[networkID].RESERVES.DAI;
  }
  if (bond === BONDS.ohm_frax) {
    return addresses[networkID].RESERVES.OHM_FRAX;
  }
  if (bond === BONDS.frax) {
    return addresses[networkID].RESERVES.FRAX;
  }
  if (bond === BONDS.eth) {
    return addresses[networkID].RESERVES.ETH;
  }
}

export function addressForRedeemHelper({ networkID }) {
  return addresses[networkID].REDEEM_HELPER_ADDRESS;
}

export function isBondLP(bond) {
  return !isPlutusBond(bond) && bond.indexOf("_lp") >= 0;
}

export function lpURL(bond) {
  if (bond === BONDS.ohm_dai)
    return "https://app.sushi.com/add/0x383518188c0c6d7730d91b2c03a03c837814a899/0x6b175474e89094c44da98b954eedeac495271d0f";
  if (bond === BONDS.ohm_frax)
    return "https://app.uniswap.org/#/add/v2/0x853d955acef822db058eb8505911ed77f175b99e/0x383518188c0c6d7730d91b2c03a03c837814a899";
}

export function bondName(bond) {
  if (bond === BONDS.dai) return "DAI";
  if (bond === BONDS.ohm_dai) return "OHM-DAI SLP";
  if (bond === BONDS.ohm_frax) return "OHM-FRAX LP";
  if (bond === BONDS.frax) return "FRAX";
  if (bond == BONDS.eth) return "wETH";
}

export function plutusBondInfo({ networkID, bond }) {
  return addresses[networkID].PLUTUS_BONDS[bond];
}

export function contractForBond({ bond, networkID, provider }) {
  if (bond === BONDS.ohm_dai) {
    return new ethers.Contract(addresses[networkID].BONDS.OHM_DAI, BondOhmDaiContract, provider);
  }
  if (bond === BONDS.dai) {
    return new ethers.Contract(addresses[networkID].BONDS.DAI, BondDaiContract, provider);
  }
  if (bond === BONDS.ohm_frax) {
    return new ethers.Contract(addresses[networkID].BONDS.OHM_FRAX, BondOhmFraxContract, provider);
  }
  if (bond === BONDS.frax) {
    return new ethers.Contract(addresses[networkID].BONDS.FRAX, FraxBondContract, provider);
  }
  if (bond === BONDS.eth) {
    return new ethers.Contract(addresses[networkID].BONDS.ETH, EthBondContract, provider);
  }

  if (isPlutusBond(bond))
    return new ethers.Contract(addresses[networkID].PLUTUS_BONDS[bond].bondContract, CustomBondContract, provider);
}

export function contractForReserve({ bond, networkID, provider }) {
  if (bond === BONDS.ohm_dai) {
    return new ethers.Contract(addresses[networkID].RESERVES.OHM_DAI, ReserveOhmDaiContract, provider);
  }
  if (bond === BONDS.dai) {
    return new ethers.Contract(addresses[networkID].RESERVES.DAI, ierc20Abi, provider);
  }
  if (bond === BONDS.ohm_frax) {
    return new ethers.Contract(addresses[networkID].RESERVES.OHM_FRAX, ReserveOhmFraxContract, provider);
  }
  if (bond === BONDS.frax) {
    return new ethers.Contract(addresses[networkID].RESERVES.FRAX, ierc20Abi, provider);
  }
  if (bond === BONDS.eth) {
    return new ethers.Contract(addresses[networkID].RESERVES.ETH, ierc20Abi, provider);
  }

  if (isPlutusBond(bond))
    return new ethers.Contract(addresses[networkID].PLUTUS_BONDS[bond].principalTokenContract, ierc20Abi, provider);
}

export function contractForRedeemHelper({ networkID, provider }) {
  return new ethers.Contract(addressForRedeemHelper({ networkID }), RedeemHelperAbi, provider);
}

export async function getMarketPrice({ networkID, provider }) {
  const pairContract = new ethers.Contract(addresses[networkID].RESERVES.OHM_DAI, PairContract, provider);
  const reserves = await pairContract.getReserves();
  const marketPrice = reserves[1] / reserves[0];

  // commit('set', { marketPrice: marketPrice / Math.pow(10, 9) });
  return marketPrice;
}

export async function getTokenPrice({ token }) {
  const resp = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=alchemix&vs_currencies=usd");
  return resp.data[token].usd;
}

export function shorten(str) {
  if (str.length < 10) return str;
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export function trim(number, precision) {
  if (number == undefined) {
    number = 0;
  }
  const array = number.toString().split(".");
  if (array.length === 1) return number.toString();

  array.push(array.pop().substring(0, precision));
  const trimmedNumber = array.join(".");
  return trimmedNumber;
}

export function getRebaseBlock(currentBlock) {
  return currentBlock + EPOCH_INTERVAL - (currentBlock % EPOCH_INTERVAL);
}

export function secondsUntilBlock(startBlock, endBlock) {
  if (startBlock % EPOCH_INTERVAL === 0) {
    return 0;
  }

  const blocksAway = endBlock - startBlock;
  const secondsAway = blocksAway * BLOCK_RATE_SECONDS;

  return secondsAway;
}

export function prettyVestingPeriod(currentBlock, vestingBlock) {
  if (vestingBlock === 0) {
    return "";
  }

  const seconds = secondsUntilBlock(currentBlock, vestingBlock);
  if (seconds < 0) {
    return "Fully Vested";
  }
  return prettifySeconds(seconds);
}

export function prettifySeconds(seconds, resolution) {
  if (seconds !== 0 && !seconds) {
    return "";
  }

  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  if (resolution === "day") {
    return d + (d == 1 ? " day" : " days");
  }

  const dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
  const hDisplay = h > 0 ? h + (h == 1 ? " hr, " : " hrs, ") : "";
  const mDisplay = m > 0 ? m + (m == 1 ? " min" : " mins") : "";

  return dDisplay + hDisplay + mDisplay;
}

function getSohmTokenImage() {
  return <SvgIcon component={SOhmImg} viewBox="0 0 100 100" style={{ height: "1rem", width: "1rem" }} />;
}

export function getOhmTokenImage(w, h) {
  h !== null ? (h = `${h}px`) : "32px";
  w !== null ? (w = `${w}px`) : "32px";
  return <SvgIcon component={OhmImg} viewBox="0 0 32 32" style={{ height: h, width: w }} />;
}

function getDaiTokenImage() {
  return <SvgIcon component={DaiImg} viewBox="0 0 32 32" style={{ height: "32px", width: "32px" }} />;
}

function getFraxTokenImage() {
  return <SvgIcon component={FraxImg} viewBox="0 0 32 32" style={{ height: "32px", width: "32px" }} />;
}

function getEthTokenImage() {
  return <SvgIcon component={wETHImg} viewBox="0 0 32 32" style={{ height: "32px", width: "32px" }} />;
}

export function getTokenImage(name) {
  if (name === "ohm") return getOhmTokenImage();
  if (name === "sohm") return getSohmTokenImage();
  if (name === "dai") return getDaiTokenImage();
  if (name === "frax") return getFraxTokenImage();
  if (name === "eth") return getEthTokenImage();
}

export function getPairImage(name) {
  if (name.indexOf("dai") >= 0)
    return <SvgIcon component={OhmDaiImg} viewBox="0 0 62 32" style={{ height: "32px", width: "62px" }} />;
  if (name.indexOf("frax") >= 0)
    return <SvgIcon component={OhmFraxImg} viewBox="0 0 62 32" style={{ height: "32px", width: "62px" }} />;
  if (name.indexOf("alcx") >= 0)
    return <SvgIcon component={AlcxEthImg} viewBox="0 0 62 32" style={{ height: "32px", width: "62px" }} />;
}

export function priceUnits(bond) {
  if (bond.indexOf("frax") >= 0)
    return <SvgIcon component={FraxImg} viewBox="0 0 32 32" style={{ height: "15px", width: "15px" }} />;
  else if (bond.indexOf("eth") >= 0) return "$";
  // <SvgIcon component={wETHImg} viewBox="0 0 32 32" style={{ height: "15px", width: "15px" }} />;
  else return <SvgIcon component={DaiImg} viewBox="0 0 32 32" style={{ height: "15px", width: "15px" }} />;
}

export function setAll(state, properties) {
  const props = Object.keys(properties);
  props.forEach(key => {
    state[key] = properties[key];
  });
}
