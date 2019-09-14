defmodule CoreTx.Aggregate.Verify do
  @moduledoc(false)
  use ForgePipe.Builder
  pipe Forge.Pipe.VerifyInfo, conditions: [%{error: :insufficient_data, expr: "info.itx.value !== nil and info.itx.operator !== \\\"\\\" and info.itx.manufacturer !== \\\"\\\" and info.itx.supplier !== \\\"\\\" and info.itx.location !== \\\"\\\" \""}, %{error: :invalid_nonce, expr: "info.tx.nonce == 0"}]
  pipe Forge.Pipe.ExtractState, from: [:itx, :operator], status: :invalid_tx, to: [:priv, :operator_state]
  pipe Forge.Pipe.ExtractState, from: [:itx, :manufacturer], status: :invalid_tx, to: [:priv, :manufacturer_state]
  pipe Forge.Pipe.ExtractState, from: [:itx, :supplier], status: :invalid_tx, to: [:priv, :supplier_state]
  pipe Forge.Pipe.ExtractState, from: [:itx, :location], status: :invalid_tx, to: [:priv, :location_state]
end