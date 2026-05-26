  describe('quando o pagamento falha', () => {
    it('deve retornar null e não salvar o pedido', async () => {
      // ARRANGE
      const carrinho = new CarrinhoBuilder().build();

      // Stub: controla o retorno — não nos importa a interação
      const gatewayStub = {
        cobrar: jest.fn().mockResolvedValue({ success: false }),
      };

      // Dummies: dependências que não devem ser chamadas neste fluxo
      const repositoryDummy = {
        salvar: jest.fn(),
      };
      const emailDummy = {
        enviarEmail: jest.fn(),
      };

      const checkoutService = new CheckoutService(
        gatewayStub,
        repositoryDummy,
        emailDummy
      );

      // ACT
      const pedido = await checkoutService.processarPedido(carrinho, {});

      // ASSERT — Verificação de Estado
      expect(pedido).toBeNull();

      // Garantia extra: os dummies não foram acionados
      expect(repositoryDummy.salvar).not.toHaveBeenCalled();
      expect(emailDummy.enviarEmail).not.toHaveBeenCalled();
    });
  });
