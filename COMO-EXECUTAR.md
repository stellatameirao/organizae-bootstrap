# Como executar no GitHub Codespaces

1. Crie um repositório no GitHub, por exemplo `organizae-bootstrap-atv-atv`.
2. Abra o repositório e clique em **Code > Codespaces > Create codespace on main**.
3. Envie os arquivos `index.html`, `estilos.css` e `funcoes.js` para a raiz do repositório.
4. Abra o `index.html` usando um servidor local no Codespaces, como a extensão **Live Server**, e abra a porta encaminhada no navegador. Alternativamente, no terminal, execute `python3 -m http.server 8000` e abra a porta 8000 na aba **Ports**.
5. Teste os seis componentes e a responsividade usando as ferramentas de desenvolvedor do navegador.
6. Faça commit e push dos arquivos para o GitHub.
7. Grave o vídeo obrigatório demonstrando a página funcionando e os trechos do código.

**Observações:** é necessário acesso à internet para carregar o Bootstrap pelo CDN. O formulário é uma demonstração local: não envia e-mails nem grava dados em servidor. Os cadastros ficam no `localStorage` do navegador. O projeto não utiliza React, Node ou bibliotecas adicionais.
