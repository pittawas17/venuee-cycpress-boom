/// <reference types="Cypress" />

describe('Login Testing', () => {
    
	it('Go to url', () => {
	   cy.visit('/')
    })

	// it('Close modal', () => {
	// 	cy.get('[class="AnnouncementModal__CloseButtonContainer-s1oozu1l-1 bmdyJR"]')
	// 		.click()
    // })

    it('Change language', () => {
        cy.contains('TH').contains('TH')
            .click()
    })

	// it('Close modal', () => {
	// 	cy.get('[class="AnnouncementModal__CloseButtonContainer-s1oozu1l-1 bmdyJR"]')
	// 		.click()
    // })

	it('Login', () => {
		cy.contains('เข้าสู่ระบบ')
            .click()
        cy.get('[placeholder="อีเมล"]')
            .type('venuee.tester@gmail.com')
        cy.get('[placeholder="รหัสผ่าน"]')
            .type('venuee123{enter}')
        cy.contains('ยืนยันหมายเลขโทรศัพท์')
            .find('[icon="close"]')
            .click()
        cy.contains('เจ้าของสถานที่')
    })
})