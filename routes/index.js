var express = require("express");
var got = require("got");
var uuid = require("uuid").v4;

var router = express.Router();

var secretKey = "test_ak_mnRQoOaPz8LwjZD1Oljry47BMw6v";

router.get("/", function (req, res) {
  res.render("index", {
    title: "구매하기",
    orderId: uuid(),
    customerName: "김토스",
  });
});

router.get("/success", function (req, res) {
  got
    .post("https://api.tosspayments.com/v1/payments/" + req.query.paymentKey, {
      headers: {
        Authorization:
          "Basic " + Buffer.from(secretKey + ":").toString("base64"),
        "Content-Type": "application/json",
      },
      json: {
        orderId: req.query.orderId,
        amount: req.query.amount,
      },
    })
    .then(function (confirmResponse) {
      // TODO: 구매 완료 비즈니스 로직 구현

      res.render("success", {
        title: "성공적으로 구매했습니다",
        amount: confirmResponse.body.totalAmount,
        receiptUrl: confirmResponse.body.receiptUrl,
      });
    })
    .catch(function (failResponse) {
      res.redirect("/fail");
    });
});

router.get("/fail", function (req, res) {
  res.render("fail", {
    message: req.query.message,
    code: req.query.code,
  });
});

module.exports = router;
