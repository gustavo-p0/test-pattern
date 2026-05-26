  describe('quando um cliente Premium finaliza a compra', () => {
    it('deve aplicar desconto de 10% e enviar e-mail de confirmação', async () => {
      // ARRANGE
      const usuarioPremium = UserMother.umUsuarioPremium();

      const carrinho = new CarrinhoBuilder()
        .comUser(usuarioPremium)
        .comItens([
          { nome: 'Produto A', preco: 100, quantidade: 1 },
          { nome: 'Produto B', preco: 100, quantidade: 1 },
        ])
        .build();
      // Total: R$ 200,00 → com desconto PREMIUM (10%) → R$ 180,00

      const dadosCartao = { numero: '4111111111111111', cvv: '123' };

      // Stub: gateway retorna sucesso
      const gatewayStub = {
        cobrar: jest.fn().mockResolvedValue({ success: true }),
      };

      // Stub: repositório retorna pedido salvo (simulado)
      const pedidoSalvo = { id: 'pedido-001', status: 'APROVADO' };
      const repositoryStub = {
        salvar: jest.fn().mockResolvedValue(pedidoSalvo),
      };

      // Mock: queremos verificar INTERAÇÃO com o EmailService
      const emailMock = {
        enviarEmail: jest.fn().mockResolvedValue(undefined),
      };

      const checkoutService = new CheckoutService(
        gatewayStub,
        repositoryStub,
        emailMock
      );

      // ACT
      const pedido = await checkoutService.processarPedido(carrinho, dadosCartao);

      // ASSERT — Verificação de Comportamento

      // 1. Gateway foi chamado com valor correto (desconto aplicado)
      expect(gatewayStub.cobrar).toHaveBeenCalledWith(180, dadosCartao);

      // 2. E-mail foi enviado exatamente 1 vez
      expect(emailMock.enviarEmail).toHaveBeenCalledTimes(1);

      // 3. E-mail foi enviado para o endereço correto com assunto correto
      expect(emailMock.enviarEmail).toHaveBeenCalledWith(
        'premium@email.com',
        'Seu Pedido foi Aprovado!',
        expect.any(String) // corpo do e-mail — qualquer string
      );

      // 4. O pedido retornado não é nulo (fluxo de sucesso)
      expect(pedido).not.toBeNull();
    });
  });
