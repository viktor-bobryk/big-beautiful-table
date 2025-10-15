export interface IProductInventoryForecast {
    carts: number;
    qty: number;
    shelves: number;
    targetDate: string;
}

export interface IExportedOrderQty {
    qty: number;
    shelves: number;
    carts: number;
    shipmentDate: string;
}

export interface IOrdersItem {
    id: number;
    store: {
        id: number;
        name: string;
        address: {
            city: string;
            state: string;
        };
        shipZone: {
            id: number;
            code: string;
            description: string;
        };
        group: {
            id: string;
            name: string;
        };
    };
    product: {
        id: number;
        code: {
            id: number;
            code: string;
        };
        itemDescription: string;
        program: {
            id: number;
            name: string;
        };
        category: {
            id: number;
            name: string;
            description: string;
        };
        inventory: {
            onHand: number;
            days: number;
        };
    };
    onOrder: {
        qty: number;
        shelves: number;
        carts: number;
    };
    availability: {
        id: number;
        qty: number;
        updatedQty: number;
        updatedShelves: number;
    };
    predictedDemand: {
        qty: number;
        shelves: number;
    };
    orderQuantity: {
        id: number;
        shipmentDate: string;
        qty: number;
        shelves: number;
        carts: number;
        exportedOrderQty: IExportedOrderQty;
        forecast: IProductInventoryForecast;
    }[];
}

export interface IProductsResponseData {
    orderBatchId: string;
    result: {
        page: number;
        size: number;
        sort: string;
        totalElements: number;
        totalPages: number;
        results: IOrdersItem[];
    };
}

export interface IProductsState {
    orders: {
        data: IProductsResponseData;
        statuses: Record<string, unknown>;
        errors: Record<string, unknown>;
        lastRequestId: Record<string, unknown>;
    };
}
