# Roteiro de apresentação — Organizaê Bootstrap

**Antes de gravar:** abra o projeto no GitHub Codespaces e execute o site usando a visualização do navegador (por exemplo, com a extensão Live Server). Mostre a página e os três arquivos.

## 1. Introdução
**Na tela:** página inicial.

“Olá, professor! Vou apresentar o Organizaê, uma página de organização de estudos desenvolvida com HTML5, Bootstrap 5, CSS e JavaScript. Ela reúne os seis componentes solicitados na atividade e funciona em diferentes tamanhos de tela.”

## 2. Navbar
**Na tela:** clique no menu e depois reduza a janela.

“A barra de navegação utiliza as classes `navbar`, `navbar-expand-lg` e `collapse` do Bootstrap. Em telas menores, o menu se transforma em um botão.”

## 3. Carrossel
**Na tela:** avance e volte os slides.

“O carrossel tem três slides, indicadores e botões de navegação. O Bootstrap controla a troca de slides com o componente `carousel`.”

## 4. Cards
**Na tela:** role até Recursos.

“Os três cards apresentam as funcionalidades do painel. Usei `row-cols-1` e `row-cols-md-3` para que eles fiquem empilhados no celular e lado a lado em telas maiores.”

## 5. Tabela
**Na tela:** mostre a tabela e reduza a largura do navegador.

“A tabela apresenta atividade, disciplina, prazo e situação. Usei `table-striped` para alternar as cores das linhas e `table-responsive` para permitir a visualização em telas pequenas.”

## 6. Formulário e modal
**Na tela:** preencha o formulário e envie.

“O formulário tem campos com validação HTML5. Quando os dados são válidos, o JavaScript adiciona a atividade à tabela e abre o modal do Bootstrap para confirmar o cadastro. As atividades adicionadas ficam salvas no navegador usando `localStorage`.”

## 7. Código e responsividade
**Na tela:** abra `index.html`, `estilos.css` e `funcoes.js` no Codespaces e mostre os trechos citados.

“O `index.html` contém a estrutura semântica e os componentes do Bootstrap. O `estilos.css` personaliza cores e espaçamentos. O `funcoes.js` faz a validação, o cadastro, a atualização da tabela e a abertura do modal. Testei o layout em tamanhos de celular, tablet e computador.”

**Atenção:** diga que testou os tamanhos apenas depois de fazer os testes. Teste também Chrome, Firefox, Edge e Safari, quando disponível.

## 8. Encerramento
“Esse foi o Organizaê. O projeto demonstra o uso dos componentes do Bootstrap 5 em uma página responsiva e funcional. Obrigada!”


## Atualização: concluir atividades
Na tabela, clique em **Concluir** para mudar o estado para concluída. O botão passa a mostrar **Reabrir**. No arquivo `funcoes.js`, mostre as funções `alternarConclusaoAtividade()`, `salvarAtividades()` e `listarAtividades()`. Explique que os dados ficam no `localStorage` do navegador.
