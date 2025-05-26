describe('Remove Liquidity', () => {
  it('redirects from address-address to address/address', () => {
    cy.visit('/remove/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82-0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56')
    cy.url().should(
      'contain',
      '/remove/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    )
  })

  it('vlx-cake remove', () => {
    cy.visit('/remove/VLX/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82')
    cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'VLX')
    cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'WAG')
  })

  it('cake-vlx remove', () => {
    cy.visit('/remove/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/VLX')
    cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'WAG')
    cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'VLX')
  })

  it('loads the two correct tokens', () => {
    cy.visit('/remove/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56')
    cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'WAG')
    cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'BUSD')
  })

  it('does not crash if VLX is duplicated', () => {
    cy.visit('/remove/VLX/VLX')
    cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'VLX')
    cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'VLX')
  })

  it('does not crash if token is duplicated', () => {
    cy.visit('/remove/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82')
    cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'WAG')
    cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'WAG')
  })

  it('token not in storage is loaded', () => {
    cy.visit('/remove/0xD74b782E05AA25c50e7330Af541d46E18f36661C/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82')
    cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'QUACK')
    cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'WAG')
  })
})
