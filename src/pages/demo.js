import React from 'react';
import styled from 'styled-components';

export default function DemoHome() {
  return (
    <Div>
      <iframe title="car" className="iframe iframe-car" src="/carcentral" />
      <iframe title="pole" className="iframe iframe-pole" src="/charging_pole/initialize" />
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
