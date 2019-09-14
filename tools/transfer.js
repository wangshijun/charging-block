const ForgeSDK = require('@arcblock/forge-sdk');
const { ensureModeratorSecretKey } = require('./util');

ForgeSDK.connect('http://127.0.0.1:8210/api');

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
