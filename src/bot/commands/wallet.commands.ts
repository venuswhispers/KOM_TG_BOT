import { 
    exportWallet,
    createWallet,
    importWallet
} from '../controllers/wallet/wallet.controller';

export default (_bot: any) => {

    // wallet creation handler
    _bot.command('create_wallet', createWallet);
    _bot.action ('create_wallet', createWallet);

    // wallet import handler
    _bot.command('import_wallet', importWallet);
    _bot.action ('import_wallet', importWallet);

    // wallet export handler
    _bot.command("export_wallet", exportWallet);
    _bot.action ("export_wallet", exportWallet);

}