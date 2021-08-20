import { ethers } from "ethers";
import {
  isBondLP,
  getMarketPrice,
<<<<<<< HEAD:src/actions/Bond.actions.js
  getTokenPrice,
  contractForBond,
  contractForReserve,
  addressForAsset,
  bondName,
  isPlutusBond,
  contractForRedeemHelper,
} from "../helpers";
import { addresses, Actions, BONDS, PLUTUS_BONDS } from "../constants";
import { abi as BondCalcContract } from "../abi/BondCalcContract.json";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { clearPendingTxn, fetchPendingTxns } from "./PendingTxns.actions";
import { fetchStakeSuccess } from "./Stake.actions";
import { getBalances } from "./App.actions";

export const fetchBondInProgress = () => ({
  type: Actions.FETCH_BOND_INPROGRESS,
  payload: { loading: true },
});

export const fetchBondSuccess = payload => ({
  type: Actions.FETCH_BOND_SUCCESS,
  payload: { ...payload, loading: false },
});

export const changeApproval =
  ({ bond, provider, address, networkID }) =>
  async dispatch => {
=======
  contractForBond,
  contractForReserve,
  addressForBond,
  addressForAsset,
  bondName,
} from "../helpers";
import { getBalances } from "./AccountSlice";
import { addresses, Actions, BONDS, VESTING_TERM } from "../constants";
import { abi as BondCalcContract } from "../abi/bonds/OhmDaiCalcContract.json";
import { fetchPendingTxns, clearPendingTxn } from "./PendingTxnsSlice";
import { createSlice, createSelector, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",
};

export const changeApproval = createAsyncThunk(
  "bonding/changeApproval",
  async ({ bond, provider, address, networkID }, { dispatch }) => {
>>>>>>> origin/develop:src/slices/BondSlice.js
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const signer = provider.getSigner();
    const reserveContract = contractForReserve({ bond, networkID, provider: signer });

    let approveTx;
    try {
      if (bond == BONDS.ohm_dai)
        approveTx = await reserveContract.approve(
          addresses[networkID].BONDS.OHM_DAI,
          ethers.utils.parseUnits("1000000000", "ether").toString(),
        );
      else if (bond === BONDS.ohm_frax)
        approveTx = await reserveContract.approve(
          addresses[networkID].BONDS.OHM_FRAX,
          ethers.utils.parseUnits("1000000000", "ether").toString(),
        );
      else if (bond === BONDS.dai)
        approveTx = await reserveContract.approve(
          addresses[networkID].BONDS.DAI,
          ethers.utils.parseUnits("1000000000", "ether").toString(),
        );
      else if (bond === BONDS.frax)
        // <-- added for frax
        approveTx = await reserveContract.approve(
          addresses[networkID].BONDS.FRAX,
          ethers.utils.parseUnits("1000000000", "ether").toString(),
        );
      else if (bond === BONDS.eth) {
        // <-- added for eth
        approveTx = await reserveContract.approve(
          addresses[networkID].BONDS.ETH,
          ethers.utils.parseUnits("1000000000", "ether").toString(),
        );
      }
<<<<<<< HEAD:src/actions/Bond.actions.js

      if (isPlutusBond(bond)) {
        approveTx = await reserveContract.approve(
          addresses[networkID].PLUTUS_BONDS[bond].bondContract,
          ethers.utils.parseUnits("1000000000", "ether").toString(),
        );
      }

=======
>>>>>>> origin/develop:src/slices/BondSlice.js
      dispatch(
        fetchPendingTxns({ txnHash: approveTx.hash, text: "Approving " + bondName(bond), type: "approve_" + bond }),
      );
      await approveTx.wait();
    } catch (error) {
      alert(error.message);
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }
  },
);

export const calcBondDetails = createAsyncThunk(
  "bonding/calcBondDetails",
  async ({ bond, value, provider, networkID }, { dispatch }) => {
    let amountInWei;
    if (!value || value === "") {
      amountInWei = ethers.utils.parseEther("0.0001"); // Use a realistic SLP ownership
    } else {
      amountInWei = ethers.utils.parseEther(value);
    }

    // const vestingTerm = VESTING_TERM; // hardcoded for now
    let bondPrice, bondDiscount, valuation, bondQuote, debtRatio, marketPrice;

    const bondContract = contractForBond({ bond, networkID, provider });

    const terms = await bondContract.terms();
    const maxBondPrice = await bondContract.maxPayout();

    // TODO: Need to verify that debtRatio
    if (isPlutusBond(bond)) {
      debtRatio = (await bondContract.debtRatio()) / Math.pow(10, 9);
      marketPrice = await getTokenPrice({ token: addresses[networkID].PLUTUS_BONDS[bond].payoutTokenID });

      try {
        bondPrice = await bondContract.bondPrice();
        bondDiscount = (marketPrice * Math.pow(10, 9) - bondPrice) / bondPrice; // 1 - bondPrice / (bondPrice * Math.pow(10, 9));
      } catch (e) {
        console.log("error getting bondPriceInUSD", e);
      }
    } else {
      debtRatio = (await bondContract.standardizedDebtRatio()) / Math.pow(10, 9);
      marketPrice = await getMarketPrice({ networkID, provider });

      try {
        bondPrice = await bondContract.bondPriceInUSD();
        bondDiscount = (marketPrice * Math.pow(10, 9) - bondPrice) / bondPrice; // 1 - bondPrice / (bondPrice * Math.pow(10, 9));
      } catch (e) {
        console.log("error getting bondPriceInUSD", e);
      }

      marketPrice = marketPrice / Math.pow(10, 9);
    }

    if (bond === BONDS.ohm_dai) {
      // RFV = assume 1:1 backing
      const bondCalcContract = new ethers.Contract(
        addresses[networkID].BONDINGCALC_ADDRESS,
        BondCalcContract,
        provider,
      );
      valuation = await bondCalcContract.valuation(addresses[networkID].RESERVES.OHM_DAI, amountInWei);
      bondQuote = await bondContract.payoutFor(valuation);
      bondQuote = bondQuote / Math.pow(10, 9);
    } else if (bond === BONDS.ohm_frax) {
      const bondCalcContract = new ethers.Contract(
        addresses[networkID].BONDINGCALC_ADDRESS,
        BondCalcContract,
        provider,
      );
      valuation = await bondCalcContract.valuation(addresses[networkID].RESERVES.OHM_FRAX, amountInWei);
      bondQuote = await bondContract.payoutFor(valuation);
      bondQuote = bondQuote / Math.pow(10, 9);
    } else {
      // RFV = DAI
      bondQuote = await bondContract.payoutFor(amountInWei);
      bondQuote = bondQuote / Math.pow(10, 18);
    }

    // Display error if user tries to exceed maximum.
    if (!!value && parseFloat(bondQuote) > maxBondPrice / Math.pow(10, 9)) {
      alert(
        "You're trying to bond more than the maximum payout available! The maximum bond payout is " +
          (maxBondPrice / Math.pow(10, 9)).toFixed(2).toString() +
          " OHM.",
      );
    }

    // Calculate bonds purchased
    const token = contractForReserve({ bond, networkID, provider });
    let purchased = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);

    // Value the bond
    if (isBondLP(bond)) {
      // RFV = assume 1:1 backing
      const bondCalcContract = new ethers.Contract(
        addresses[networkID].BONDINGCALC_ADDRESS,
        BondCalcContract,
        provider,
      );

      const markdown = await bondCalcContract.markdown(addressForAsset({ bond, networkID }));
      purchased = await bondCalcContract.valuation(addressForAsset({ bond, networkID }), purchased);
      purchased = (markdown / Math.pow(10, 18)) * (purchased / Math.pow(10, 9));
    } else if (bond === BONDS.eth) {
      purchased = purchased / Math.pow(10, 18);
      let ethPrice = await bondContract.assetPrice();
      ethPrice = ethPrice / Math.pow(10, 8);
      purchased = purchased * ethPrice;
    } else {
      purchased = purchased / Math.pow(10, 18);
    }

<<<<<<< HEAD:src/actions/Bond.actions.js
    return dispatch(
      fetchBondSuccess({
        bond,
        bondDiscount,
        debtRatio,
        bondQuote,
        purchased,
        vestingTerm: terms.vestingTerm,
        maxBondPrice: maxBondPrice / Math.pow(10, 9),
        bondPrice: bondPrice / Math.pow(10, 18),
        marketPrice,
      }),
    );
  };

export const calculateUserBondDetails =
  ({ address, bond, networkID, provider }) =>
  async dispatch => {
=======
    return {
      bond,
      bondDiscount,
      debtRatio,
      bondQuote,
      purchased,
      vestingTerm: Number(terms.vestingTerm),
      maxBondPrice: maxBondPrice / Math.pow(10, 9),
      bondPrice: bondPrice / Math.pow(10, 18),
      marketPrice: marketPrice / Math.pow(10, 9),
    };
  },
);

export const calculateUserBondDetails = createAsyncThunk(
  "bonding/calculateUserBondDetails",
  async ({ address, bond, networkID, provider }, { dispatch }) => {
>>>>>>> origin/develop:src/slices/BondSlice.js
    if (!address) return;

    // dispatch(fetchBondInProgress());

    // Calculate bond details.
    const bondContract = contractForBond({ bond, provider, networkID });
    const reserveContract = contractForReserve({ bond, networkID, provider });

    let interestDue, pendingPayout, bondMaturationBlock;

    const bondDetails = await bondContract.bondInfo(address);
    interestDue = bondDetails.payout / Math.pow(10, 9);
    bondMaturationBlock = +bondDetails.vesting + +bondDetails.lastBlock;
    pendingPayout = await bondContract.pendingPayoutFor(address);

    let allowance,
      balance = 0;
    if (bond === BONDS.ohm_dai) {
      allowance = await reserveContract.allowance(address, addresses[networkID].BONDS.OHM_DAI);

      balance = await reserveContract.balanceOf(address);
      balance = ethers.utils.formatUnits(balance, "ether");
    } else if (bond === BONDS.dai) {
      allowance = await reserveContract.allowance(address, addresses[networkID].BONDS.DAI);

      balance = await reserveContract.balanceOf(address);
      balance = ethers.utils.formatEther(balance);
    } else if (bond === BONDS.ohm_frax) {
      allowance = await reserveContract.allowance(address, addresses[networkID].BONDS.OHM_FRAX);

      balance = await reserveContract.balanceOf(address);
      balance = ethers.utils.formatUnits(balance, "ether");
    } else if (bond === BONDS.frax) {
      allowance = await reserveContract.allowance(address, addresses[networkID].BONDS.FRAX);

      balance = await reserveContract.balanceOf(address);
      balance = ethers.utils.formatUnits(balance, "ether");
    } else if (bond === BONDS.eth) {
      allowance = await reserveContract.allowance(address, addresses[networkID].BONDS.ETH);

      balance = await reserveContract.balanceOf(address);
      balance = ethers.utils.formatUnits(balance, "ether");
    }

<<<<<<< HEAD:src/actions/Bond.actions.js
    if (isPlutusBond(bond)) {
      allowance = await reserveContract.allowance(address, addresses[networkID].PLUTUS_BONDS[bond].bondContract);

      balance = await reserveContract.balanceOf(address);
      balance = ethers.utils.formatUnits(balance, "ether");
    }

    return dispatch(
      fetchBondSuccess({
        bond,
        allowance,
        balance,
        interestDue,
        bondMaturationBlock,
        pendingPayout: ethers.utils.formatUnits(pendingPayout, "gwei"),
      }),
    );
  };

export const bondAsset =
  ({ value, address, bond, networkID, provider, slippage }) =>
  async dispatch => {
=======
    return {
      bond,
      allowance: Number(allowance),
      balance: Number(balance),
      interestDue,
      bondMaturationBlock,
      pendingPayout: ethers.utils.formatUnits(pendingPayout, "gwei"),
    };
  },
);

export const bondAsset = createAsyncThunk(
  "bonding/bondAsset",
  async ({ value, address, bond, networkID, provider, slippage }, { dispatch }) => {
>>>>>>> origin/develop:src/slices/BondSlice.js
    const depositorAddress = address;
    const acceptedSlippage = slippage / 100 || 0.005; // 0.5% as default
    const valueInWei = ethers.utils.parseUnits(value.toString(), "ether");

    let balance;

    // Calculate maxPremium based on premium and slippage.
    // const calculatePremium = await bonding.calculatePremium();
    const signer = provider.getSigner();
    const bondContract = contractForBond({ bond, provider: signer, networkID });
    const calculatePremium = await bondContract.bondPrice();
    const maxPremium = Math.round(calculatePremium * (1 + acceptedSlippage));

    // Deposit the bond
    let bondTx;
    try {
      bondTx = await bondContract.deposit(valueInWei, maxPremium, depositorAddress);
      dispatch(fetchPendingTxns({ txnHash: bondTx.hash, text: "Bonding " + bondName(bond), type: "bond_" + bond }));
      await bondTx.wait();
      // TODO: it may make more sense to only have it in the finally.
      // UX preference (show pending after txn complete or after balance updated)

      return dispatch(calculateUserBondDetails({ address, bond, networkID, provider }));
    } catch (error) {
      if (error.code === -32603 && error.message.indexOf("ds-math-sub-underflow") >= 0) {
        alert("You may be trying to bond more than your balance! Error code: 32603. Message: ds-math-sub-underflow");
      } else alert(error.message);
      return;
    } finally {
      if (bondTx) {
        dispatch(clearPendingTxn(bondTx.hash));
      }
    }
  },
);

export const redeemBond = createAsyncThunk(
  "bonding/redeemBond",
  async ({ address, bond, networkID, provider, autostake }, { dispatch }) => {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const signer = provider.getSigner();
    const bondContract = contractForBond({ bond, networkID, provider: signer });

    let redeemTx;
    try {
      redeemTx = await bondContract.redeem(address, autostake === true);
      const pendingTxnType = "redeem_bond_" + bond + (autostake === true ? "_autostake" : "");
      dispatch(fetchPendingTxns({ txnHash: redeemTx.hash, text: "Redeeming " + bondName(bond), type: pendingTxnType }));
      await redeemTx.wait();
      await dispatch(calculateUserBondDetails({ address, bond, networkID, provider }));

      return dispatch(getBalances({ address, networkID, provider }));
    } catch (error) {
      alert(error.message);
    } finally {
      if (redeemTx) {
        dispatch(clearPendingTxn(redeemTx.hash));
      }
    }
<<<<<<< HEAD:src/actions/Bond.actions.js
  };

export const redeemAllBonds =
  ({ networkID, recipient, autoStake, provider }) =>
  async dispatch => {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const signer = provider.getSigner();
    const redeemHelperContract = contractForRedeemHelper({ networkID, provider: signer });

    try {
      const redeemAllTx = await redeemHelperContract.redeemAll(recipient, autoStake === true);

      await redeemAllTx.wait();
    } catch (error) {
      alert(error.message);
    }
  };
=======
  },
);

const bondingSlice = createSlice({
  name: "bonding",
  initialState,
  reducers: {
    fetchBondSuccess(state, action) {
      state[action.payload.bond] = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(calcBondDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(calcBondDetails.fulfilled, (state, action) => {
        state[action.payload.bond] = action.payload;
        state.loading = false;
      })
      .addCase(calcBondDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(calculateUserBondDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
        const bond = action.payload.bond;
        const newState = { ...state[bond], ...action.payload };
        state[bond] = newState;
        state.loading = false;
      })
      .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export default bondingSlice.reducer;

export const { fetchBondSuccess } = bondingSlice.actions;

const baseInfo = state => state.bonding;

export const getBondingState = createSelector(baseInfo, bonding => bonding);
>>>>>>> origin/develop:src/slices/BondSlice.js
