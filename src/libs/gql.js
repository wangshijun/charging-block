/* eslint-disable no-console */
import GraphQLClient from '@arcblock/graphql-client';
import env from './env';

if (!env.chainHost) {
  throw new Error('chainHost is required to start this application, please set `CHAIN_HOST` in `.env` file');
}

const client = new GraphQLClient({ endpoint: env.chainHost, chainId: env.chainId });

export default client;
