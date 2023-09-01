/**
 * 
 * @param {string} rut 
 * @returns 
 */


export default function validateRut(rut){
  const dv = rut.slice(-1);
  const cleanDNI = rut.slice(0,-1).replace(/\D/g, "");

  let arr = cleanDNI.split("").reverse();
  let acc = 0;
  let mult = 2;

  for (let num of arr) {
    acc += Number(num) * mult;
    mult += 1;
    if (mult > 7) mult = 2;
  }

  let aux = 11 - (acc % 11);

  if (dv === "k" || dv === "K") return aux === 0;
  if (dv === "0") return Number(dv) === 1;
  return aux === Number(dv);
}