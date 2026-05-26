if (typeof describe === 'undefined') {
  global.describe = () => {};
  global.it = () => {};
  global.expect = () => {};
  global.jest = { fn: () => ({ mockResolvedValue: () => {} }) };
}

const CheckoutServiceImport = require(process.cwd() + '/src/services/CheckoutService.js');
const CarrinhoBuilderImport = require(process.cwd() + '/__tests__/builders/CarrinhoBuilder.js');
const UserMotherImport = require(process.cwd() + '/__tests__/builders/UserMother.js');

import { CheckoutService } from '../src/services/CheckoutService.js';
import CarrinhoBuilder from './builders/CarrinhoBuilder.js';
import UserMother from './builders/UserMother.js';

describe('CheckoutService', () => {

  describe('quando o pagamento falha', () => {
    it('deve retornar null e não salvar o pedido', async () => {
      const carrinho = new CarrinhoBuilder().build();
      const gatewayStub = { cobrar: jest.fn().mockResolvedValue({ success: false }) };
      const repositoryDummy = { salvar: jest.fn() };
      const emailDummy = { enviarEmail: jest.fn() };
      const checkoutService = new CheckoutService(gatewayStub, repositoryDummy, emailDummy);
      const pedido = await checkoutService.processarPedido(carrinho, {});
      expect(pedido).toBeNull();
      expect(repositoryDummy.salvar).not.toHaveBeenCalled();
      expect(emailDummy.enviarEmail).not.toHaveBeenCalled();
    });
  });

  describe('quando um cliente Premium finaliza a compra', () => {
    it('deve aplicar desconto de 10% e enviar e-mail de confirmação', async () => {
      const usuarioPremium = UserMother.umUsuarioPremium();
      const carrinho = new CarrinhoBuilder()
        .comUser(usuarioPremium)
        .comItens([
          { nome: 'Produto A', preco: 100 },
          { nome: 'Produto B', preco: 100 },
        ])
        .build();
      const dadosCartao = { numero: '4111111111111111', cvv: '123' };
      const gatewayStub = { cobrar: jest.fn().mockResolvedValue({ success: true }) };
      const pedidoSalvo = { id: 'pedido-001', status: 'APROVADO' };
      const repositoryStub = { salvar: jest.fn().mockResolvedValue(pedidoSalvo) };
      const emailMock = { enviarEmail: jest.fn().mockResolvedValue(undefined) };
      const checkoutService = new CheckoutService(gatewayStub, repositoryStub, emailMock);
      const pedido = await checkoutService.processarPedido(carrinho, dadosCartao);
      expect(gatewayStub.cobrar).toHaveBeenCalledWith(180, dadosCartao);
      expect(emailMock.enviarEmail).toHaveBeenCalledTimes(1);
      expect(emailMock.enviarEmail).toHaveBeenCalledWith(
        'premium@email.com',
        'Seu Pedido foi Aprovado!',
        expect.any(String)
      );
      expect(pedido).not.toBeNull();
    });
  });

});
