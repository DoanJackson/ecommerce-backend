class OrdersMerchantDTO {
  constructor({
    id,
    user_id,
    quantity,
    total_price,
    status,
    created_at,
    goods,
  }) {
    this.order_id = id;
    this.user_id = user_id;
    this.quantity = quantity;
    this.total_price = total_price;
    this.status = status;
    this.created_at = created_at;
    this.goods = {
      goods_id: goods.id,
      name: goods.name,
    };
  }
  static fromArray(ordersMerchantArray) {
    return ordersMerchantArray.map((orders) => new OrdersMerchantDTO(orders));
  }
}

export { OrdersMerchantDTO };
