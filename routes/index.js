var express = require("express");
var got = require("got");
var uuid = require("uuid").v4;

var router = express.Router();

var secretKey = process.env.API_KEY;
var clientKey = process.env.CLIENT_KEY;

router.get("/", function (req, res) {
  res.render("index", {
    title: "구매하기",
    orderId: uuid(),
    orderName: "中国",
    customerName: "Citcon001",
    clientKey: clientKey,
  });
});

router.get("/pay", function (req, res) {
    res.render("payment", {
      title: "Payment",
      orderId: uuid(),
      orderName: "Cake",
      customerName: "Citcon002",
      pay: "CARD",
      wallet: "UNIONPAY",
      clientKey: clientKey,
      amount: 100,
    });
  });

  router.get("/auth", function (req, res) {
    console.log(req.body)
    got
    .post("https://api.tosspayments.com/v1/connectpay/authorizations/access-token", {
      headers: {
        Authorization:
          "Basic " + Buffer.from(secretKey + ":").toString("base64"),
        "Content-Type": "application/json",
      },
      json: {
        grantType: "AuthorizationCode",
        code: req.query.code,
        customerKey: req.query.customerKey,
      },
      responseType: "json",
    })
    .then(function (response) {
      console.log(response.body);

      res.status(200).json({

      });
    })
    .catch(function (error) {
        res.status(500).json({

        });
    });
  });

router.get("/vault", function (req, res) {
    res.render("vault", {
        title: "Connect Pay",
        orderId: uuid(),
        orderName: "Cake",
        customerKey: "Citcon009",
        clientKey: clientKey,
        amount: 100,
      });
  });

  router.post("/notification", function (req, res) {
    console.log(req.body)
    res.status(200).send('success');
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
      responseType: "json",
    })
    .then(function (response) {
      console.log(response.body);

      res.render("success", {
        title: "성공적으로 구매했습니다",
        amount: response.body.totalAmount,
        json: JSON.stringify(response.body,null,4),
      });
    })
    .catch(function (error) {
      res.redirect(
        `/fail?code=${error.response?.body?.code}&message=${error.response?.body?.message}`
      );
    });
});

router.get("/fail", function (req, res) {
  res.render("fail", {
    message: req.query.message,
    code: req.query.code,
  });
});

module.exports = router;
