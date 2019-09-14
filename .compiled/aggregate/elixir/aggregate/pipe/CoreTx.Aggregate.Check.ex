defmodule CoreTx.Aggregate.Check do
  @moduledoc(false)
  use ForgePipe.Builder
  pipe Forge.Pipe.VerifyInfo, conditions: [%{error: :insufficient_data, expr: "info.itx.sku !== \"\" and info.itx.value !== nil and info.itx.time !== nil and info.itx.operator !== \"\" and info.itx.manufacturer !== \"\" and info.itx.supplier !== \"\" and info.itx.location !== \"\" "}, %{error: :invalid_nonce, expr: "info.tx.nonce == 0"}]
end