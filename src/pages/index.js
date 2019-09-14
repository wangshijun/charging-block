/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import styled from 'styled-components';

import Typography from '@material-ui/core/Typography';
import Button from '@arcblock/ux/lib/Button';

import Layout from '../components/layout';

export default function IndexPage() {
  return (
    <Layout title="Home">
      <Main>
        <Typography component="h2" variant="h4" className="page-header" color="textPrimary">
          ChargingBlock
        </Typography>
        <Typography component="p" variant="h6" className="page-description" color="textSecondary">
          Application boilerplate built on top of{' '}
          <a href="https://www.arcblock.io/en/forge-sdk">forge (Ruby on Rails for Blockchain Space)</a> powered
          blockchain, with developer friendly{' '}
          <a href="https://docs.arcblock.io/forge/latest/sdk/javascript.html">javascript sdk</a>. Makes it super easy to
          start building distributed applications with tons of thousands of react/javascript libraries/components.
        </Typography>
        <section className="section">
          <Button href="/carcentral" className="button" size="large" variant="contained" color="primary">
            车载系统
          </Button>
          <Button href="/charging_pole/initialize" className="button" size="large" variant="contained" color="primary">
            桩载系统
          </Button>
        </section>
      </Main>
    </Layout>
  );
}

const Main = styled.main`
  margin: 80px 0 0;

  a {
    color: ${props => props.theme.colors.green};
    text-decoration: none;
  }

  .page-header {
    margin-bottom: 20px;
  }

  .page-description {
    margin-bottom: 30px;
  }

  .section {
    margin-bottom: 50px;
    .section__header {
      margin-bottom: 20px;
    }
  }

  .demos {
    .demo {
      height: 240px;
    }
  }
`;
