import Address from "./address";
import Customer from "./customer";
describe("Customer unit tests", () => {
    test("should throw error when id is empty", () => {
        expect(() => {
            let customer = new Customer("", "Rafael");
        }).toThrow('Id is required');
    })
    test("should throw error when name is empty", () => {
        expect(() => {
            let customer = new Customer("1", "");
        }).toThrow('Name is required');
    })
    test("should change name", () => {
        let customer = new Customer("1", "Rafael");
        customer.changeName('Rafael Railton')
        expect(customer.name).toBe('Rafael Railton');
    })
    test("should throw error when address is undefined when you activate a customer", () => {
       
        expect(() => {
            let customer = new Customer("1", "Costumer 1")
            customer.activate();
        }).toThrowError('Address is mandatory to activate a customer');
    })
    test("should activate customer", () => {
        let customer = new Customer("1", "Costumer 1")
        const address = new Address('Street 1', 12, '12323-657', 'Manaus')
        customer.Address = address;
        customer.activate();
        expect(customer.isActive()).toBe(true);
    })
    test("should deactivate customer", () => {
        let customer = new Customer("1", "Costumer 1")
        customer.deactivate();
        expect(customer.isActive()).toBe(false);
    })
})