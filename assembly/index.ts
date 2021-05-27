//@nearfile
/**
 * A fungible token implementation. Mostly ERC20 compliant.
 */

import { u128, logging, context, storage, PersistentMap } from "near-sdk-as";

const balances = new PersistentMap<string, u64>("b:");
const allowances = new PersistentMap<string, u64>("a:");

let NAME: string;
let SYMBOL: string;
let TOTAL_SUPPLY: u64;

let owner: string;
let initialzed: bool = false;

/**
 * Initializes the contract.
 */

export function init(name: string, symbol: string, initial_supply: u64): void {
    if (initialzed) return;
    NAME = name;
    SYMBOL = symbol;
    TOTAL_SUPPLY = initial_supply;

    owner = context.sender;
}

/**
 * Get the token's name. Cosmetic detail.
 * @returns The token's name.
 */
export function name(): string {
    return NAME;
}

/**
 * Get the token's symbol.
 * @returns The token's symbol.
 */
export function symbol(): string {
    return SYMBOL;
}

/**
 * Get the total supply of the token.
 * @returns The token's total supply.
 */
export function totalSupply(): string {
    return totalSupply.toString();
}

/**
 * Get the balance of an account.
 *
 * Returns 0 if the owner's account doesn't exist.
 *
 * @param ownerId The account ID.
 * @returns `ownerId`'s balance.
 */
export function balanceOf(ownerId: string): u64 {
    return balances.contains(owner) ? balances.getSome(ownerId) : 0;
}

/**
 * Transfers `value` tokens to the account with the address `to`.
 *
 * Requirements:
 *
 * - The sender's balance must be greater than or equal to `value`.
 * - The sender must not be blank and the sender's account must exist.
 *
 * @param to The account to transfer to.
 * @param value The number of tokens to transfer.
 * @returns Success.
 */
export function transfer(to: string, value: u64): bool {
    const sender = context.sender;

    assert(sender, "Sender cannot be blank");
    assert(
        balances.contains(sender) && balanceOf(sender) > 0,
        "Sender balance must be greater than 0"
    );

    const senderBal = balances.getSome(sender);
    const recepientBal = balances.getSome(to);

    assert(senderBal >= value, "Sender balance");
    balances.set(sender, senderBal - value);
    balances.set(to, recepientBal + value);

    return true;
}

/**
 * Transfers `value` tokens from account `from` to account `to`.
 *
 * Fails if the token owner has not approved the transfer.
 *
 * @param from The account to transfer from.
 * @param to The account to transfer to.
 * @param value The amount of tokens to transfer.
 * @returns Success.
 */
export function transferFrom(from: string, to: string, value: u64): bool {
    const fromBalance = balanceOf(from);
    assert(
        fromBalance >= value,
        "Balance must be greater than or equal to value"
    );

    assert(
        value <= allowance(from, to),
        "The amount of tokens exceeds the sender's allowance."
    );
    assert(
        balanceOf(to) <= balanceOf(to) + value,
        "Overflow on the recipient's side."
    );

    balances.set(from, balanceOf(from) - value);
    balances.set(to, balanceOf(to) + value);

    return true;
}

/**
 * Set the allowance for `spender`.
 */
export function approve(spender: string, value: u64): bool {
    allowances.set(`${context.sender}:${spender}`, value);
    return true;
}

/**
 * Get the allowance of `owner` to `spender`.
 * @param owner The token owner.
 * @param spender The token spender.
 */
export function allowance(owner: string, spender: string): u64 {
    const key = `${owner}:${spender}`;
    return allowances.contains(key) ? allowances.getSome(key) : 0;
}
