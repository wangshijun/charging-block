/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import styled, { keyframes } from 'styled-components';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import PropTypes from 'prop-types';
import api from '../../libs/api';

export default function ConnectToCharging({ changePageCallBack, goFirstPage }) {
  return (
    <Main>
      <IconButton
        className="back-button"
        aria-label="back"
        onClick={() => {
          goFirstPage();
        }}>
        <ArrowBack fontSize="large" />
      </IconButton>
      <div className="title">Connecting...</div>
      <div className="plug-image">
        <img src="/static/images/connection.gif" alt="connection" />
      </div>
      <div className="warn-button">
        <div className="pulse" />
        <div className="pulse1" />
        <Button
          variant="contained"
          color="primary"
          className="connect-button dot"
          onClick={() => changePageCallBack(2, 50)}>
          自动连接
        </Button>
      </div>
    </Main>
  );
}

ConnectToCharging.propTypes = {
  changePageCallBack: PropTypes.func.isRequired,
  goFirstPage: PropTypes.func.isRequired,
};

const warn = keyframes`
    0% {
        transform: scale(1);
        opacity: 0.1;
    }

    25% {
        transform: scale(1.1);
        opacity: 0.3;
    }

    50% {
        transform: scale(1.2);
        opacity: 0.5;
    }

    75% {
        transform: scale(1.3);
        opacity: 0.3;
    }

    100% {
        transform: scale(1.4);
        opacity: 0.0;
    }
`;

const warn1 = keyframes`
     0% {
        transform: scale(1.05);
        opacity: 0.1;
    }

    25% {
        transform: scale(1.15);
        opacity: 0.3;
    }

    50% {
        transform: scale(1.25);
        opacity: 0.5;
    }

    75% {
        transform: scale(1.35);
        opacity: 0.3;
    }

    100% {
        transform: scale(1.45);
        opacity: 0.0;
    }
`;

const Main = styled.main`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  .back-button {
    position: absolute;
    top: 0;
    left: 0;
  }
  .title {
    font-size: 50px;
    font-weight: bold;
  }
  .plug-image {
    img {
      width: 400px;
    }
  }
  .warn-button {
    position: relative;
    height: 150px;
    width: 150px;
    margin-top: 40px;
    .connect-button {
      height: 150px;
      width: 150px;
      border-radius: 150px;
      font-size: 20px;
      font-weight: bold;
    }
    .pulse {
      position: absolute;
      width: 150px;
      height: 150px;
      left: 0px;
      top: 0px;
      border: 1px solid #6385f0;
      border-radius: 50%;
      animation: ${warn} 2s ease-out;
      animation-iteration-count: infinite;
    }
    .pulse1 {
      position: absolute;
      width: 150px;
      height: 150px;
      left: 0px;
      top: 0px;
      border: 1px solid #6385f0;
      border-radius: 50%;
      animation: ${warn1} 2s ease-out;
      animation-iteration-count: infinite;
    }
  }
`;
