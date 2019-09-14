/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useAsync from 'react-use/lib/useAsync';
import styled from 'styled-components';

import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DidAuth from '@arcblock/did-react/lib/Auth';

import Layout from '../../components/pole';
import api from '../../libs/api';

export default function PoleDetail({ query }) {
  const [isAuthOpen, setAuthOpen] = useState(false);
  const contract = useAsync(async () => {
    try {
      const res = await api.get(`/api/chargingPoles/${query.id}`);
      if (res.status === 200) {
        return res.data;
      }
      throw new Error(res.data.error);
    } catch (err) {
      throw new Error('Charging pole load failed');
    }
  });

  if (contract.error) {
    return (
      <Layout title="Contract">
        <Main>{contract.error.message}</Main>
      </Layout>
    );
  }

  if (contract.loading || !contract.value) {
    return (
      <Layout title="Contract">
        <Main>
          <CircularProgress />
        </Main>
      </Layout>
    );
  }

  return (
    <Layout title="Contract">
      <Main>
        {(contract.loading || !contract.value) && <CircularProgress />}
        {contract.error && (
          <Typography component="p" color="secondary">
            {contract.error.message}
          </Typography>
        )}
        {contract.value && (
          <React.Fragment>
            <pre>
              <code>{JSON.stringify(contract.value, true, 2)}</code>
            </pre>
            {isAuthOpen && (
              <Dialog open maxWidth="sm" disableBackdropClick disableEscapeKeyDown onClose={() => setAuthOpen(false)}>
                <DidAuth
                  action="agreement"
                  checkFn={api.get}
                  extraParams={query}
                  onClose={() => setAuthOpen(false)}
                  onSuccess={() => window.location.reload()}
                  messages={{
                    title: 'Sign Contract',
                    scan: 'Scan the qrcode to sign this contract',
                    confirm: 'Confirm your agreement on your ABT Wallet',
                    success: 'You have successfully signed!',
                  }}
                />
              </Dialog>
            )}
          </React.Fragment>
        )}
      </Main>
    </Layout>
  );
}

PoleDetail.getInitialProps = ({ query }) => ({ query });

PoleDetail.propTypes = {
  query: PropTypes.object.isRequired,
};

const Main = styled.div`
  box-shadow: inset 0 0 100px hsla(0, 0%, 0%, 0.3);
  height: 100%;
  padding: 32px;
  margin: 0;
`;
