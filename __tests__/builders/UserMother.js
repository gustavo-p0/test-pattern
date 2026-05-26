import { User } from '../../src/domain/User.js';

class UserMother {
  /**
   * Retorna um usuário padrão com dados fixos e realistas.
   */
  static umUsuarioPadrao() {
    return new User(1, 'João Silva', 'joao@email.com', 'PADRAO');
  }

  /**
   * Retorna um usuário premium com e-mail específico.
   */
  static umUsuarioPremium() {
    return new User(2, 'Maria Premium', 'premium@email.com', 'PREMIUM');
  }
}

export default UserMother;
