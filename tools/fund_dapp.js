require('dotenv').config();

const ForgeSDK = require('@arcblock/forge-sdk');
const { ensureModeratorSecretKey } = require('./util');

ForgeSDK.connect('http://127.0.0.1:8210/api');

(async () => {
  const sk = ensureModeratorSecretKey();
  const moderator = ForgeSDK.Wallet.fromSecretKey(sk);

  // Transfer to application
  const hash2 = await ForgeSDK.sendTransferTx({
    tx: {
      itx: {
        to: process.env.APP_ID,
        value: ForgeSDK.Util.fromTokenToUnit(1000000, 18),
      },
    },
    wallet: moderator,
  });
  console.log(`application funded: ${hash2}`);
})();
