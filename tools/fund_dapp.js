require('dotenv').config();

const ForgeSDK = require('@arcblock/forge-sdk');
const { ensureModeratorSecretKey } = require('./util');
const env = require('../src/libs/env');

ForgeSDK.connect(env.chainHost, { chainId: env.chainId });

(async () => {
  const sk = ensureModeratorSecretKey();
  const moderator = ForgeSDK.Wallet.fromSecretKey(sk);

  // Transfer to application
  const hash2 = await ForgeSDK.sendTransferTx({
    tx: {
      itx: {
        to: process.env.APP_ID,
        value: ForgeSDK.Util.fromTokenToUnit(10000000, 18),
      },
    },
    wallet: moderator,
  });
  console.log(`application funded: ${hash2}`);
})();
