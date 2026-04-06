"use strict";
// calc_impact.ts
// Calculate theoretical impact of the max_stake bug
// TON network currently has a max validator stake.
// If a validator accidentally stakes more than this limit (e.g., due to a software bug,
// a user typo, or because the network config param 17 max_stake was lowered before an election),
// they will lose the entire excess amount.
const typical_max_stake = 300000; // 300k TON (often used on testnets/mainnets)
const validator_total_stake = 500000; // A validator trying to stake 500k TON
const lost_ton = validator_total_stake - typical_max_stake;
console.log(`Typical max_stake value: ${typical_max_stake} TON`);
console.log(`Validator total stake sent: ${validator_total_stake} TON`);
console.log(`Funds permanently lost: ${lost_ton} TON`);
console.log(`Assuming current TON price (~$5 USD/TON), the financial loss is ~$${lost_ton * 5} USD for just ONE mistaken validator.`);
