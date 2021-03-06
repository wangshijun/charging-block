/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useAsync from 'react-use/lib/useAsync';
import styled from 'styled-components';
import useInterval from '@arcblock/react-hooks/lib/useInterval';

import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DidAuth from '@arcblock/did-react/lib/Auth';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import Layout from '../../components/pole';
import api from '../../libs/api';
import { setChargingAmount } from '../../libs/storage';

const STATUS_IDLE = 'idle';
const STATUS_CHARGING = 'charging';

export default function PoleDetail({ query }) {
  const [isAuthOpen, setAuthOpen] = useState(false);
  const [isFinishChargeOpen, setFinishChargeOpen] = useState(false);
  const [status, setStatus] = useState(STATUS_IDLE);
  const [statusDesc, setStatusDesc] = useState('Plugin your car...');
  const [tokens, setTokens] = useState(0);
  const [showTokens, setShowTokens] = useState(0);

  useInterval(
    async () => {
      const res = await api.get(`/api/chargingPoles/${query.id}`);
      console.log('check charging status', res);
      if (res.data && res.data.status) {
        setStatus(res.data.status);
        if (res.data.status === STATUS_IDLE) {
          setStatusDesc('Plugin your car...');
        } else if (res.data.status === STATUS_CHARGING) {
          setFinishChargeOpen(false);
          setStatusDesc('Charging...');
        }
      }
    },
    status === STATUS_IDLE ? 500 : null
  );

  useInterval(
    async () => {
      setTokens(tokens + 1);
      const res = await api.get(`/api/chargingPoles/${query.id}`);
      if (res.data && res.data.status) {
        setStatus(res.data.status);
        if (res.data.status === STATUS_IDLE) {
          setChargingAmount(tokens);
          setStatusDesc('Plug your car...');
          setShowTokens(tokens);
          setTokens(0);
          setFinishChargeOpen(true);
        } else if (res.data.status === STATUS_CHARGING) {
          setFinishChargeOpen(false);
          setStatusDesc('Charging...');
        }
      }
    },
    status === STATUS_CHARGING ? 500 : null
  );

  const state = useAsync(async () => {
    try {
      const res = await api.get(`/api/chargingPoles/${query.id}`);
      if (res.status === 200) {
        return res.data;
      }
      throw new Error(res.data.error);
    } catch (err) {
      throw new Error('Charging pole load failed');
    }
  });

  if (state.error) {
    return (
      <Layout title="充电桩">
        <Main>{state.error.message}</Main>
      </Layout>
    );
  }

  if (state.loading || !state.value) {
    return (
      <Layout title="充电桩">
        <Main>
          <CircularProgress />
        </Main>
      </Layout>
    );
  }

  return (
    <Layout title="充电桩">
      <Main>
        {(state.loading || !state.value) && <CircularProgress />}
        {state.error && (
          <Typography component="p" color="secondary">
            {state.error.message}
          </Typography>
        )}
        {state.value && (
          <React.Fragment>
            <div className="info-rows">
              <Typography component="div" className="info-row info-row--full">
                <span className="info-row__key">ID</span>
                <span className="info-row__value">{state.value.did}</span>
              </Typography>
              <Typography component="div" className="info-row info-row--full">
                <span className="info-row__key">名称</span>
                <span className="info-row__value">{state.value.name}</span>
              </Typography>
              <Typography component="div" className="info-row info-row--full">
                <span className="info-row__key">位置</span>
                <span className="info-row__value">{state.value.address}</span>
              </Typography>
              <Typography component="div" className="info-row">
                <span className="info-row__key">充电电流</span>
                <span className="info-row__value">{state.value.power} A</span>
              </Typography>
              <Typography component="div" className="info-row">
                <span className="info-row__key">充电电价</span>
                <span className="info-row__value">{state.value.price} CBT/度</span>
              </Typography>

              {status === STATUS_CHARGING && (
                <React.Fragment>
                  <Typography component="div" className="info-row">
                    <span className="info-row__key">充电金额</span>
                    <span className="info-row__value">{tokens} CBT</span>
                  </Typography>
                  <Typography component="div" className="info-row">
                    <span className="info-row__key">充电电量</span>
                    <span className="info-row__value">{tokens / state.value.price} 度</span>
                  </Typography>
                  <Typography component="div" className="info-row battery-gif" />
                </React.Fragment>
              )}
            </div>
            {status === STATUS_CHARGING && (
              <div className="battery-gif">
                <img src="/static/images/battery-pole.gif" alt="battery" />
              </div>
            )}
            <div
              className={
                status === STATUS_CHARGING ? 'status-container status-container-charging' : 'status-container'
              }>
              <div>{statusDesc}</div>
            </div>
            {isAuthOpen && (
              <Dialog open maxWidth="sm" disableBackdropClick disableEscapeKeyDown onClose={() => setAuthOpen(false)}>
                <DidAuth
                  action="agreement"
                  checkFn={api.get}
                  extraParams={query}
                  onClose={() => setAuthOpen(false)}
                  onSuccess={() => window.location.reload()}
                  messages={{
                    title: 'Sign Contract',
                    scan: 'Scan the qrcode to sign this contract',
                    confirm: 'Confirm your agreement on your ABT Wallet',
                    success: 'You have successfully signed!',
                  }}
                />
              </Dialog>
            )}
            {isFinishChargeOpen && (
              <Dialog
                open
                maxWidth="sm"
                disableBackdropClick
                disableEscapeKeyDown
                onClose={() => setFinishChargeOpen(false)}>
                <DialogTitle id="alert-dialog-slide-title">Charging Bill</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-slide-description">
                    <Typography component="p">充电金额: {showTokens} CBT</Typography>
                    <Typography component="p">充电电量: {showTokens / state.value.price} 度</Typography>
                    <Typography component="p">结束时间: {new Date().toTimeString()}</Typography>
                    <Typography component="p">今日累计: 充电 {Math.round(Math.random() * 10) + 1} 次</Typography>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setFinishChargeOpen(false)} color="primary">
                    Confirm
                  </Button>
                </DialogActions>
              </Dialog>
            )}
          </React.Fragment>
        )}
      </Main>
    </Layout>
  );
}

PoleDetail.getInitialProps = ({ query }) => ({ query });

PoleDetail.propTypes = {
  query: PropTypes.object.isRequired,
};

const Main = styled.div`
  box-shadow: inset 0 0 100px hsla(0, 0%, 0%, 0.3);
  height: 100%;
  padding: 32px;
  margin: 0;

  .info-rows {
    display: flex;
    flex-wrap: wrap;

    .info-row {
      font-size: 16px;
      width: 45%;
      margin-right: 5%;
      padding: 5px 0;
      font-weight: bold;
    }

    .info-row--full {
      width: 100%;
      margin-right: 0;
      border-bottom: 1px dashed #222;
      margin-bottom: 24px;
    }

    .info-row__key {
      margin-right: 16px;
      &:after {
        content: ':';
        margin-left: 2px;
      }
    }
  }

  .status-container {
    height: 80px;
    margin: 30px auto 0 auto;
    border-radius: 8px;
    box-shadow: 0 2px 12px 7px #ccc inset;
    line-height: 80px;
    text-align: center;
    font-size: 25px;
    font-weight: 500;
    padding: 0 30px;
    color: #282828;
  }

  .status-container-charging {
    box-shadow: 0 2px 12px 7px #9cd696 inset;
    color: #6dc398;
  }

  .battery-gif {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    img {
      width: 300px;
    }
  }
`;
