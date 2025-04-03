class GoodsDetailDTO {
  constructor({
    id,
    name,
    quantity,
    number_sold,
    price,
    description,
    created_at,
    types,
    merchant,
  }) {
    this.id = id;
    this.name = name;
    this.quantity = quantity;
    this.number_sold = number_sold;
    this.price = price;
    this.description = description;
    this.created_at = created_at;
    this.types = types?.map((type) => type.name) ?? [];
    this.merchant = merchant;
  }
}

export { GoodsDetailDTO };
