class GoodsMerchantDTO {
  constructor({
    id,
    name,
    quantity,
    number_sold,
    price,
    description,
    created_at,
    types,
  }) {
    this.id = id;
    this.name = name;
    this.quantity = quantity;
    this.number_sold = number_sold;
    this.price = price;
    this.description = description;
    this.created_at = created_at;
    this.types = types?.map((type) => type.name) ?? [];
  }

  static fromArray(goodsArray) {
    return goodsArray.map((goods) => new GoodsMerchantDTO(goods));
  }
}

export { GoodsMerchantDTO };
