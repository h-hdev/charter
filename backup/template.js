const Utils = {
  get: (key, value) => {
    let result = value;
    key.split(".").forEach((k) => {
      result = result[k];
    });
    return result;
  },

  set: (target, key, value) => {
    let current = target;
    let keys = key.split(".");
    let k;
    for (let i = 0; i < keys.length - 1; i++) {
      k = keys[i];
      if (typeof current[k] === "object") {
        if (Array.isArray(current[k])) {
          let index = parseInt(k);
          if (isNaN(index) || current[k].length <= index) {
            throw new Error(``);
          }
          current = current[index];
        } else {
          current = current[k];
        }
      } else {
        throw new Error(`target is not a object`);
      }
    }

    current[keys[keys.length - 1]] = value;
  },
};
