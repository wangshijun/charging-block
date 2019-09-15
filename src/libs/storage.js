export function get(key) {
  const value = localStorage.getItem(key);
  if (value) {
    try {
      return JSON.parse(value);
    } catch (e) {
      // Do nothing
    }
  }
  return undefined;
}

export function set(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}

export function getCarWallet() {
  return get('car_wallet');
}

export function setCarWallet(value) {
  return set('car_wallet', value);
}

export function getCarOwner() {
  return get('car_owner');
}

export function setCarOwner(value) {
  return set('car_owner', value);
}

export function getChargingAmount() {
  return get('charging_amount');
}

export function setChargingAmount(value) {
  return set('charging_amount', value);
}

export function getChargingPole() {
  return get('charging_pole');
}

export function setChargingPole(value) {
  return set('charging_pole', value);
}

export function getChargingId() {
  return get('charging_id');
}

export function setChargingId(value) {
  return set('charging_id', value);
}

export function getChargingPoleId() {
  return get('charging_pole_id');
}

export function setChargingPoleId(value) {
  return set('charging_pole_id', value);
}
