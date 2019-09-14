/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import styled, { keyframes } from 'styled-components';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import PropTypes from 'prop-types';

export default function Charging({ changePageCallBack }) {
  return (
    <Main>
      <img className="charging-pic" src="/static/images/charging.gif" alt="charging" />
      <Button variant="contained" color="primary" className="finish-button" onClick={() => changePageCallBack(0, 100)}>
        充电结束
      </Button>
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
