import React, { useState } from 'react';
import styled from 'styled-components';
import Cookie from 'js-cookie';
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

  const fields = {
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
    <Layout title="Create Contract">
      <Main>
        <div className="form">
          <Typography component="h3" variant="h4" className="form-header">
            Initialize and Register Charging Pile
          </Typography>

          <form className="form-body" onSubmit={handleSubmit(onSubmit)}>
            {Object.keys(fields).map(x => (
              <React.Fragment key={x}>
                <Typography component="h4" variant="h5" className="form-subheader">
                  {x}
                </Typography>
                {fields[x].map(field => (
                  <TextField
                    label={field.name}
                    className={`"input input-${field.name}"`}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    error={errors[field.name] && errors[field.name].message}
                    helperText={errors[field.name] ? errors[field.name].message : ''}
                    inputRef={register(field.required ? { required: 'Name is required' } : {})}
                    InputProps={{
                      disabled: loading,
                      defaultValue: defaults[field.name],
                      type: field.type,
                      name: field.name,
                      placeholder: '',
                    }}
                  />
                ))}
              </React.Fragment>
            ))}

            <Button type="submit" size="large" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Initialize Charging Pile'}
            </Button>
            {!!error && <p className="error">{error}</p>}
          </form>
        </div>
      </Main>
    </Layout>
  );
}

const Main = styled.div``;
