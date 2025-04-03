class GoodsDTO {
  constructor({ id, name, quantity, number_sold, price, types, merchant }) {
    this.id = id;
    this.name = name;
    this.quantity = quantity;
    this.number_sold = number_sold;
    this.price = price;
    this.types = types?.map((type) => type.name) ?? [];
    this.merchant = merchant;
  }
  static fromArray(goodsArray) {
    return goodsArray.map((goods) => new GoodsDTO(goods));
  }
}

export { GoodsDTO };
