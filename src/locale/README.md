# 🌐 Guia de Internacionalização (i18n) - Angular

Este documento detalha o ecossistema de localização implementado no projeto **testproj-login-example**. A estrutura utiliza a ferramenta nativa `@angular/localize` combinada com o pacote `ng-extract-i18n-merge` para automação, extração e sincronização dos arquivos de tradução.

---

## 🛠️ Tecnologias e Ferramentas Utilizadas

- **Mecanismo Nativo:** `@angular/localize`
- **Biblioteca de Sincronização:** `ng-extract-i18n-merge` (Versão `^3.4.0`)
  - _Objetivo:_ Automatizar o processo de merge, mantendo as chaves criadas na linguagem nativa sincronizadas com os arquivos de tradução secundários, sem perder os blocos `<target>` já traduzidos.

---

## 🗂️ Padrão de Nomenclatura dos Arquivos de Tradução

Todas as traduções são armazenadas no diretório `src/locale/`. O padrão obrigatório de nomenclatura dos arquivos XLIFF **(Localization Interchange File Format)** [`formato .xlf`] é:

```text
messages.<locale>.xlf
```

Onde `<locale>` representa o código correto e padronizado da linguagem/país. Exemplos:

- Francês (Canadá): messages.frCA.xlf
- Alemão (Alemanha): messages.deDE.xlf
- Inglês (EUA): messages.enUS.xlf

🔗 Nota Regulatória: Em caso de dúvidas sobre qual sigla utilizar caso seja necessário alterar as configurações do arquivo de configuração, consulte a lista de padrões ISO no site [Simple Localize IO](https://simplelocalize.io/data/locales/)

> Referência: `https://simplelocalize.io/data/locales/`

## ⚙️ Configuração do Sistema (`angular.json`)

O arquivo de configuração do ecossistema Angular foi estruturado para tratar o **Português (`pt`)** como idioma nativo de origem (`sourceLocale`), controlando a aplicação de novas linguagens por meio de configurações isoladas de build.

Para inserir novos locales deve realizar as seguintes alterações

No arquivo `angular.json`:

```json
{
  ...
  "projects": {
    "testproj-login-example": {
      ...
      "architect": {
        "build": {
          ...
          "configurations": {
            ...
            "en": {
              "localize": ["en"]
            }
            // adicione o novo locale abaixo seguindo o padrão indicado acima
            novoLocale: {
                "localize": [novoLocale]
            }
          },
          ...
        },
        "serve": {
          ...
          "configurations": {
            ...
            "en": {
              "buildTarget": "testproj-login-example:build:development,en"
            },
            // inserir o novo formato abaixo similar ao passado no "en"
            novoLocale: {
              "buildTarget": "testproj-login-example:build:development,novoFormato"
            }
          },
          ...
        },
        "extract-i18n": {
          ...
          "options": {
            ...
           // adicione o novo formato  logo a frente seguindo o padrão messages.<locale>.xlf
            "targetFiles": ["messages.enUS.xlf", messages.<locale>.xlf],
          }
        }
      },
      "i18n": {
        "sourceLocale": "pt",
        "locales": {
          "en": "src/locale/messages.enUS.xlf",
          // adicione logo abaixo o formato criado anteriormente indicando nome do locale, o caminho e o nome do arquivo no formato .xlf
          novoLocale: "src/locale/messages.<locale>.xlf"
        }
      }
    }
  }
}
```

Na alteração do script acima, é demonstrado como é adicionado um novo formato de locale. Após isso será necessário chamar o comando abaixo para que o arquivo do locale seja gerado na pasta `src/locale/`

```bash
npm run i18n-extract
```

### ➕ (Obrigatório): Criar o script de execução do locale criado

Agora para que as alterações sejam bem sucedidas e que o código mantenha-se atualizado é necessário que seja criado o script de execução do locale criado, para facilitar a manutenção do código em eventuais necessidades, facilitando tanto a manutenibilidade quanto auxiliando em testes futuros.

No arquivo `package.json`, adicione o seguinte script:

```json
"scripts": {
  ...
  "start:<locale>": "ng serve --configuration=<locale>"
}
```

> Onde: `<locale>` é o nome dado na configuração da linguagem anteriormente criada.

Exemplo, criaremos um script para o locale criado para a língua espanhol (es), ficará da seguinte forma:

```json
"scripts": {
  ...
  "start:es": "ng serve --configuration=es"
}
```

_**Dessa forma garantimos o melhor aproveitamento dos scripts quando houver a necessidade de testes e para garantir o funcionamento ideal dos locales**_

## 🚀 Scripts Disponíveis (`package.json`)

A seção de scripts abstrai a complexidade do Angular CLI, oferecendo comandos simplificados para o fluxo de desenvolvimento, extração e simulação multilíngue local.

Para acessar todos os camandos disponíveis acesse o `package.json` para visualizar os scripts existentes. Podendo executar cada um deles diretamente no _**Terminal (Prompt de Comandos do Windows)**_

### _Para inicializar com o locale padrão execute o seguinte comando:_

```bash
npm start
```

### _Para inicializar com o locale "en-US" execute o seguinte comando:_

```bash
npm run start:en
```

### _Para inicializar com o multiplos locales execute o seguinte comando:_

```bash
npm run start:multi
```

> O comando start:multi possibilitará a exxecução local tanto para o locale `/en/` quanto o `/pt/`,

## 🔄 Fluxo de Trabalho: Atualizando e Sincronizando Mensagens

Sempre que novas marcações `i18n` ou strings de código forem adicionadas ao projeto, siga o procedimento abaixo para garantir a integridade dos dados tanto em ambiente de desenvolvimento quanto em produção:

1. **Sincronizar Arquivos Locais:**
   Execute o comando de extração. O `ng-extract-i18n-merge` vai escanear o projeto, atualizar o arquivo mestre `messages.xlf` e injetar de forma segura os novos nós pendentes de tradução, por exemplo, no arquivo `messages.enUS.xlf`:

   ```bash
   npm run i18n-extract
   ```

2. **Traduzir os Termos:**
   Abra o arquivo `src/locale/messages.<locale>.xlf`, ***localize as tags <target> recém-criadas e insira as respectivas traduções**.

3. **Compilar para Produção (Build):**
   Caso vá disponibilizar o sistema em homologação/produção, ou queira assegurar que todas as variações estruturais foram atualizadas devidamente nos bundles físicos da aplicação, execute o build completo:

   ```bash
   npm run build
   ```
