const algorihtmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey
const sentencesBoundaryDetection = require('sbd')

async function robot(content) {
    await fetchContentFromWikipedia(content) //baixa o conteúdo do Wikipedia
    sanitizeContent(content) //limpa o conteudo
    breakContentIntoSentences(content) //quebra em sentenças

    console.log(fetchContentFromWikipedia())

    async function fetchContentFromWikipedia(content) {
        //retorna uma instância autenticada do algorithmia
        const algorihtmiaAuthenticated = algorihtmia(algorithmiaApiKey)
        //através da instância autenticada consegue-se chegar ao algoritmo por meio do método algo
        const wikipediaAlgotithm = algorihtmiaAuthenticated.algo('web/WikipediaParser/0.1.2')
        //o método pipe aceita por parâmetro o conteúdo que se deseja buscar no wikipedia
        const wikipediaResponde = await wikipediaAlgotithm.pipe(content.searchTerm)
        //quando executa o método get(), o conteúdo do wikipedia cai dentro da variável wikipediaContent
        const wikipediaContent = wikipediaResponde.get()
        //console.log(wikipediaContent)
        content.sourceContentOriginal = wikipediaContent.content
    }

    function sanitizeContent(content) {
        const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.sourceContentOriginal)
        const withoutDatesInParentheses = removeDatesInParentheses(withoutBlankLinesAndMarkdown)

        content.sourceContentSanitized = withoutDatesInParentheses

        function removeBlankLinesAndMarkdown(text) {
            const allLines = text.split('\n')

            const withoutBlankLinesAndMarkdown = allLines.filter((line) => {
                if (line.trim().length === 0 || line.trim().startsWith('=')) {
                    return false
                }
                return true
            })

            return withoutBlankLinesAndMarkdown.join(' ')
        }
    }

    function removeDatesInParentheses(text) {
        return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g, ' ')
    }

    function breakContentIntoSentences(content) {
        content.sentences = []

        const sentences = sentencesBoundaryDetection.sentences(content.sourceContentSanitized)
        sentences.forEach((sentence) => {
            content.sentences.push({
                text: sentence,
                keywords: [],
                images: []
            })
        })
    }
}

module.exports = robot