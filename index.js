const readline = require('readline-sync')

function start() {
    const content = {}

    //termo de busca
    content.searchTerm = askAndReturnSearchTerm()
    //esse prefixo vai ser utilizado quando fizer o upload no YouTube
    //para o título ficar mais "humanamente" legível
    content.prefix = askAndReturnPrefix()

    function askAndReturnSearchTerm() {
        //vai rodar o método question da biblioteca readline 
        //e vai retornar o resultado (o input do usuário)
        //e injeta na propriedade searchTerm
        return readline.question('Type a Wikipedia search term: ')
    }

    function askAndReturnPrefix() {
        //select de opções que retorna uma chave como resultado(chave que foi selecionada pelo usuário)
        const prefixes = ['Who is', 'What is', 'The history of']
        //pega o indice do array
        const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Choose one option: ')
        //pega o texto do indice
        const selectedPrefixText = prefixes[selectedPrefixIndex]
        //injeta o valor do texto na propriedade prefix
        return selectedPrefixText
    }

    console.log(content)
}

start()
