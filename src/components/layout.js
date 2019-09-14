import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Container from '@material-ui/core/Container';
import styled from 'styled-components';
import Helmet from 'react-helmet';

import Header from './header';

import env from '../libs/env';

export default function Layout({ title, children, contentOnly }) {
  if (contentOnly) {
    return <Div>{children}</Div>;
  }

  return (
    <Div>
      <Helmet title={`${title} - ${env.appName}`} />
      <AppBar color="default">
        <Container>
          <Header />
        </Container>
      </AppBar>
      <Container style={{ minHeight: '60vh', paddingTop: '120px' }}>{children}</Container>
    </Div>
  );
}

Layout.propTypes = {
  title: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.any.isRequired,
  contentOnly: PropTypes.bool,
};

Layout.defaultProps = {
  contentOnly: false,
};

const Div = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;
