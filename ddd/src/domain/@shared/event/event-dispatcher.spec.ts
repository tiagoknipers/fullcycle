import Customer from "../../customer/entity/customer";
import CustomerChangedAddressEvent from "../../customer/event/customer-changed-address.event";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import SendFirstMessageWhenCustomerIsCreatedHandler from "../../customer/event/handlers/send-first-message-when-customer-is-created.handler";
import SendMessageWhenCustomerAddressIsChangedHandler from "../../customer/event/handlers/send-message-when-customer-addresss-is-changed.handler";
import SendSecondMessageWhenCustomerIsCreatedHandler from "../../customer/event/handlers/send-second-message-when-customer-is-created.handler";
import Address from "../../customer/value-object/address";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {

    it("should register an event handler", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
    });

    it("should unregister an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregister("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0);
    });

    it("should unregister all event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregisteraAll();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeUndefined();
    });

    it("should notify all event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        const productCreatedEvent = new ProductCreatedEvent({
            name: "Product 1",
            description: "Product 1 description",
            price: 10.0,
        });

        // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado.
        eventDispatcher.notify(productCreatedEvent);
        expect(spyEventHandler).toHaveBeenCalled();
    });

    it("should notify when customer is created", () => {
        const eventDispatcher = new EventDispatcher();
        const sendFirstMessageWhenCustomerIsCreatedHandler = new SendFirstMessageWhenCustomerIsCreatedHandler();
        const sendSecondMessageWhenCustomerIsCreatedHandler = new SendSecondMessageWhenCustomerIsCreatedHandler();
        const spySendFirstMessageWhenCustomerIsCreatedHandler = jest.spyOn(sendFirstMessageWhenCustomerIsCreatedHandler, "handle");
        const spySendSecondMessageWhenCustomerIsCreatedHandlerr = jest.spyOn(sendSecondMessageWhenCustomerIsCreatedHandler, "handle");
    
        eventDispatcher.register("CustomerCreatedEvent", sendFirstMessageWhenCustomerIsCreatedHandler);
        eventDispatcher.register("CustomerCreatedEvent", sendSecondMessageWhenCustomerIsCreatedHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
    
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(sendFirstMessageWhenCustomerIsCreatedHandler);
    
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(sendSecondMessageWhenCustomerIsCreatedHandler);
    
        const customerCreatedEvent = new CustomerCreatedEvent({      
          id: "1",
          name: "Tiago"
        });

        eventDispatcher.notify(customerCreatedEvent);
        expect(spySendFirstMessageWhenCustomerIsCreatedHandler).toHaveBeenCalled();
        expect(spySendSecondMessageWhenCustomerIsCreatedHandlerr).toHaveBeenCalled(); 
    });   

    it("should notify when customer address is changed", () => {
        const eventDispatcher = new EventDispatcher();
        const sendMessageWhenCustomerAddressIsChangedHandler = new SendMessageWhenCustomerAddressIsChangedHandler();        
        const spySendMessageWhenCustomerAddressIsChangedHandler = jest.spyOn(sendMessageWhenCustomerAddressIsChangedHandler, "handle");
        eventDispatcher.register("CustomerChangedAddressEvent", sendMessageWhenCustomerAddressIsChangedHandler);
        
        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]).toMatchObject(sendMessageWhenCustomerAddressIsChangedHandler);
    
        const customer = new Customer("1", "Tiago");
        const address = new Address("Rua Central", 100, "89107-000", "Pomerode");  
        customer.changeAddress(address);
    
        const customerChangedAddressEvent = new CustomerChangedAddressEvent(customer);    
        eventDispatcher.notify(customerChangedAddressEvent);
    
        expect(spySendMessageWhenCustomerAddressIsChangedHandler).toHaveBeenCalled();        
      });
});