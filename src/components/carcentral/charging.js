/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import PropTypes from 'prop-types';
import api from '../../libs/api';
import { getChargingId, setChargingId } from '../../libs/storage';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function Charging({ changePageCallBack }) {
  const [errorMsg, setErrorMsg] = useState('');
  const [errorOpen, setErrorOpen] = useState(false);
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

  return (
    <Main>
      <img className="charging-pic" src="/static/images/charging.gif" alt="charging" />
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
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  color: white;
  .charging-pic {
    width: 700px;
  }
  .finish-button {
    height: 50px;
    width: 160x;
    border-radius: 5px;
    font-size: 18px;
    background: #6bc295;
    &:hover {
      background: #6f9379;
    }
  }
`;
