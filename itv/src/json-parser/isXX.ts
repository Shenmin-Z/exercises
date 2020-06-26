// https://github.com/antlr/grammars-v4/blob/master/json/JSON.g4

/********** Number **********/
let isINT = `0|[1-9][0-9]*`;

let isEXP = `[Ee][\\+\\-]?(${isINT})`;

export let isNUMBER = `-?(${isINT})(\\.\\d+)?(${isEXP})?`;

/********** String **********/
let isHEX = `[0-9a-fA-F]`;

let isUNICODE = `\\u${isHEX}${isHEX}${isHEX}${isHEX}`;

let isESC = `\\\\(["\\\\\\/bfnrt]|${isUNICODE})`;

let isSAFECODEPOINT = `[^\\u0000-\\u001F]`;
export let isSTRING = `"(${isESC}|${isSAFECODEPOINT})*"`;
