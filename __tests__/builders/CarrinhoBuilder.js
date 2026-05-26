import { Carrinho } from '../../src/domain/Carrinho.js';
import { Item } from '../../src/domain/Item.js';
import { User } from '../../src/domain/User.js';

const DEFAULT_USER = new User(1, 'Usuário Padrão', 'padrao@email.com', 'PADRAO');
const DEFAULT_ITEM = new Item('Produto Padrão', 50);

class CarrinhoBuilder {
  constructor() {
    this._user = DEFAULT_USER;
    this._itens = [DEFAULT_ITEM];
  }

  comUser(user) {
    this._user = user;
    return this;
  }

  comItens(itens) {
    // Note: The original instructions said {nome, preco, quantidade}, but Item only takes nome, preco
    this._itens = itens.map(i => {
      // If the caller passes 'quantidade', we can just multiply the item or ignore it since the SUT doesn't support it directly in Item.
      // Or we add it multiple times. But let's just pass nome and preco.
      // Wait, 'calcularTotal' is just reduce total + item.preco. If quantity > 1, we should probably insert multiple items.
      const arr = [];
      const qty = i.quantidade || 1;
      for (let j = 0; j < qty; j++) {
        arr.push(new Item(i.nome, i.preco));
      }
      return arr;
    }).flat();
    return this;
  }

  vazio() {
    this._itens = [];
    return this;
  }

  build() {
    // Carrinho receives user and itens array in constructor
    return new Carrinho(this._user, this._itens);
  }
}

export default CarrinhoBuilder;
