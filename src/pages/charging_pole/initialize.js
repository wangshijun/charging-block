import React from 'react';
import styled from 'styled-components';

import Layout from '../../components/layout';

export default function ChargingPoleInit() {
  return (
    <Layout title="充电桩初始化" contentOnly>
      <Div>
        <p>here goes the content</p>
      </Div>
    </Layout>
  );
}

const Div = styled.div`
  color: black;
`;
