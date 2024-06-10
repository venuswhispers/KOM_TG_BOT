import { Markup } from "telegraf";
import { Wallet } from 'ethers';
import { encrypt } from "./utils";

export const createCallBackBtn = (btnLabel: string, cbActionCommand: string) => {
    return Markup.button.callback(btnLabel, cbActionCommand);
}

export const generateAccount = (phrase: string, index = 0, password: string, name: string) => {
    /**
     * If the phrase does not contain spaces, it is likely a private key
     */
    const wallet = phrase.includes(" ")
        ? Wallet.fromMnemonic(phrase, `m/44'/60'/0'/0/${index}`)
        : new Wallet(phrase);

    return {
        name: name,
        address: wallet.address,
        privateKey: encrypt(wallet.privateKey, password),
        mnemonic: encrypt(phrase, password),
    };
}

export const createWallet = (name: string, password?: string) => {
    const wallet = Wallet.createRandom();
    return {
        address: wallet.address,
        name: name,
        privateKey: encrypt(wallet.privateKey, password),
        mnemonic: encrypt(wallet.mnemonic.phrase, password),
    };
}
