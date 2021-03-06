/// <reference types="Cypress" />

const randomNumber = () => Cypress._.random(100, 999)

const testingNumber = randomNumber()

describe('Go to url', () => {
    it('Go to url', () => {
        cy.visit('/spaces/aa?occasion%5BgoodForMeeting%5D=true')
    })

    it('Change language to Thai', () => {
        cy.contains('TH').contains('TH')
            .click()
    })
})

describe('Submit Enquiry', () => {

    const monthFormat = () => {
        switch(Cypress.moment().format('MM')) {
            case "01":
                return "ม.ค."
            case "02":
                return "ก.พ."
            case "03":
                return "มี.ค."
            case "04":
                return "เม.ย."
            case "05":
                return "พ.ค."
            case "06":
                return "มิ.ย."
            case "07":
                return "ก.ค."
            case "08":
                return "ส.ค."
            case "09":
                return "ก.ย."
            case "10":
                return "ต.ค."
            case "11":
                return "พ.ย."
            case "12":
                return "ธ.ค."
        }
    }

    let date = monthFormat() + Cypress.moment().format(' D, YYYY')
    let localStorage

    before(() => {
        cy.request({
            method: 'POST',
            url: '/_api/guest/login?locale=th&_v=1',
            body: {
                email: 'venuee.tester@gmail.com',
                password: 'venuee123',
                termAccepted: false
            }
        })
        .then((resp) => {
            localStorage = JSON.stringify({
                value: resp.body.user,
                exp: null
            })
        })
        cy.loginWithUI()
    })

    beforeEach(() => {
        Cypress.Cookies.preserveOnce('v_token')
        window.localStorage.setItem('v.user', localStorage)
    })

    it('Space page: Can press "Check price"', () => {
        cy.contains('เช็คราคา')
            .click()
    })

    it('Space page: Can fill correctly', () => {
        cy.get('[placeholder="วันที่"]')
            .click()
        cy.get('[class="CalendarDay CalendarDay_1 CalendarDay__default CalendarDay__default_2 CalendarDay__today CalendarDay__today_3 CalendarDay__selected CalendarDay__selected_4"]')
            .click()
            .type('{esc}')
        cy.get('[class="col-md-5 col-xs-5"]')
            .first()
            .click()
        cy.contains('00:00')
            .click()
        cy.get('[class="col-md-5 col-xs-5"]')
            .last()
            .click()
        cy.contains('10:00')
            .click()
        cy.get('[placeholder="จำนวนคน"]')
            .type('5')
    })

    it('Space page: Calculate correctly', () => {
        cy.wait(3000)
        cy.contains('ราคาทั้งหมด (รวม VAT)') //included VAT
            .siblings()
            .invoke('text')
            .then((text => {
                expect(parseFloat((text.slice(1)).replace(/,/g, ''))).to.equal(5000.00)
            }))
        cy.contains('ราคาทั้งหมด (รวม VAT)') //total price
            .parent()
            .prev()
            .children()
            .last()
            .invoke('text')
            .then((text => {
                expect(parseFloat((text.slice(1)).replace(/,/g, ''))).to.equal(5000.00)
            }))
    })

    it('Space page: Can press "Request to book"', () => {
        cy.contains('ขอจอง')
            .click()
    })

    it('Event detail form: Can get value from space page', () => {
        cy.get('[placeholder="วันที่จัดงาน"]')
            .should("have.value", date)
        cy.get('[name="eventDateWithTimes[0].startTime"]')
            .should('have.value', '00:00')
        cy.get('[name="eventDateWithTimes[0].endTime"]')
            .should('have.value', '10:00')
        cy.get('[placeholder="จำนวนคน"]')
            .should('have.value', '5')
    })

    it('Event detail form: Fill the form correctly', () => {
        cy.get('input[name="occasion"]')
            .siblings()
            .click()
        cy.contains('สัมมนา')
            .click()
        cy.contains('ขอจองในนามบริษัทและขอภาษีหัก ณ ที่จ่าย')
            .click()
        cy.get('[placeholder="แจ้งโฮสต์ให้ทราบว่า คุณต้องการใช้พื้นที่อย่างไร ต้องการอาหารหรือเครื่องดื่มหรือไม่"]')
            .type(`Test: Request to book (${testingNumber})`)
    })

    it('Event detail form: Show detail and calculate correctly', () => {
        cy.contains('฿500 x 10 ชั่วโมง') // Standard price
            .parent()
            .parent()
            .siblings()
            .invoke('text')
            .then((text => {
                expect(parseFloat((text.slice(1)).replace(/,/g, ''))).to.equal(5000.00)
            }))
        cy.contains('ราคาทั้งหมด (รวม VAT)') // Total price (excluded VAT)
            .siblings()
            .invoke('text')
            .then((text => {
                expect(parseFloat((text.slice(1)).replace(/,/g, ''))).to.equal(4859.81)
            }))
        cy.contains('ภาษีมูลค่าเพิ่ม 7%') // Booking VAT 7%
            .parent()
            .siblings()
            .children()
            .invoke('text')
            .then((text => {
                expect(parseFloat((text.slice(1)).replace(/,/g, ''))).to.equal(327.10)
            }))
        cy.contains('หัก 3% ในนามบริษัท') // Withholding Tax 3%
            .parent()
            .siblings()
            .children()
            .invoke('text')
            .then((text => {
                expect(parseFloat((text.slice(2)).replace(/,/g, ''))).to.equal(140.19)
            }))
        cy.contains('ราคาทั้งหมด (รวม VAT)') // Included VAT
            .siblings()
            .invoke('text')
            .then((text => {
                expect(parseFloat((text.slice(1)).replace(/,/g, ''))).to.equal(4859.81)
            }))
    })

    it('Event detail form: Submit', () => {
        cy.get('[type="submit"]')
            .click()
    })
})