import React, { useState } from 'react';
import styled from 'styled-components';
import Cookie from 'js-cookie';
import capitalize from 'lodash/capitalize';
import useForm from 'react-hook-form';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';

import Layout from '../../components/layout';
import useSession from '../../hooks/session';
import api from '../../libs/api';

let defaults = {
  name: '我的测试充电桩',
  description: '万向黑客马拉松专用充电桩',
  address: '',
  latitude: '',
  longitude: '',
  power: 40,
  price: 0.5,
};

if (process.env.NODE_ENV === 'production') {
  defaults = {};
}

export default function ChargingPoleInit() {
  const session = useSession();
  const { handleSubmit, register, errors } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const onSubmit = async data => {
    setLoading(true);
    setError('');

    try {
      data.content = Buffer.from(data.content).toString('base64');
      data.signatures = data.signers.map(x => ({ email: x }));
      const res = await api.put('/api/chargingPoles', data);

      setLoading(false);
      if (res.status === 200) {
        // eslint-disable-next-line no-underscore-dangle
        window.location.href = `/chargingPoles/detail?id=${res.data._id}`;
      } else {
        setError(res.data.error || 'Error initialize contract');
      }
    } catch (err) {
      setLoading(false);
      setError(`Error initialize charging pole: ${err.message}`);
    }
  };

  if (session.loading || !session.value) {
    return (
      <Layout title="Create Contract">
        <Main>
          <CircularProgress />
        </Main>
      </Layout>
    );
  }

  if (session.error) {
    return (
      <Layout title="Create Contract">
        <Main>{session.error.message}</Main>
      </Layout>
    );
  }

  if (!session.value.user) {
    Cookie.set('login_redirect', '/contracts/create');
    window.location.href = '/?openLogin=true';
    return null;
  }

  const groups = {
    'Basic Info': {
      name: { type: 'text', label: '名字', required: true },
      description: { type: 'text', label: '描述', required: true },
      address: { type: 'number', label: '详细地址' },
      latitude: { type: 'number', label: '经度' },
      longitude: { type: 'number', label: '纬度' },
      power: { type: 'number', label: '单价（度）' },
      price: { type: 'number', label: '功率（A）' },
      supportedCarModels: { type: 'text', label: '兼容的车型' },
    },
    Relationship: {
      operator: { type: 'select', label: '桩主', options: [] },
      location: { type: 'select', label: '场地', options: [] },
      supplier: { type: 'select', label: '电网', options: [] },
    },
  };

  return (
    <Layout title="Initialize Charging Pole">
      <Main>
        <div className="form">
          <Typography component="h3" variant="h4" className="form-header">
            Initialize and Register Charging Pile
          </Typography>

          <form className="form-body" onSubmit={handleSubmit(onSubmit)}>
            {Object.keys(groups).map(g => (
              <React.Fragment key={g}>
                <Typography component="h4" variant="h5" className="form-subheader">
                  {g}
                </Typography>
                <div className="form-subgroup">
                  {Object.keys(groups[g]).map(name => (
                    <TextField
                      key={name}
                      label={capitalize(name)}
                      className={`input input-${name}`}
                      margin="normal"
                      variant="outlined"
                      error={errors[name] && errors[name].message}
                      helperText={errors[name] ? errors[name].message : ''}
                      inputRef={register(groups[g][name].required ? { required: `${name} is required` } : {})}
                      InputProps={{
                        name,
                        disabled: loading,
                        defaultValue: defaults[name],
                        type: groups[g][name].type,
                        placeholder: groups[g][name].placeholder || '',
                      }}
                    />
                  ))}
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
        </div>
      </Main>
    </Layout>
  );
}

const Main = styled.div`
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
      width: 35%;
      margin-right: 5%;
    }
  }

  .submit {
    margin-top: 40px;
  }
`;
