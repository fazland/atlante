const Namespace = Jymfony.Component.Autoloader.Namespace;

let registered = false;
if (! registered) {
    /**
     * @namespace
     */
    Fazland.Atlante.Stubs = new Namespace(__jymfony.autoload, 'Fazland.Atlante.Stubs', [
        __dirname,
    ]);

    registered = true;
}
