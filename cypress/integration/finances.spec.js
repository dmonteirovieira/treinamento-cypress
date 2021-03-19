/// <reference types="cypress" />

import { format, prepareLocalStorage } from '../support/utils'

// cy.viewereport
// arquivos de config
// configs por linah de comando que é passado ao abrir o cypress.

context('Dev Finances Agilizei', () => {

    //hooks
    //trechos que executam antes e depois do teste
    // before -> antes de cada testes
    //beforeEach -> antes de cada teste
    //after -> depois de todos os testes
    // afterEach -> depois de cada teste

    beforeEach(() => {
        cy.visit('https://devfinance-agilizei.netlify.app', {
            onBeforeLoad: (win) => {
                prepareLocalStorage (win)
            }
        })

        //cy.get('#data-table tbody tr').should('have.length', 0)
    });

     //- entender o fluxo manualmente
     //- mapear os elementos que vamos interagir
     //- descrver as interações com o cypress
     //- adicionar as asserçoes que a gente 

    it('Cadastrar entradas', () => {
        cy.get('#transaction .button').click() // id + classe
        cy.get('#description').type('Salario') // id
        cy.get('[name=amount]').type(1000) // atributos
        cy.get('[type=date]').type('2021-03-17') //atributos
        cy.get('button').contains('Salvar').click() // tipo e valor

        cy.get('#data-table tbody tr').should('have.length', 3) // validando que tabela tem 1 registro depois de uma inserção
    }); 

    it('Cadastrar saídas', () => {
        cy.get('#transaction .button').click() // id + classe
        cy.get('#description').type('compra mercado') // id
        cy.get('[name=amount]').type(-500) // atributos
        cy.get('[type=date]').type('2021-03-17') //atributos
        cy.get('button').contains('Salvar').click() // tipo e valor

        cy.get('#data-table tbody tr').should('have.length', 3) // validando que tabela tem 1 registro depois de uma inserção     
    });

    it('Remover entradas e saídas', () => {
        /*
        const entrada = 'Frela'
        const saida   = 'suporte teclado'

        cy.get('#transaction .button').click() // id + classe
        cy.get('#description').type(entrada) // id
        cy.get('[name=amount]').type(330) // atributos
        cy.get('[type=date]').type('2021-03-17') //atributos
        cy.get('button').contains('Salvar').click() // tipo e valor

        cy.get('#transaction .button').click() // id + classe
        cy.get('#description').type(saida) // id
        cy.get('[name=amount]').type(-45) // atributos
        cy.get('[type=date]').type('2021-03-17') //atributos
        cy.get('button').contains('Salvar').click() // tipo e valor
        */
        //estratégia 1: voltar para o elemento pai, e avançar para um td
        cy.get('td.description')
          //.contains(entrada) v.1
          .contains('Mesada')
          .parent() //pesquisar a partir do elemento pai
          .find('img[onclick*=remove]') //busca pelo elemento 
          .click()

        // estratégia 2: buscar todos os irmãos, e buscar o que tem img + attr
        cy.get('td.description')
          //.contains(saida) v1
          .contains('Suco Kapo')
          .siblings() //navega para os elementos irmãos
          .children('img[onclick*=remove') //filho com a caracteristica
          .click()  

          cy.get('#data-table tbody tr').should('have.length', 0) // validando que tabela tem 0 registro depois da deleção
    });

    it('Valida Saldo com diversas entradas e saida', () => {
        /*
        const entrada = 'Frela'
        const saida   = 'suporte teclado'

        cy.get('#transaction .button').click() // id + classe
        cy.get('#description').type(entrada) // id
        cy.get('[name=amount]').type(330) // atributos
        cy.get('[type=date]').type('2021-03-17') //atributos
        cy.get('button').contains('Salvar').click() // tipo e valor

        cy.get('#transaction .button').click() // id + classe
        cy.get('#description').type(saida) // id
        cy.get('[name=amount]').type(-45) // atributos
        cy.get('[type=date]').type('2021-03-17') //atributos
        cy.get('button').contains('Salvar').click() // tipo e valor
        */
        //capturar as linhas com as transações e as colunas com valores
        //capturar os textos
        //formatar os valores das linhas

        //somar os valores de entradas e saídas
        //capturar o texto do total
        //comparar o somatorio de entradas e despesas com o total

        let incomes = 0
        let expenses = 0

        cy.get('#data-table tbody tr')
          .each(($el, index, $list) => { // serve para navegar em cada item de uma lista e executar uma ação, mais ou menos igual um laço de repetição 3 elemntos(qual elemento, qual indice, a lista)
            
            cy.get($el).find('td.income, td.expense').invoke('text').then(text => {
                if(text.includes('-')){
                    expenses = expenses + format(text)
                } else {
                    incomes = incomes + format(text)
                }
                
                cy.log('entradas', incomes)
                cy.log('saida', expenses)
            })
          })
        
        cy.get('#totalDisplay').invoke('text').then(text =>{
            //cy.log('valor total', format(text))
            let formattedTotalDisplay = format(text)
            let expectedTotal = incomes + expenses
            
            expect(formattedTotalDisplay).to.eq(expectedTotal)

        })

    });

     //- entender o fluxo manualmente
     //- mapear os elementos que vamos interagir
     //- descrver as interações com o cypress
     //- adicionar as asserçoes que a gente 
});