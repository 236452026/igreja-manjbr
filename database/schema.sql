-- ESTRUTURA DO BANCO. Executar com o banco "manjbr" já selecionado.
-- Compatível com MySQL 8.0 e 8.4.

CREATE TABLE IF NOT EXISTS ministerios (
  id         INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  nome       VARCHAR(100)      NOT NULL,                    -- nome do ministério
  descricao  VARCHAR(500)      NULL,                        -- texto de apresentação
  lider      VARCHAR(100)      NULL,                        -- responsável (exige autorização dele para publicar)
  imagem     VARCHAR(255)      NULL,                        -- só o NOME do arquivo (ex.: ministerio-louvor.jpg), em public/images
  ativo      TINYINT(1)        NOT NULL DEFAULT 1,          -- 1 = aparece no site, 0 = oculto
  ordem      SMALLINT UNSIGNED NOT NULL DEFAULT 0,          -- ordem de exibição (menor aparece primeiro)
  created_at TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_ativo_ordem (ativo, ordem)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;