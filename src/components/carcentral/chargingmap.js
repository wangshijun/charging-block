/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState } from 'react';
import { Map, Marker } from 'react-amap';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import useAsync from 'react-use/lib/useAsync';
import api from '../../libs/api';

export default function ChargingMap({ changePageCallBack }) {
  const [chargingPoles, setChargingPoles] = useState([]);
  const state = useAsync(async () => {
    const res = await api.get('/api/chargingPoles');
    console.log(res);
    if (res.data && res.data.length > 0) {
      setChargingPoles(res.data.filter(item => item.did));
    }
  });
  const markerPosition = { longitude: 120, latitude: 30 };
  const markerEvents = {
    created: markerInstance => {
      console.log('高德地图 Marker 实例创建成功；如果你要亲自对实例进行操作，可以从这里开始。比如：');
      console.log(markerInstance.getPosition());
    },
  };
  return (
    <Main>
      <div className="right-container-map">
        <Map
          zoom="8"
          center={markerPosition}
          plugins={['Scale', 'ControlBar']}
          mapStyle="amap://styles/darkblue"
          amapkey="8e79dd6f45a17c1686437f20cb85a6c2">
          <Marker icon="" position={markerPosition} events={markerEvents} />
        </Map>
      </div>
      <div className="status-icons-left">
        <img src="/static/images/home.png" alt="home" />
        <img src="/static/images/bluetooth.png" alt="bluetooth" />
        <span>28°C</span>
        <span>12:00 PM</span>
      </div>
      <div className="charging-list">
        <div className="title">CHARGING LIST</div>
        <div className="list-container">
          {chargingPoles &&
            chargingPoles.map(item => (
              <div
                key={`${item._id}`}
                className="list-item"
                onClick={() => {
                  changePageCallBack(1, 0, item.did);
                }}>
                <div className="address">{item.name}</div>
                <div className="distance">{item.distance}m</div>
              </div>
            ))}
        </div>
      </div>
    </Main>
  );
}

ChargingMap.propTypes = {
  changePageCallBack: PropTypes.func.isRequired,
};

const Main = styled.main`
  width: 100%;
  height: 100%;
  position: relative;
  .right-container-map {
    width: 100%;
    height: 100%;
  }
  .status-icons-left {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 300px;
    height: 40px;
    display: flex;
    align-items: center;
    img {
      width: 25px;
      height: 25px;
      margin-right: 10px;
    }
    span {
      margin-right: 10px;
      font-size: 18px;
      font-weight: bold;
      color: #ffffff;
    }
  }
  .charging-list {
    position: absolute;
    top: 50px;
    left: 10px;
    width: 300px;
    height: 400px;
    margin-top: 10px;
    background: rgba(255, 255, 255, 1);
    border-radius: 5px;
    border: solid 1px #eee;
    .title {
      height: 48px;
      width: 100%;
      text-align: center;
      line-height: 48px;
      color: #989898;
      font-size: 16px;
      font-weight: bold;
      border-bottom: solid 1px #eee;
    }
    .list-container {
      overflow: scroll;
      height: 347px;
      .list-item {
        display: flex;
        align-items: center;
        height: 50px;
        padding-left: 10px;
        border-top: solid 1px #eee;
        .address {
          flex: 1;
        }
        .distance {
          width: 50px;
          height: 50px;
          line-height: 50px;
        }
      }
    }
  }
`;
