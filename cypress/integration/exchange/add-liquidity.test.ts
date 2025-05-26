describe('Add Liquidity', () => {
  it('loads the two correct tokens', () => {
    cy.visit('/add/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56')
    cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'WAG')
    cy.get('#add-liquidity-input-tokenb #pair').should('contain.text', 'BUSD')
  })

  it('loads the VLX and tokens', () => {
    cy.visit('/add/VLX/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82')
    cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'VLX')
    cy.get('#add-liquidity-input-tokenb #pair').should('contain.text', 'WAG')
  })

  it('loads the WVLX and tokens', () => {
    cy.visit('/add/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82')
    cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'WVLX')
    cy.get('#add-liquidity-input-tokenb #pair').should('contain.text', 'WAG')
  })

  it('does not crash if VLX is duplicated', () => {
    cy.visit('/add/VLX/VLX')
    cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'VLX')
    cy.get('#add-liquidity-input-tokenb #pair').should('not.contain.text', 'VLX')
  })

  it('does not crash if address is duplicated', () => {
    cy.visit('/add/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82')
    cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'WAG')
    cy.get('#add-liquidity-input-tokenb #pair').should('not.contain.text', 'WAG')
  })

  it('token not in storage is loaded', () => {
    cy.visit('/add/0xD74b782E05AA25c50e7330Af541d46E18f36661C/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82')
    cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'QUACK')
    cy.get('#add-liquidity-input-tokenb #pair').should('contain.text', 'WAG')
  })

  it('single token can be selected', () => {
    cy.visit('/add/0xD74b782E05AA25c50e7330Af541d46E18f36661C')
    cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'QUACK')
    cy.visit('/add/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56')
    cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'BUSD')
    cy.visit('/add/VLX')
    cy.get('#add-liquidity-input-tokena #pair').should('contain.text', 'VLX')
  })

  it('redirects /add/token-token to add/token/token', () => {
    cy.visit('/add/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82-0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56')
    cy.url().should(
      'contain',
      '/add/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    )
  })

  it('redirects /add/VLX-token to /add/VLX/token', () => {
    cy.visit('/add/VLX-0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82')
    cy.url().should('contain', '/add/VLX/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82')
  })

  it('redirects /add/token-VLX to /add/token/VLX', () => {
    cy.visit('/add/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82-VLX')
    cy.url().should('contain', '/add/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/VLX')
  })

  it('redirects /add/WVLX to /add/WVLX/token', () => {
    cy.visit('/add/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c-0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82')
    cy.url().should(
      'contain',
      '/add/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    )
  })

  it('redirects /add/token-WVLX to /add/token/WVLX', () => {
    cy.visit('/add/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82-0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c')
    cy.url().should(
      'contain',
      '/add/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    )
  })
})
