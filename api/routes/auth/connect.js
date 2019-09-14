/* eslint-disable no-console */
const multibase = require('multibase');
const ForgeSDK = require('@arcblock/forge-sdk');
const { toDelegateAddress } = require('@arcblock/did-util');
const { fromTokenToUnit } = require('@arcblock/forge-util');
const { fromAddress, fromJSON } = require('@arcblock/forge-wallet');

const auth = require('../../libs/auth');

const wallet = fromJSON(auth.wallet);

module.exports = {
  action: 'connect',
  claims: {
    signature: async ({ userAddress, extraParams: { carId } }) => {
      const address = toDelegateAddress(userAddress, carId);

      return {
        txType: 'DelegateTx',
        txData: {
          itx: {
            address,
            to: carId,
            ops: [
              {
                typeUrl: 'fg:t:transfer',
                rules: [],
              },
              // {
              //   typeUrl: 'fg:t:aggregate',
              //   rules: [],
              // },
            ],
          },
        },
        description: 'Sign this transaction to connect your car with wallet',
      };
    },
  },

  // eslint-disable-next-line object-curly-newline
  onAuth: async ({ claims, userDid, userAddress, token, storage, extraParams: { carId } }) => {
    console.log('connect.onAuth', { claims, userDid, carId });
    try {
      const claim = claims.find(x => x.type === 'signature');
      const tx = ForgeSDK.decodeTx(multibase.decode(claim.origin));
      const user = fromAddress(userDid);

      const hash = await ForgeSDK.sendDelegateTx({
        tx,
        wallet: user,
        signature: claim.sig,
      });
      console.log('connect.onAuth', hash);

      const hash2 = await ForgeSDK.sendTransferTx({
        tx: {
          itx: {
            to: userAddress,
            value: fromTokenToUnit(10000, 18),
          },
        },
        wallet,
      });
      console.log('connect.onAuth.fund', hash2);

      await storage.update(token, { did: userDid, owner: userAddress });
      console.log('connect.onAuth.persist', hash2);
      return { hash, tx: claim.origin };
    } catch (err) {
      console.error('connect.onAuth.error', err);
      throw new Error('Car connect failed');
    }
  },
};
