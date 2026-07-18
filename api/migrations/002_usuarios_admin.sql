-- V2 - Usuários com acesso ao painel administrativo (monitoramento de
-- licenças). Totalmente separado de `professores` (que são os usuários do
-- DSM, sem senha nenhuma no servidor de licenças). Senha guardada como hash
-- bcrypt, nunca em texto puro.

CREATE TABLE IF NOT EXISTS usuarios_admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(200) NOT NULL,
    senha_hash VARCHAR(200) NOT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_usuarios_admin_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Usuário inicial: warlen@librelon.com.br / libdsm@123 (hash bcrypt abaixo).
-- Troque a senha pelo próprio painel assim que fizer o primeiro login.
INSERT INTO usuarios_admin (email, senha_hash)
VALUES ('warlen@librelon.com.br', '$2b$10$JB.hySNkF4XINpW8n9cE3Oogf0hImzj0JJ.YWlsgVTQfx8mfhoswG')
ON DUPLICATE KEY UPDATE email = email;
