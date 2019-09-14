defmodule ForgeAbi.AggregateTx do
  @moduledoc false
  use Protobuf, syntax: :proto3

  @type t :: %__MODULE__{
          poleId: String.t(),
          carId: String.t(),
          value: ForgeAbi.BigUint.t(),
          time: Google.Protobuf.Timestamp.t(),
          operator: String.t(),
          manufacturer: String.t(),
          supplier: String.t(),
          location: String.t(),
          data: Google.Protobuf.Any.t()
        }
  defstruct [
    :poleId,
    :carId,
    :value,
    :time,
    :operator,
    :manufacturer,
    :supplier,
    :location,
    :data
  ]

  field :poleId, 1, type: :string
  field :carId, 2, type: :string
  field :value, 3, type: ForgeAbi.BigUint
  field :time, 4, type: Google.Protobuf.Timestamp
  field :operator, 5, type: :string
  field :manufacturer, 6, type: :string
  field :supplier, 7, type: :string
  field :location, 8, type: :string
  field :data, 15, type: Google.Protobuf.Any
end
