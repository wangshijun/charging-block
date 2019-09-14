/* eslint-disable object-curly-newline */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import capitalize from 'lodash/capitalize';
import useForm from 'react-hook-form';
import useAsync from 'react-use/lib/useAsync';

import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '@arcblock/ux/lib/Button';
import Auth from '@arcblock/did-react/lib/Auth';

import Layout from '../../components/pole';
import api from '../../libs/api';

let defaults = {
  name: '我的测试充电桩',
  description: '万向黑客马拉松专用充电桩',
  address: '上海市虹口区临平北路28号',
  latitude: '31.26313',
  longitude: '121.4908373',
  power: 40,
  price: 0.5,
};

if (process.env.NODE_ENV === 'production') {
  defaults = {};
}

async function fetchMeta() {
  const [{ data: meta }, { data: session }] = await Promise.all([api.get('/api/meta'), api.get('/api/session')]);
  return Object.assign({}, meta, session);
}

export default function ChargingPoleInit() {
  const state = useAsync(fetchMeta);
  const { handleSubmit, register, errors, setValue, getValues } = useForm();
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    register({ name: 'location' });
    register({ name: 'supplier' });
  }, [register]);

  const onClaimChargingPileSuccess = () => {
    setTimeout(() => {
      window.location.href = `/chargingPoles/detail?id=${created._id}`;
    });
  };

  const onSubmit = async data => {
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/api/chargingPoles', data);

      setLoading(false);
      if (res.status === 200) {
        setCreated(res.data);
      } else {
        setError(res.data.error || 'Error initialize charging pile');
      }
    } catch (err) {
      setLoading(false);
      setError(`Error initialize charging pole: ${err.message}`);
    }
  };

  if (state.loading || !state.value) {
    return (
      <Layout title="初始化充电桩">
        <Main>
          <CircularProgress />
        </Main>
      </Layout>
    );
  }

  if (state.error) {
    return (
      <Layout title="初始化充电桩">
        <Main>{state.error.message}</Main>
      </Layout>
    );
  }

  const groups = {
    'Basic Info': {
      name: { type: 'text', label: '名字', required: true },
      description: { type: 'text', label: '描述', required: true },
      address: { type: 'text', label: '详细地址' },
      latitude: { type: 'number', label: '经度' },
      longitude: { type: 'number', label: '纬度' },
      power: { type: 'number', label: '单价（度）' },
      price: { type: 'number', label: '功率（A）' },
      supportedCarModels: { type: 'text', label: '兼容的车型', multiple: true },
    },
    Relationship: {
      location: { type: 'select', label: '场地', options: state.value.locations },
      supplier: { type: 'select', label: '电网', options: state.value.suppliers },
    },
  };

  return (
    <Layout title="Initialize">
      <Main>
        <div className="form">
          <Typography component="h3" variant="h4" className="form-header">
            Initialize
          </Typography>

          <form className="form-body" onSubmit={handleSubmit(onSubmit)}>
            {Object.keys(groups).map(g => (
              <React.Fragment key={g}>
                <Typography component="h4" variant="h5" className="form-subheader">
                  {g}
                </Typography>
                <div className="form-subgroup">
                  {Object.keys(groups[g]).map(name => {
                    const { type, placeholder, required, options, multiple } = groups[g][name];

                    if (['number', 'text'].includes(type)) {
                      return (
                        <TextField
                          key={name}
                          label={capitalize(name)}
                          className={`input input-${name}`}
                          margin="normal"
                          error={errors[name] && errors[name].message}
                          inputRef={register(required ? { required: `${name} is required` } : {})}
                          InputProps={{
                            name,
                            disabled: loading,
                            defaultValue: defaults[name],
                            type,
                            placeholder: placeholder || '',
                          }}>
                          {type === 'select' &&
                            options.map(x => (
                              <MenuItem key={x._id} value={x._id}>
                                {x.name}
                              </MenuItem>
                            ))}
                        </TextField>
                      );
                    }

                    if (['select'].includes(type)) {
                      return (
                        <Select
                          key={name}
                          multiple={multiple}
                          label={capitalize(name)}
                          value={getValues()[name] || defaults[name] || ''}
                          onChange={e => setValue(name, e.target.value)}
                          className={`input select-${name}`}
                          error={errors[name] && errors[name].message}>
                          {options.map(x => (
                            <MenuItem key={x._id} value={x._id}>
                              {x.name}
                            </MenuItem>
                          ))}
                        </Select>
                      );
                    }

                    return null;
                  })}
                </div>
              </React.Fragment>
            ))}

            <Button
              type="submit"
              size="large"
              variant="contained"
              color="primary"
              disabled={loading}
              className="submit">
              {loading ? <CircularProgress size={24} /> : 'Initialize Charging Pile'}
            </Button>
            {!!error && <p className="error">{error}</p>}
          </form>
          {created && created._id && (
            <Auth
              responsive
              disableClose
              action="claim"
              checkFn={api.get}
              extraParams={{ cpid: created._id }}
              onSuccess={onClaimChargingPileSuccess}
              messages={{
                title: 'Claim Charging Pile',
                scan: 'Scan QR code with Wallet to claim the charging pile',
                confirm: 'Confirm claim on your Wallet',
                success: 'The charging pile is initialized successfully on chain',
              }}
            />
          )}
        </div>
      </Main>
    </Layout>
  );
}

const Main = styled.div`
  box-shadow: inset 0 0 100px hsla(0, 0%, 0%, 0.3);
  height: 100%;
  padding: 32px;
  margin: 0;

  .form-body {
    display: flex;
    flex-direction: column;
  }

  .form-subheader {
    margin-top: 40px;
  }

  .form-subgroup {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;

    .input {
      width: 36%;
      margin-right: 4%;
    }
  }

  .submit {
    margin-top: 40px;
    width: 400px;
  }
`;
