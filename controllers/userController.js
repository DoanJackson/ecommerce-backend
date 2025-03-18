async function becomeMerchant(req, res) {
  const { user } = req;
  console.log(user);

  // await user.createClient();
  res.send("You are now a merchant!");
}

export { becomeMerchant };
