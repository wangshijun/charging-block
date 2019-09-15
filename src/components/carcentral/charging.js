/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import { lighten, withStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import PropTypes from 'prop-types';
import useInterval from '@arcblock/react-hooks/lib/useInterval';
import api from '../../libs/api';
import { getChargingId, setChargingId } from '../../libs/storage';

const BorderLinearProgress = withStyles({
  root: {
    height: 40,
    backgroundColor: lighten('#9CD696', 0.5),
    borderRadius: 40,
  },
  bar: {
    backgroundColor: '#6bc295',
  },
})(LinearProgress);

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function Charging({ changePageCallBack }) {
  const [errorMsg, setErrorMsg] = useState('');
  const [errorOpen, setErrorOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState(0);
  const finishCharging = async () => {
    const chargingId = getChargingId();
    if (chargingId) {
      const res = await api.put(`/api/charging/${chargingId}/disconnect`);
      console.log(res);
      if (res && res.data && res.data._id) {
        setChargingId('');
        changePageCallBack(0, 100);
      } else if (res.data.error) {
        setErrorMsg(res.data.error);
        setErrorOpen(true);
      }
    } else {
      setErrorOpen(true);
      setErrorMsg('未查到充电单号');
    }
  };

  useInterval(
    () => {
      setCurrentValue(currentValue + 1);
      if (currentValue >= 100) {
        finishCharging();
      }
    },
    currentValue >= 101 ? null : 500
  );

  return (
    <Main>
      <img className="charging-pic" src="/static/images/charging.gif" alt="charging" />
      <div className="progress">
        <BorderLinearProgress
          className="border-progress"
          variant="determinate"
          color="secondary"
          value={currentValue}
        />
        <span className="progress-num">{currentValue}%</span>
      </div>

      <Button variant="contained" color="primary" className="finish-button" onClick={() => finishCharging()}>
        充电结束
      </Button>
      <Dialog
        open={errorOpen}
        TransitionComponent={Transition}
        keepMounted
        fullWidth
        maxWidth="xs"
        onClose={() => {
          setErrorOpen(false);
        }}>
        <DialogTitle id="alert-dialog-slide-title">Notice</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">{errorMsg}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setErrorOpen(false);
            }}
            color="primary">
            确认
          </Button>
        </DialogActions>
      </Dialog>
    </Main>
  );
}

Charging.propTypes = {
  changePageCallBack: PropTypes.func.isRequired,
};

const Main = styled.main`
  width: 100%;
  height: 90vh;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  color: white;
  .charging-pic {
    width: 600px;
  }
  .progress {
    width: 80%;
    position: relative;
    .border-progress {
      width: 100%;
    }
    .progress-num {
      width: 100%;
      text-align: center;
      height: 40px;
      line-height: 40px;
      position: absolute;
      color: #fff;
      font-size: 20px;
      font-weight: bold;
      top: 0;
      left: 0;
    }
  }
  .finish-button {
    margin-top: 40px;
    height: 50px;
    width: 160x;
    border-radius: 8px;
    font-size: 18px;
    background: #6bc295;
    &:hover {
      background: #6f9379;
    }
  }
`;
