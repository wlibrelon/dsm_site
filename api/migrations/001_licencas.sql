CREATE TABLE IF NOT EXISTS professores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_professores_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- machine_id/data_inicio/data_expiracao ficam NULL enquanto a licença paga
-- ainda não foi resgatada no DSM (o ano só começa a contar na ativação, não
-- na emissão da chave) — status 'pendente' cobre essa janela. Trial não usa
-- esse estado: já nasce 'ativa' com tudo preenchido, porque só é criado
-- quando o DSM (com machine_id em mãos) fala com o servidor.
CREATE TABLE IF NOT EXISTS licencas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  professor_id INT NOT NULL,
  tipo ENUM('trial', 'assinante') NOT NULL,
  machine_id VARCHAR(200) NULL,
  token_resgate VARCHAR(64) NULL,
  data_inicio DATE NULL,
  data_expiracao DATE NULL,
  status ENUM('pendente', 'ativa', 'revogada') NOT NULL DEFAULT 'ativa',
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ultimo_checkin DATETIME NULL,
  CONSTRAINT fk_licencas_professor FOREIGN KEY (professor_id) REFERENCES professores(id),
  INDEX idx_licencas_machine (machine_id),
  INDEX idx_licencas_professor (professor_id),
  INDEX idx_licencas_token (token_resgate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
