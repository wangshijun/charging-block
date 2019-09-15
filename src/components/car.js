/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';

import Container from '@material-ui/core/Container';
import Layout from './layout';

export default function PoleLayout({ children, ...rest }) {
  return (
    <Layout {...rest} contentOnly>
      <Wrapper>{children}</Wrapper>
    </Layout>
  );
}

const Wrapper = styled(Container)`
  border: 16px solid #000000;
  border-top-width: 64px;
  box-sizing: border-box;
  border-radius: 8px;
  position: relative;
  box-shadow: inset 0 1px 1px 1px #000, inset 0 0 0 9px #111, 0 0 0 1px #ccc, 0 0 1px 2px hsla(0, 0%, 0%, 0.4),
    0 0 50px hsla(0, 0%, 0%, 0.3);

  && {
    padding-left: 0;
    padding-right: 0;
  }

  &:after {
    position: absolute;
    top: -24px;
    left: 50%;
    content: 'Car Control System';
    transform: translate(-50%, -50%);
    transform-origin: center;
    font-size: 24px;
    font-weight: 900;
    color: #fff;
    text-transform: uppercase;
    width: 100%;
    text-align: center;
  }
`;
