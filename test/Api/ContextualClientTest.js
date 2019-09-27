const Client = Fazland.Atlante.Api.Client;
const RequestorInterface = Fazland.Atlante.Requestor.RequestorInterface;
const StorageInterface = Fazland.Atlante.Storage.StorageInterface;
const ItemInterface = Fazland.Atlante.Storage.ItemInterface;

const Prophet = Jymfony.Component.Testing.Prophet;
const Argument = Jymfony.Component.Testing.Argument.Argument;
const { expect } = require('chai');

describe('[Api] ContextualClient', function () {
    beforeEach(() => {
        /**
         * @type {Jymfony.Component.Testing.Prophet}
         *
         * @private
         */
        this._prophet = new Prophet();

        this._requestor = this._prophet.prophesize(RequestorInterface);
        this._tokenStorage = this._prophet.prophesize(StorageInterface);
        this._userTokenStorage = this._prophet.prophesize(StorageInterface);
        this._client = new Client(
            this._requestor.reveal(),
            this._tokenStorage.reveal(),
            {
                client_id: 'foo_id',
                client_secret: 'foo_secret',
            }
        ).withContext(this._userTokenStorage.reveal());
    });

    afterEach(() => {
        this._prophet.checkPredictions();
    });

    it('should use user token to make request', async () => {
        const clientToken = this._prophet.prophesize(ItemInterface);
        clientToken.isHit().willReturn(true);
        clientToken.get().willReturn('TEST TOKEN');

        const response = { data: {}, status: 200, statusText: 'OK' };

        this._userTokenStorage.getItem('access_token')
            .shouldBeCalled()
            .willReturn(clientToken)
        ;

        this._requestor
            .request('GET', '/', {
                Authorization: 'Bearer TEST TOKEN',
                Accept: 'application/json',
            }, null)
            .shouldBeCalled()
            .willReturn(response)
        ;

        expect(await this._client.request('GET', '/'))
            .to.be.equal(response)
        ;
    });

    it('should request a new token via refresh token', async () => {
        const clientToken = this._prophet.prophesize(ItemInterface);
        clientToken.isHit().willReturn(false);
        clientToken.set('TEST TOKEN').willReturn();
        clientToken.get().willReturn('TEST TOKEN');
        clientToken.expiresAfter(3540).willReturn();

        const refreshToken = this._prophet.prophesize(ItemInterface);
        refreshToken.isHit().willReturn(true);
        refreshToken.get().willReturn('REFRESH TOKEN');
        refreshToken.set('REFRESH AGAIN').willReturn();

        const response = { data: {}, status: 200, statusText: 'OK' };
        const tokenResponse = {
            data: {
                access_token: 'TEST TOKEN',
                expires_in: 3600,
                refresh_token: 'REFRESH AGAIN'
            }, status: 200, statusText: 'OK'
        };

        this._userTokenStorage.getItem('access_token').willReturn(clientToken);
        this._userTokenStorage.getItem('refresh_token').willReturn(refreshToken);

        this._userTokenStorage.save(clientToken).shouldBeCalled();
        this._userTokenStorage.save(refreshToken).shouldBeCalled();

        this._requestor
            .request('POST', '/token', {}, {
                grant_type: 'refresh_token',
                client_id: 'foo_id',
                client_secret: 'foo_secret',
                refresh_token: 'REFRESH TOKEN',
            })
            .shouldBeCalled()
            .willReturn(tokenResponse)
        ;

        this._requestor
            .request('GET', '/', {
                Authorization: 'Bearer TEST TOKEN',
                Accept: 'application/json',
            }, null)
            .willReturn(response)
        ;

        expect(await this._client.request('GET', '/'))
            .to.be.equal(response)
        ;
    });

    it ('authenticate should request a new token', async () => {
        const clientToken = this._prophet.prophesize(ItemInterface);
        clientToken.isHit().willReturn(false);
        clientToken.set('TEST TOKEN').willReturn();
        clientToken.expiresAfter(3540).willReturn();

        const refreshToken = this._prophet.prophesize(ItemInterface);
        refreshToken.isHit().willReturn(true);
        refreshToken.set('REFRESH TOKEN').willReturn();

        this._userTokenStorage.getItem('access_token').willReturn(clientToken);
        this._userTokenStorage.getItem('refresh_token').willReturn(refreshToken);

        this._userTokenStorage.save(clientToken).shouldBeCalled();
        this._userTokenStorage.save(refreshToken).shouldBeCalled();

        const tokenResponse = {
            data: {
                access_token: 'TEST TOKEN',
                expires_in: 3600,
                refresh_token: 'REFRESH TOKEN'
            }, status: 200, statusText: 'OK'
        };

        this._requestor
            .request('POST', '/token', {}, {
                grant_type: 'password',
                client_id: 'foo_id',
                client_secret: 'foo_secret',
                username: 'username',
                password: 'password'
            })
            .shouldBeCalled()
            .willReturn(tokenResponse)
        ;

        await this._client.authenticate('username', 'password');
    });

    it ('requests after token expiration should refresh the token', async () => {
        const clientToken = this._prophet.prophesize(ItemInterface);
        clientToken.isHit().willReturn(false);
        clientToken.set('TEST TOKEN').willReturn();
        clientToken.expiresAfter(3540).willReturn();

        const refreshToken = this._prophet.prophesize(ItemInterface);
        refreshToken.isHit().willReturn(true);
        refreshToken.set('REFRESH TOKEN').willReturn();
        refreshToken.get().willReturn('OLD REFRESH TOKEN');

        this._userTokenStorage.getItem('access_token').will(async () => {
            await __jymfony.sleep(50);

            return clientToken.reveal();
        });
        this._userTokenStorage.getItem('refresh_token').will(async () => {
            await __jymfony.sleep(50);

            return refreshToken.reveal();
        });

        this._userTokenStorage.save(clientToken)
            .shouldBeCalledTimes(1)
            .will(async function () {
                clientToken.isHit().willReturn(true);
                clientToken.get().willReturn('TEST TOKEN');
            });

        this._userTokenStorage.save(refreshToken)
            .shouldBeCalledTimes(1)
            .will(async () => { await __jymfony.sleep(20); });

        const tokenResponse = {
            data: {
                access_token: 'TEST TOKEN',
                expires_in: 3600,
                refresh_token: 'REFRESH TOKEN'
            }, status: 200, statusText: 'OK'
        };

        this._requestor.request('GET', '/', Argument.any(), Argument.any())
            .willReturn({ data: {}, status: 200, statusText: 'OK' }).shouldBeCalledTimes(1);
        this._requestor.request('POST', '/resources', Argument.any(), Argument.any())
            .willReturn({ data: {}, status: 200, statusText: 'OK' }).shouldBeCalledTimes(1);
        this._requestor.request('PATCH', '/res1', Argument.any(), Argument.any())
            .willReturn({ data: {}, status: 200, statusText: 'OK' }).shouldBeCalledTimes(1);

        this._requestor
            .request('POST', '/token', {}, {
                grant_type: 'refresh_token',
                client_id: 'foo_id',
                client_secret: 'foo_secret',
                refresh_token: 'OLD REFRESH TOKEN',
            })
            .shouldBeCalledTimes(1)
            .will(async () => {
                await __jymfony.sleep(100);

                return tokenResponse;
            })
        ;

        const r1 = this._client.get('/');
        const r2 = this._client.post('/resources');
        const r3 = this._client.patch('/res1');

        await Promise.all([ r1, r2, r3 ]);
    });
});
