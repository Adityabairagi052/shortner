const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const BASE = ALPHABET.length;

// Encode integer to Base62 string
const encodeBase62 = (num) => {
  if (num === 0) return ALPHABET[0];
  let str = '';
  while (num > 0) {
    str = ALPHABET[num % BASE] + str;
    num = Math.floor(num / BASE);
  }
  return str;
};

// Decode Base62 string to integer
const decodeBase62 = (str) => {
  let num = 0;
  for (let i = 0; i < str.length; i++) {
    num = num * BASE + ALPHABET.indexOf(str[i]);
  }
  return num;
};

module.exports = {
  encodeBase62,
  decodeBase62
};
