# Documentação do Módulo de Autenticação e Segurança

Esta documentação detalha a arquitetura de segurança e o fluxo de autenticação implementados no sistema, destacando o uso do algoritmo Argon2id para a proteção de credenciais e a aplicação do padrão de projeto Strategy para garantir flexibilidade e manutenibilidade no gerenciamento de dados.

## 1. O Padrão Strategy (`AuthenticationStrategy`)

O padrão Strategy (Estratégia) é um padrão de projeto comportamental que permite definir uma família de algoritmos, encapsular cada um deles e torná-los intercambiáveis. No contexto deste sistema, ele é utilizado para desacoplar a lógica de autenticação (regras de negócio de login e cadastro) da infraestrutura de armazenamento de dados.

### Finalidade e Benefícios

- **Abstração de Infraestrutura**: Os componentes da interface de usuário (como formulários de login) interagem exclusivamente com a interface AuthenticationStrategy, sem conhecimento se os dados provêm de uma API real, de um banco de dados local ou de mocks.

- **Baixo Acoplamento**: Facilita a substituição ou modificação do mecanismo de persistência de dados sem impactar as demais camadas da aplicação.

- **Princípio do Open/Closed (Solid)**: Novas estratégias de autenticação podem ser introduzidas no sistema sem a necessidade de modificar o código existente.

## 2. Serviço de Criptografia (Argon2IdService)

A proteção de senhas é realizada através do **`Argon2id`**, uma variante do **Argon2** que combina as defesas contra ataques de canal lateral (do Argon2i) e ataques de força bruta baseados em hardware/GPUs (do Argon2d). A implementação utiliza a biblioteca **`hash-wasm`**, que executa o algoritmo via **WebAssembly** para garantir alta performance diretamente no ambiente cliente.

O `Argon2IdService` encapsula duas operações fundamentais:

### Geração de Hash (createHash)

```
A criação do hash ocorre de forma assíncrona recebendo a senha em texto puro:

[ Entropia de Salt ]: É gerado um vetor de bytes pseudo-aleatório seguro de 16 bytes utilizando a Web Crypto API (crypto.getRandomValues).

[ Persistência do Salt ]: O Uint8Array gerado é convertido em uma representação string hexadecimal de dois dígitos por caractere e armazenado na propriedade pública "LastSaltGenerated" para uso subsequente na criação de um novo usuário com o salt armazenável, e com os dados resetados a cada nova instância.

[ Derivação da Chave ]: O método argon2id processa a senha e o salt com configurações de alta segurança (4 threads de paralelismo, 100 iterações e 64 MB de memória), retornando uma string codificada no padrão modular de criptografia.
```

### Verificação de Senha (verifyPassword)

```
A validação de credenciais durante o acesso ocorre através do método verifyPassword, que recebe o hash armazenado e a senha informada no ato do login. O método argon2Verify extrai automaticamente os parâmetros e o salt de dentro da string do hash original para validar se a senha fornecida corresponde ao registro seguro.
```

## 3. Estratégia de Autenticação Mockada (`MockedHttpAuthStrategyService`)

Atuando temporariamente como substituto de um ecossistema backend, a classe **`MockedHttpAuthStrategyService`** implementa a interface _**`AuthenticationStrategy`**_ para unificar dados estáticos oriundos de uma **_API mockada (Gist externo)_** e dados dinâmicos criados localmente.

```

                  ┌───────────────────────────────┐
                  │ MockedHttpAuthStrategyService │
                  └───────────────┬───────────────┘
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
┌──────────────────┐                              ┌──────────────────┐
│  Gist API URL    │                              │  Local Storage   │
│ (Contas Iniciais)│                              │ (Novos Cadastros)│
└────────┬─────────┘                              └────────┬─────────┘
         │                                                 │
         └────────────────────────┬────────────────────────┘
                                  ▼
                     ┌─────────────────────────┐
                     │ Objeto Único Mesclado   │
                     │ (Chaves Indexadas "0"..)│
                     └─────────────────────────┘
```

## Fluxo de Registro (`register`)

```
A senha recebida do modelo CreateAccountModel é submetida ao método createHash do Argon2IdService.

O conteúdo existente sob a chave configurada no localStorage é recuperado. Caso esteja vazio, inicializa-se a estrutura base '{"accounts": {}, "authentications": {}}'.

Para manter a compatibilidade com estruturas de dados baseadas em dicionários indexados sequencialmente, o próximo índice numérico disponível é obtido dinamicamente a partir do comprimento das chaves do objeto atualizado (Object.keys().length).

O novo registro é mapeado para o contrato AccountModel, incluindo o UUID gerado para a conta, o salt criptográfico em formato hexadecimal e carimbos de data.

A nova conta é indexada e reinserida serializada no armazenamento local.
```

## Fluxo de Autenticação (`Login`)

```
Ambas as fontes de dados (API remota e Local Storage) são consultadas em paralelo.

É realizada uma operação de espalhamento (spread) para unificar os registros no objeto mergedDataAccounts.

Os sub-objetos do dicionário são transformados em um array iterável via Object.values() para permitir o uso do método .find().

O sistema busca a ocorrência do e-mail informado. Caso seja localizado, o hash contido na propriedade password do registro é enviado juntamente com a senha em texto puro para o Argon2IdService.verifyPassword.

O acesso é concedido exclusivamente se a assinatura criptográfica for validada com sucesso.
```

## 4. Transição para o Ambiente Real de Produção

Quando a infraestrutura de backend estiver disponível, a transição arquitetural dispensa modificações nos componentes de interface. O procedimento padrão consiste na criação de uma nova estratégia de autenticação e na reconfiguração do contêiner de Injeção de Dependências do Angular.

### Passos para Implementação em Produção

1. Criação da Estratégia de Produção:
   Deve ser desenvolvida uma nova classe, por exemplo, **`HttpAuthStrategyService`**, que implemente rigorosamente a mesma interface **`AuthenticationStrategy`**.
   Esta classe direcionará as requisições HTTP (`POST /api/auth/login e POST /api/auth/register`) para o servidor real, delegando a responsabilidade do cálculo do **`Argon2id`** e gerenciamento de salts para o backend.

2. Substituição do Provedor no Angular:
   No arquivo de configuração de rotas ou módulo central da aplicação (`app.config.ts ou app.module.ts`), altera-se o token de injeção da estratégia para apontar para a classe de produção.

```typescript
// Exemplo de configuração no ecossistema Angular
export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: AuthenticationStrategy,
      useClass: HttpAuthStrategyService, // Substitui a versão MockedHttpAuthStrategyService
    },
  ],
};
```

## **`[Observação]`**

```
Em uma arquitetura de produção real, o processo de hashing com Argon2id deve preferencialmente ser executado do lado do servidor (Backend) para proteger as chaves secretas globais (pepper) e mitigar riscos de exposição do algoritmo em ambiente cliente, utilizando o transporte seguro via TLS (HTTPS) para o tráfego das credenciais em texto limpo até o endpoint de autenticação.

A implementação existente atual é apenas para finalidades de prática e testes, além de entender como é utilizado o Argon2Id no Angular e como implementá-lo.
```
