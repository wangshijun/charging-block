/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { fromRandom } from '@arcblock/forge-wallet';
import { fromUnitToToken } from '@arcblock/forge-util';
import useMount from 'react-use/lib/useMount';
import useAsync from 'react-use/lib/useAsync';
import useInterval from '@arcblock/react-hooks/lib/useInterval';

import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Slide from '@material-ui/core/Slide';
import Button from '@arcblock/ux/lib/Button';
import Auth from '@arcblock/did-react/lib/Auth';

import Layout from '../components/car';
import ChargingMap from '../components/carcentral/chargingmap';
import ConnectToCharging from '../components/carcentral/connecttocharging';
import Charging from '../components/carcentral/charging';

import forge from '../libs/gql';
import api from '../libs/api';
import {
  getCarWallet,
  setCarWallet,
  getCarOwner,
  setCarOwner,
  getChargingAmount,
  setChargingAmount,
  getChargingPole,
  setChargingId,
} from '../libs/storage';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const fetchers = {};
const getFetcher = did => {
  if (!fetchers[did]) {
    fetchers[did] = async () => {
      try {
        const { state: account } = await forge.getAccountState({ address: did });
        return account.balance;
      } catch (err) {
        console.error(err);
      }

      return null;
    };
  }

  return fetchers[did];
};

/* eslint-disable-next-line react/prop-types */
const OwnerBalance = ({ did }) => {
  const state = useAsync(getFetcher(did));

  if (state.error) {
    return <p>{state.error.message}</p>;
  }

  if (state.loading || !state.value) {
    return <CircularProgress />;
  }

  return <div className="tokens">{fromUnitToToken(state.value, 18)} CBT</div>;
};

export default function CarPage() {
  const [storage, setStorage] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [binding, setBinding] = useState(false);
  const [batteryClass, setBatteryClass] = useState('battery charging-start');
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [open, setOpen] = useState(false);
  const [poleDid, setPoleDid] = useState('');

  const generateWallet = async () => {
    const wallet = fromRandom();
    await forge.sendDeclareTx({
      tx: {
        itx: { moniker: `car_${wallet.toAddress()}` },
      },
      wallet,
    });
    setCarWallet(wallet.toJSON());
    return wallet;
  };

  useInterval(async () => {
    try {
      const amount = getChargingAmount();
      const wallet = getCarWallet();
      const owner = getCarOwner();
      const pole = getChargingPole();
      if (amount > 0 && pole && owner) {
        console.log('checkPayment', {
          amount,
          wallet,
          owner,
          pole,
        });
        // eslint-disable-next-line object-curly-newline
        const res = await api.post('/api/transaction', { wallet, amount, owner, poleDid: pole });
        if (res.data.status === 200) {
          console.log(res);
          setChargingAmount(0);
        }
      }
    } catch (err) {
      console.error('check charging error', err);
    }
  }, 1000);

  useMount(async () => {
    let wallet = getCarWallet();
    const owner = getCarOwner();
    setStorage({ wallet, owner });
    if (!wallet) {
      wallet = await generateWallet();
      setCarWallet(wallet);
      setStorage({ wallet, owner });
    }

    console.log(wallet);
    const res = await api.get(`/api/charging?carDid=${wallet.address}`);
    console.log(res);
    if (res && res.data && res.data._id) {
      setChargingId(res.data._id);
      setBatteryClass('battery charging');
      setCurrentPage(2);
    }
  }, []);

  const onBindOwner = () => {
    setBinding(true);
  };

  const onBindOwnerDone = result => {
    console.log('onBindOwnerDone', result);
    const newStorage = { ...storage, owner: result.owner };
    setCarOwner(result.owner);
    setStorage(newStorage);
    setBinding(false);
  };

  const changePageCallBack = (page, batteryLevelTemp, poleDidTemp) => {
    if (poleDidTemp) {
      setPoleDid(poleDidTemp);
    }
    setCurrentPage(page);
    setBatteryLevel(batteryLevelTemp);
    if (batteryLevelTemp === 0) {
      setBatteryClass('battery charging-start');
    } else if (batteryLevelTemp === 50) {
      setBatteryClass('battery charging');
    } else if (batteryLevelTemp === 100) {
      setBatteryClass('battery charging-end');
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Layout contentOnly title="Car Central">
      <Main>
        <Grid className="container" container>
          <Grid className="left-container" item xs={7}>
            <div className="car-status-container">
              <span className="car-status">P</span>
              <div className="battery-container">
                <span>{batteryLevel}%</span>
                <div className={batteryClass} />
              </div>
            </div>
            <div className="car-image-container">
              <img className="car-image" src="/static/images/car.png" alt="car" />
            </div>
            <div className="menus-container">
              {storage.owner ? (
                <OwnerBalance did={storage.owner} />
              ) : (
                <Button variant="contained" size="small" onClick={onBindOwner}>
                  Bind Owner Wallet
                </Button>
              )}
              {storage.wallet && (
                <div className="did-container">
                  <span className="did-title">Car Central ID:</span>
                  <span className="did-content">{storage.wallet.address}</span>
                </div>
              )}
              {storage.owner && (
                <div className="did-container">
                  <span className="did-title">Car Owner ID:</span>
                  <span className="did-content">{storage.owner}</span>
                </div>
              )}
            </div>
          </Grid>
          <Grid className="right-container" item xs={12}>
            {currentPage === 0 && <ChargingMap changePageCallBack={changePageCallBack} />}
            {currentPage === 1 && (
              <ConnectToCharging
                poleDid={poleDid}
                carDid={storage.wallet.address}
                changePageCallBack={changePageCallBack}
                goFirstPage={() => {
                  setCurrentPage(0);
                }}
              />
            )}
            {currentPage === 2 && <Charging changePageCallBack={changePageCallBack} />}
          </Grid>
        </Grid>
        <Dialog open={open} TransitionComponent={Transition} keepMounted fullWidth maxWidth="sm" onClose={handleClose}>
          <DialogTitle id="alert-dialog-slide-title">充电账单</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <p>Hash: xxxxxxx</p>
              <p>time: xxxxxxx</p>
              <p>token spend: xxxxxxx</p>
              <p>charging got: xxxxxxx</p>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              确认
            </Button>
          </DialogActions>
        </Dialog>
        {binding && (
          <Auth
            responsive
            disableClose
            action="connect"
            checkFn={api.get}
            onClose={() => setBinding(false)}
            extraParams={{ carId: storage.wallet.address }}
            onSuccess={onBindOwnerDone}
            messages={{
              title: 'Connect Wallet',
              scan: 'Scan QR code with Wallet to complete the connection',
              confirm: 'Confirm connection on your Wallet',
              success: 'The car is connected successfully with your wallet',
            }}
          />
        )}
      </Main>
    </Layout>
  );
}

const charging = keyframes`
    from {
      width: 10px;
      background: #f00;
    }
    to {
      width: 38px;
      background: #0f0;
    }
`;

const Main = styled.main`
  height: 100%;
  padding: 9px;
  margin: 0;
  .container {
    width: 100%;
    flex-wrap: nowrap;
  }
  .left-container {
    display: flex;
    flex-direction: column;
    .car-status-container {
      height: 120px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      border-bottom: solid 1px #ccc;
      .car-status {
        font-size: 70px;
        color: #282828;
        font-weight: bold;
      }
      .battery-container {
        position: absolute;
        display: flex;
        align-items: center;
        width: 108px;
        bottom: 7px;
        right: 0px;
        span {
          height: 25px;
          line-height: 25px;
          margin-right: 10px;
        }
        .battery {
          position: relative;
          display: block;
          background: #0f0;
          width: 38px;
          height: 13px;
          float: left;
          &:before {
            content: '';
            display: block;
            background: transparent;
            border: 3px solid #ffffff;
            margin: -6px;
            width: 50px;
            height: 25px;
            position: absolute;
            border-radius: 2px;
            z-index: 2000;
          }
          &:after {
            content: '';
            display: block;
            background: #ffffff;
            margin: 1px 47px;
            width: 7px;
            height: 11px;
            position: absolute;
            border-radius: 2px;
            box-shadow: 2px 0 5px 2px #eee;
            z-index: 0;
          }
        }
        .charging {
          animation: ${charging} 2s ease-in-out infinite;
        }
        .charging-start {
          background: #f00;
          width: 10px;
        }
        .charging-end {
          background: #0f0;
          width: 38px;
        }
      }
    }
    .car-image-container {
      height: 560px;
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .car-image {
        display: inline-block;
        width: 250px;
      }
    }
    .menus-container {
      border-top: solid 1px #ccc;
      height: 180px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .tokens {
        font-size: 30px;
        span {
          font-size: 40px;
          font-weight: bold;
        }
      }
      .did-container {
        height: 40px;
        width: 92%;
        line-height: 40px;
        color: #282828;
        border-radius: 5px;
        margin-top: 8px;
        text-align: center;
        box-shadow: 0 2px 12px 7px #ccc inset;
        .did-title {
          font-size: 14px;
          color: #989898;
          font-weight: bold;
        }
        .did-content {
          margin-left: 4px;
          font-size: 12px;
          font-weight: bold;
        }
      }
    }
  }
`;
