class OrdersDTO {
  constructor({ id, quantity, total_price, status, created_at, goods }) {
    this.order_id = id;
    this.quantity = quantity;
    this.total_price = total_price;
    this.status = status;
    this.created_at = created_at;
    this.goods = {
      goods_id: goods.id,
      name: goods.name,
    };
    this.merchant = {
      id_merchant: goods.merchant.id,
      name_shop: goods.merchant.name_shop,
    };
  }
  static fromArray(ordersArray) {
    return ordersArray.map((orders) => new OrdersDTO(orders));
  }
}

export { OrdersDTO };
