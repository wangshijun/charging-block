require('dotenv').config();

const ForgeSDK = require('@arcblock/forge-sdk');
const { ensureModeratorSecretKey } = require('./util');
const env = require('../src/libs/env');

ForgeSDK.connect({ endpoint: env.chainHost, chainId: env.chainId });

(async () => {
  const sk = ensureModeratorSecretKey();
  const moderator = ForgeSDK.Wallet.fromSecretKey(sk);
  const receiver = ForgeSDK.Wallet.fromRandom();
  console.log('receiver', JSON.stringify(receiver.toJSON(), true, '  '));

  // Declare the receiver
  const hash = await ForgeSDK.sendDeclareTx({
    tx: {
      itx: { moniker: 'receiver' },
    },
    wallet: receiver,
  });
  console.log(`receiver declare hash ${hash}`);

  // Transfer to receiver
  const hash2 = await ForgeSDK.sendTransferTx({
    tx: {
      itx: {
        // to: receiver.toAddress(),
        to: process.argv[2],
        value: ForgeSDK.Util.fromTokenToUnit(1000000, 18),
      },
    },
    wallet: moderator,
  });
  console.log(`receiver transfer hash ${hash2}`);
})();
