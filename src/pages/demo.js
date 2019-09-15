import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getChargingPoleId } from '../libs/storage';

export default function DemoHome() {
  const [poleId, setPoleId] = useState('');

  useEffect(() => {
    const id = getChargingPoleId();
    if (id) {
      setPoleId(id);
    }
  }, []);

  const url = poleId ? `/charging_pole/detail?id=${poleId}` : '/charging_pole/initialize';
  console.log(url);

  return (
    <Div>
      <iframe title="car" className="iframe iframe-car" src="/carcentral" />
      <iframe title="pole" className="iframe iframe-pole" src={url} />
    </Div>
  );
}

const Div = styled.div`
  width: 100%;
  height: 98vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 24px;
  box-sizing: border-box;

  .iframe {
    border: none;
    height: 100%;
  }

  .iframe-car {
    width: 70%;
    margin-right: 24px;
  }

  .iframe-pole {
    width: 30%;
  }
`;
