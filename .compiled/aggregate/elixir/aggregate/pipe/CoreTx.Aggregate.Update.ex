defmodule CoreTx.Aggregate.Update do
  @moduledoc(false)
  use ForgePipe.Builder
  pipe CoreTx.Aggregate.UpdateTx, []
end